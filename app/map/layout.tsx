import Header from "../components/Header";
import { Toaster } from "@/components/ui/sonner";
import "../globals.css";

export default function MapLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="container mx-auto px-6 py-8">
            <Header />
            <main className="mt-8">{children}</main>
            <Toaster />
        </div>
    );
}