import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { DATA_YEAR, fetchCountryGDP } from "@lib/countryData";

const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite"; // free tier on Google AI Studio; the newer flash models are heavily contended there and stall for 15-25s or return 503
const REQUEST_TIMEOUT_MS = 12_000; // a lookup this small never legitimately takes this long — fail fast instead of hanging the UI

// Reused across requests so each one does not repeat client setup.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const MAX_QUESTION_LENGTH = 500;

const buildSystemInstruction = (dataset: string) => `You answer questions about one fixed dataset: GNP per person employed by country, in USD, for the year ${DATA_YEAR} only (World Bank indicator SL.GDP.PCAP.EM.KD). The full dataset is listed at the end of this prompt.

Rules:
- Answer only from the dataset. Never use outside knowledge and never estimate a missing value.
- If the question is not about this dataset — anything other than GNP per person employed for the countries listed — reply with exactly: Irrelevant
- If the question is about GNP per person employed but the dataset cannot answer it (another year, or a country that is not listed), reply with exactly: No data
- When asked for a single country's figure, reply with just the number, grouped with commas — e.g. a value of 123456 is written 123,456
- For rankings or comparisons, reply with a short list or one sentence. Never more than about 40 words.
- Never explain your reasoning and never add caveats.

Dataset (country: GNP per person employed, USD, ${DATA_YEAR}), ordered from highest to lowest:
${dataset}`;

export async function POST(request: Request) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return Response.json({ error: "The AI service is not configured." }, { status: 500 });
    }

    let question: unknown;
    try {
        ({ question } = await request.json());
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof question !== "string" || !question.trim()) {
        return Response.json({ error: "A question is required." }, { status: 400 });
    }
    if (question.length > MAX_QUESTION_LENGTH) {
        return Response.json({ error: `Keep the question under ${MAX_QUESTION_LENGTH} characters.` }, { status: 400 });
    }

    const countries = await fetchCountryGDP();
    if (!countries.length) {
        return Response.json({ error: "The GNP data is unavailable right now." }, { status: 503 });
    }

    // Sorted by value so ranking questions ("top 5", "lowest 3") are answered by reading consecutive lines rather than
    // by sorting 176 numbers in-model, which it does unreliably. toSorted keeps the shared cached array untouched, and the
    // order stays deterministic, so the instruction is still byte-identical between requests for Gemini's implicit caching.
    const dataset = countries
        .toSorted((a, b) => b.value - a.value)
        .map((country) => `${country.country.value}: ${country.value}`)
        .join("\n");

    const abort = new AbortController();
    const timeout = setTimeout(() => abort.abort(), REQUEST_TIMEOUT_MS);

    return ai.models
        .generateContent({
            model: MODEL,
            contents: question.trim(),
            config: {
                systemInstruction: buildSystemInstruction(dataset),
                temperature: 0, // a lookup, not a creative answer
                maxOutputTokens: 512,
                // Thinking tokens are drawn from maxOutputTokens, so LOW spends ~250 of them reasoning and the
                // answer itself gets cut off mid-number (finishReason MAX_TOKENS). The dataset is pre-sorted by
                // value, so ranking answers are a read rather than a sort and need no reasoning budget.
                thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
                abortSignal: abort.signal,
            },
        })
        .then((response) => {
            // A truncated answer is worse than none: it reads as a confident, complete reply while cutting off
            // mid-number. Surface it as an error rather than letting a half-written figure reach the user.
            if (response.candidates?.[0]?.finishReason === "MAX_TOKENS") {
                console.error("Gemini hit maxOutputTokens; answer discarded as truncated");
                return Response.json({ error: "That answer was too long to finish — try a narrower question." }, { status: 502 });
            }

            const answer = response.text?.trim();
            return Response.json({ answer: answer || "No data" });
        })
        .catch((error) => {
            if (abort.signal.aborted) {
                console.error(`Gemini request exceeded ${REQUEST_TIMEOUT_MS}ms`);
                return Response.json({ error: "The AI service is taking too long — try again in a moment." }, { status: 504 });
            }
            if (error instanceof ApiError) {
                console.error(`Gemini request failed (${error.status}):`, error.message);
                // A rejected key comes back as 400 API_KEY_INVALID, not 401 — treat it as a config problem, not an outage.
                if (error.status === 401 || error.status === 403 || error.message.includes("API_KEY_INVALID")) {
                    return Response.json({ error: "The AI service is not configured." }, { status: 500 });
                }
                if (error.status === 429) {
                    return Response.json({ error: "Too many questions right now — try again in a moment." }, { status: 429 });
                }
                return Response.json({ error: "The AI service is unavailable right now." }, { status: 502 });
            }
            throw error;
        })
        .finally(() => {
            clearTimeout(timeout);
        });
}
