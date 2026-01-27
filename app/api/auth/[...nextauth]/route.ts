import NextAuth, { Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { verify } from "argon2";
import { JWT } from "next-auth/jwt";


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
                const isValid = await verify(user.password, credentials.password);
                if (!isValid) return null;

                // Retourne l'utilisateur 
                return {
                    id: user.id.toString(),
                    email: user.email,
                    username: user.username,
                };
            },
        }),
    ],
    callbacks: {
        async session({ session, token }: { session: Session; token: JWT }) {
            // @ts-expect-error: id et username sont ajoutés via NextAuth callback
            session.user.id = token.id;
            // @ts-expect-error: username est ajouté via NextAuth callback
            session.user.username = token.username;
            return session;
        },
        async jwt({ token, user }: { token: JWT; user?: User }) {
            if (user) {
                token.id = user.id;
                token.username = (user as any).username;
            }
            return token;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,

};


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };