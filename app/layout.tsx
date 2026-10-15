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
        // suppress hydration warning for setting bsTheme below, like what Bootstrap's docs and next-themes do
        <html lang="en" className={outfit.variable} suppressHydrationWarning>
            <head>
                {/* plain <script> run before any next/script such that theme can be applied immediately in UI */}
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
