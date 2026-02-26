import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);

const handler = NextAuth({
  ...authOptions,
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };