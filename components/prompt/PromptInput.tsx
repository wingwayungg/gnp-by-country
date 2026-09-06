"use client";

import { SubmitEvent, useState } from "react";
import styles from "./PromptInput.module.scss";

export const PromptInput = () => {
    const [value, setValue] = useState("");
    const [sending, setSending] = useState(false);

    const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!value.trim()) return;
        setSending(true);
        setTimeout(() => setSending(false), 350);
    };

    return (
        <div className={`${styles.glow} position-relative rounded-pill mx-auto mb-3 mb-md-5`}>
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
                    className={`${styles.input} flex-grow-1 bg-transparent border-0`}
                />
                <button
                    type="submit"
                    aria-label="Send prompt"
                    disabled={!value.trim()}
                    className={`${styles.send} ${sending ? styles.sending : ""} flex-shrink-0 d-flex align-items-center justify-content-center rounded-circle border-0`}
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </form>
        </div>
    );
};
