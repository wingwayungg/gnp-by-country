"use client";

import { askQuestion } from "@lib/askQuestion";
import { AskState } from "@type/askType";
import { useActionState } from "react";
import styles from "./PromptInput.module.scss";

export const PromptInput = () => {
    // the form could submit without JS.
    // as tradeoff, the question is cleared every time after submission
    const [state, formAction, pending] = useActionState<AskState, FormData>(askQuestion, { status: "idle" });

    return (
        <div className="mx-auto mb-3 mb-md-5">
            <div className={`${styles.glow} position-relative rounded-pill mx-auto`}>
                <form action={formAction} className={`${styles.bar} d-flex align-items-center gap-2 w-100 rounded-pill bg-body-secondary`}>
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
