"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // specific to Next.js - we want to access document only in useEffect
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        const initialTheme = storedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        if (initialTheme === "dark") {
            // reading the persisted/OS theme requires browser APIs unavailable during SSR, so it can only be resolved after mount
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme("dark");
        }
        document.documentElement.dataset.bsTheme = initialTheme;
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.dataset.bsTheme = newTheme;
    };

    return (
        <button onClick={toggleTheme} className="btn btn-outline-secondary position-fixed top-0 end-0 m-3 z-3 rounded-circle d-flex align-items-center justify-content-center p-2" style={{ width: "40px", height: "40px" }} aria-label="Toggle theme" type="button">
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}
