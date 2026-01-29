import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Await params if it's a Promise (Next.js app router dynamic API route)
        const resolvedParams = await params;
        const userId = Number(session.user.id);
        const id = Number(resolvedParams.id);
        console.log("API /api/destinations/[id] userId:", userId, "id:", id, "params:", resolvedParams);
        if (!id || isNaN(id)) {
            return NextResponse.json({ error: "Invalid id" }, { status: 400 });
        }
        const destinationByID = await prisma.city.findFirst({
            where: { id, userId },
            include: { images: true },
        });

        if (!destinationByID) {
            return NextResponse.json({ error: "Not found" }, { status: 404 });
        }

        return NextResponse.json(destinationByID);
    } catch (error) {
        console.error("API /api/destinations/[id] error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}