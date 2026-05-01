import { Outfit } from "next/font/google";
import "../lib/global.scss";
import ThemeToggle from "@components/ThemeToggle";

const outfit = Outfit({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-outfit",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={outfit.variable}>
            <body>
                <ThemeToggle />
                {children}
            </body>
        </html>
    );
}
