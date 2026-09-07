"use client";

import { SubmitEvent, useRef, useState } from "react";
import styles from "./PromptInput.module.scss";

type PromptResult = { readonly question: string; readonly answer: string } | null;

export const PromptInput = () => {
    const [value, setValue] = useState("");
    const [pending, setPending] = useState(false);
    const [result, setResult] = useState<PromptResult>(null);
    const [error, setError] = useState("");
    const requestRef = useRef<AbortController | null>(null);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        const question = value.trim();
        if (!question || pending) return;

        requestRef.current?.abort(); // drop an in-flight answer the user no longer wants
        const controller = new AbortController();
        requestRef.current = controller;

        setPending(true);
        setError("");
        setResult(null);

        fetch("/api/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
            signal: controller.signal,
        })
            .then((response) => response.json().then((data) => ({ response, data })))
            .then(({ response, data }) => {
                if (!response.ok) {
                    setError(data?.error ?? "Something went wrong.");
                    return;
                }
                setResult({ question, answer: data.answer });
            })
            .catch(() => {
                if (controller.signal.aborted) {
                    setError("AI service timeout");
                    return;
                }
                setError("Could not reach the AI service.");
            })
            .finally(() => {
                if (!controller.signal.aborted) setPending(false);
            });
    };

    return (
        <div className="mx-auto mb-3 mb-md-5">
            <div className={`${styles.glow} position-relative rounded-pill mx-auto`}>
                <form onSubmit={handleSubmit} className={`${styles.bar} d-flex align-items-center gap-2 w-100 rounded-pill bg-body-secondary`}>
                    <span className={`${styles.badge} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle`} aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M4 12L8 4L12 12M4 12H12" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="4" cy="12" r="1.5" fill="white" />
                            <circle cx="12" cy="12" r="1.5" fill="white" />
                            <circle cx="8" cy="4" r="1.5" fill="white" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Ask AI about this data — e.g. “top 5 countries by GNP per person”"
                        aria-label="Ask AI a question about the GNP data"
                        maxLength={500}
                        className={`${styles.input} flex-grow-1 bg-transparent border-0`}
                    />
                    <button type="submit" aria-label="Send prompt" disabled={!value.trim() || pending} className={`${styles.send} ${pending ? styles.sending : ""} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border-0`}>
                        {pending ? (
                            <output className="spinner-border spinner-border-sm" aria-hidden="true" />
                        ) : (
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                                <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>
            <div className={`${styles.answer} mx-auto`} aria-live="polite">
                {pending && <p className="mt-3 mt-md-5 mb-0 text-center text-body-secondary">Thinking…</p>}
                {error && !pending && (
                    <p className="mt-3 mt-md-5 mb-0 text-center text-danger" role="alert">
                        {error}
                    </p>
                )}
                {result && !pending && (
                    <div className={`${styles.card} mt-3 rounded-4 bg-body-secondary`}>
                        <p className={`${styles.question} mb-1`}>{result.question}</p>
                        <p className="mb-0 fs-5 fw-semibold">{result.answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
