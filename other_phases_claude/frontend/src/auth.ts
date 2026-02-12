import NextAuth from "next-auth";
import type { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; // You may need: npm install jsonwebtoken

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);
        if (!user || !user.password) throw new Error("User not found");
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!passwordsMatch) throw new Error("Invalid password");
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Sign a custom token that FastAPI can read using the same secret
        (token as any).accessToken = jwt.sign(
          { email: token.email, sub: token.sub },
          process.env.NEXTAUTH_SECRET!,
          { algorithm: "HS256" }
        );
      } else if (token.email && !(token as any).accessToken) {
        // Regenerate token if it doesn't exist but we have user info
        (token as any).accessToken = jwt.sign(
          { email: token.email, sub: token.sub },
          process.env.NEXTAUTH_SECRET!,
          { algorithm: "HS256" }
        );
      }
      return token;
    },
    async session({ session, token }: any) {
      // Make the token available on the client side
      session.accessToken = token.accessToken;
      return session;
    },
  },
};
