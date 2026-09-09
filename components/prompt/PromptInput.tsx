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
                    <span className={`${styles.badge} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle`} aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M4 12L8 4L12 12M4 12H12" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="4" cy="12" r="1.5" fill="white" />
                            <circle cx="12" cy="12" r="1.5" fill="white" />
                            <circle cx="8" cy="4" r="1.5" fill="white" />
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
