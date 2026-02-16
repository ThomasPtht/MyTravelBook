import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    const { pathname, method } = request.nextUrl;

    // Permet l'accès aux routes d'auth et register sans être connecté
    if (
        pathname.startsWith("/api/auth") ||
        pathname.startsWith("/api/register")
    ) {
        return NextResponse.next();
    }

    // Protège les routes API (POST, PUT, DELETE) - seuls les utilisateurs connectés
    if (pathname.startsWith("/api") && method !== "GET") {
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/:path*"],
};
