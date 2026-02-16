"use client";

import { SessionProvider } from "next-auth/react";
import ReactQueryProvider from "./components/ReactQueryProvider";
import type { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ReactQueryProvider>
                {children}
            </ReactQueryProvider>
        </SessionProvider>
    );
}