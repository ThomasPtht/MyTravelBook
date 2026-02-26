import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/app/schema/schemas";

export async function POST(request: Request) {
    const body = await request.json();

    // Validation des inputs
    const validated = registerSchema.safeParse(body);
    if (!validated.success) {
        return NextResponse.json(
            { error: "Validation failed", details: validated.error.flatten().fieldErrors },
            { status: 400 }
        );
    }

    const { username, email, password } = validated.data;

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return NextResponse.json({ error: "Registration failed" }, { status: 400 });
    }

    // Hash le mot de passe
const hashedPassword = await bcrypt.hash(password, 10);

    // Crée l'utilisateur
    const user = await prisma.user.create({
        data: { username, email, password: hashedPassword },
    });

    // Exclure le mot de passe de la réponse
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({ user: userWithoutPassword });
}