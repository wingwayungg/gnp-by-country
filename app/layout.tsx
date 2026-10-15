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
                {/* NOTE: Next.js does not set any CSP by default
                , so any inline script like from 3rd party libraries are allowed.
                To enhance security, we can set CSP and nonce. */}
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
