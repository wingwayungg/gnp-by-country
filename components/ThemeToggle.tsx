"use client";

import { useLayoutEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // useLayoutEffect (not useEffect) so the button icon is corrected before the browser paints,
    // rather than flashing the wrong icon for a frame after mount. The inline script in
    // app/layout.tsx has already resolved the theme and applied it to <html> before this runs, so
    // read it back from there instead of re-deriving it from localStorage/matchMedia.
    useLayoutEffect(() => {
        if (document.documentElement.dataset.bsTheme === "dark") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setTheme("dark");
        }
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
