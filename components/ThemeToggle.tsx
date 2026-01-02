"use client";

import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        // specific to Next.js - we want to access document only in useEffect
        const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.setAttribute("data-bs-theme", storedTheme);
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setTheme("dark");
            document.documentElement.setAttribute("data-bs-theme", "dark");
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-bs-theme", newTheme);
    };

    return (
        <button
            onClick={toggleTheme}
            className="btn btn-outline-secondary position-fixed top-0 end-0 m-3 z-3 rounded-circle d-flex align-items-center justify-content-center p-2"
            style={{ width: "40px", height: "40px" }}
            aria-label="Toggle theme"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </button>
    );
}
