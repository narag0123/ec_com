import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Roboto } from "next/font/google";
import Header from "./(component)/head/header";

const square = localFont({
    src: "./fonts/NanumSquareNeo/NanumSquareNeo-Variable.woff2",
    variable: "--font-square",
    weight: "100 900",
});

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "700"],
    variable: "--font-roboto",
    display: "swap",
});

export const metadata: Metadata = {
    title: "직무직무",
    description: "직무고시 관리용 웹페이지",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${square.variable} ${roboto.variable} antialiased p-10`}
            >
                <header className="text-[24px] font-square">
                    <Header />
                </header>
                {children}
            </body>
        </html>
    );
}
