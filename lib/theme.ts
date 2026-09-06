// Self-contained on purpose: this is also stringified via .toString() and inlined into a
// <script> tag in app/layout.tsx, so it must not reference anything outside its own body.
export function getInitialTheme() {
    try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark") return stored;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
        return "light";
    }
}
