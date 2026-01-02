import "../lib/global.scss";
import ThemeToggle from "@components/ThemeToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <ThemeToggle />
                {children}
            </body>
        </html>
    );
}
