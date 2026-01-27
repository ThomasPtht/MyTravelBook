import { NextResponse } from "next/server";
import * as argon2 from "argon2";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // Hash le mot de passe
    const hashedPassword = await argon2.hash(password);

    // Crée l'utilisateur
    const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
    });

    return NextResponse.json({ user });
}