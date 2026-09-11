"use client";

import { askQuestion } from "@lib/askQuestion";
import { AskState } from "@type/askType";
import { Component, ErrorInfo, ReactNode, useActionState } from "react";
import styles from "./PromptInput.module.scss";

const IDLE: AskState = { status: "idle" };
const TRANSPORT_ERROR = "Could not reach the server — check your connection and try again.";

// FormData.get widens to string | File, so narrow rather than stringify — the same check askQuestion
// makes on its own side of the request.
const questionOf = (form: HTMLFormElement): string => {
    const submitted = new FormData(form).get("question");
    return typeof submitted === "string" ? submitted.trim() : "";
};

type PromptFormProps = {
    readonly initialState: AskState;
    readonly onQuestion: (question: string) => void;
};

const PromptForm = ({ initialState, onQuestion }: PromptFormProps) => {
    // the form could submit without JS.
    // as tradeoff, the question is cleared every time after submission
    const [state, formAction, pending] = useActionState<AskState, FormData>(askQuestion, initialState);

    return (
        <div className="mx-auto mb-3 mb-md-5">
            <div className={`${styles.glow} position-relative rounded-pill mx-auto`}>
                {/* onSubmit is to record what was typed in PromptInput below for Error Boundary,
                    it does not affect formAction at all and Progressive Enhancement still works. */}
                <form action={formAction} onSubmit={(event) => onQuestion(questionOf(event.currentTarget))} className={`${styles.bar} d-flex align-items-center gap-2 w-100 rounded-pill bg-body-secondary`}>
                    {/* Bootstrap Icons "stars" (MIT, https://icons.getbootstrap.com/icons/stars/), inlined rather
                        than pulling in the package for one glyph.
                        Deliberately not the Gemini sparkle: that is a Google trademark, and Google's brand
                        guidance is that integrators attribute in plain text (see the caption below the bar). */}
                    <span className={`${styles.badge} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle`} aria-hidden="true">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                            <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.73 1.73 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.73 1.73 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.73 1.73 0 0 0 3.407 2.31zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z" />
                        </svg>
                    </span>
                    <input type="text" name="question" required placeholder="Ask AI about this data — e.g. “top 5 countries by GNP per person”" aria-label="Ask AI a question about the GNP data" maxLength={500} className={`${styles.input} flex-grow-1 bg-transparent border-0`} />
                    <button type="submit" aria-label="Send prompt" disabled={pending} className={`${styles.send} ${pending ? styles.sending : ""} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border-0`}>
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
            <p className={`${styles.credit} mt-2 mb-0 text-center`}>Powered by Gemini</p>
            <div className={`${styles.answer} mx-auto`} aria-live="polite">
                {pending && <p className="mt-3 mt-md-5 mb-0 text-center text-body-secondary">Thinking…</p>}
                {state.status === "error" && !pending && (
                    <div className="mt-3 mt-md-5" role="alert">
                        {/* The form is uncontrolled, so React clears the box on submit — repeat the question back or a
                            retryable failure (timeout, rate limit) costs the user everything they typed. */}
                        {state.question && <p className={`${styles.question} mb-1 text-center`}>{state.question}</p>}
                        <p className="mb-0 text-center text-danger">{state.error}</p>
                    </div>
                )}
                {state.status === "answered" && !pending && (
                    <div className={`${styles.card} mt-3 rounded-4 bg-body-secondary`}>
                        <p className={`${styles.question} mb-1`}>{state.question}</p>
                        <p className="mb-0 fs-5 fw-semibold">{state.answer}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

type PromptInputState = {
    readonly failed: boolean;
};

/**
 * Error boundary around the prompt bar, and the only thing standing between the page and a blank screen.
 *
 * `askQuestion` returns an error state for every failure it can see, but it only runs once the request
 * reaches the server. A transport-layer failure — offline, a proxy 502 — rejects inside React instead,
 * and because the action is handed to `<form action>` directly (wrapping it would break the no-JS submit,
 * see the README), nothing in `PromptForm` can catch it. Unhandled, that error unmounts the whole page,
 * table included, over one failed question.
 *
 * Catching it here keeps the blast radius to the prompt bar: the boundary re-mounts the form with the
 * failure already in state, so the answer area shows it like any other error and the user can retry.
 */
export class PromptInput extends Component<object, PromptInputState> {
    // Deliberately not state: it is written during a submit that must not re-render, and only read once
    // the boundary has already caught, so the crashed form can repeat the question back to the user.
    private question = "";

    override state: PromptInputState = { failed: false };

    static getDerivedStateFromError(): PromptInputState {
        return { failed: true };
    }

    override componentDidCatch(error: Error, info: ErrorInfo) {
        console.error("The prompt bar's request never reached the server:", error, info.componentStack);
    }

    private readonly rememberQuestion = (question: string) => {
        this.question = question;
    };

    override render(): ReactNode {
        // React discards the subtree that threw, so the form below is always a fresh mount and takes the
        // seeded error as its initial state — no reset button, and the bar is usable again immediately.
        return <PromptForm initialState={this.state.failed ? { status: "error", question: this.question, error: TRANSPORT_ERROR } : IDLE} onQuestion={this.rememberQuestion} />;
    }
}
