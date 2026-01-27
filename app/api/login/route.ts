import { NextResponse } from "next/server";
import * as argon2 from "argon2";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }


    // Hash le mot de passe
    const hashedPassword = await argon2.verify(existingUser.password, password);
    if (!hashedPassword) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });
    }
    const user = existingUser;  
  
    return NextResponse.json({ user });
}