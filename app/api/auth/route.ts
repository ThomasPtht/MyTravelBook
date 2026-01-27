import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";


export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) return null;

                // Cherche l'utilisateur dans la base
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) return null;

                // Vérifie le mot de passe
                const isValid = await compare(credentials.password, user.password);
                if (!isValid) return null;

                // Retourne l'utilisateur (sans le mot de passe)
                return {
                    id: user.id,
                    email: user.email,
                    username: user.username, // si tu as ce champ
                };
            },
        }),
    ],
}

export default NextAuth(authOptions)