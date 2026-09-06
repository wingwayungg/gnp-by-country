import { Outfit } from "next/font/google";
import "../lib/global.scss";
import ThemeToggle from "@components/ThemeToggle";
import { getInitialTheme } from "../lib/theme";

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-outfit",
});

export default function RootLayout({ children }: { readonly children: React.ReactNode }) {
    return (
        // suppress hydration warning for setting bsTheme below
        <html lang="en" className={outfit.variable} suppressHydrationWarning>
            <head>
                {/* Runs synchronously before first paint to avoid a light->dark flash on load; see lib/theme.ts and components/ThemeToggle.tsx */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `document.documentElement.dataset.bsTheme=(${getInitialTheme.toString()})()`,
                    }}
                />
            </head>
            <body>
                <ThemeToggle />
                {children}
            </body>
        </html>
    );
}
