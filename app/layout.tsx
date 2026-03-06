import type { ReactNode } from "react";
import "./globals.css";
import { Geist, Geist_Mono, Playfair_Display, Source_Sans_3 } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Providers from "./providers";


const playfairDisplay = Playfair_Display({
    variable: "--font-playfair-display",
    subsets: ["latin"],
    weight: ["400", "700"],
});

const sourceSans3 = Source_Sans_3({
    variable: "--font-source-sans-3",
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "My Travel Book",
    description: "Memories from my trips around the world",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${sourceSans3.variable}  antialiased`}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html >
    );
}