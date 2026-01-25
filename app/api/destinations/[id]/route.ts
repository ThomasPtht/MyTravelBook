import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: idStr } = await params;
        const id = Number(idStr);

        if (!id || isNaN(id)) {
            return NextResponse.json(
                { error: "Invalid ID format" },
                { status: 400 }
            );
        }

        const destination = await prisma.city.findUnique({
            where: { id },
        });

        if (!destination) {
            return NextResponse.json(
                { error: "Destination not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(destination);
    } catch (error) {
        console.error("Error fetching destination:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}