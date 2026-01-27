import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner";
import ReactQueryProvider from "../components/ReactQueryProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Travel Book",
  description: "Memories from my trips around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          
          <div className="container mx-auto px-6 py-8">
            <Header />
            <main className="mt-8">
              {children}
            </main>
          </div>
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
