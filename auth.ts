import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        const parsedData = CredentialsSchema.safeParse(credentials);

        if (parsedData.error) {
          return null;
        }

        const { email, password } = parsedData.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
          return null;
        }

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET!,
  callbacks: {
    async signIn({ account }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google") {
        return true;
      }

      return false;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email: token.email as string },
      });

      if (existingUser) {
        token.email = existingUser.email;
        token.name = existingUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        session.user.emailVerified = token.emailVerified
          ? new Date(token.emailVerified as string)
          : null;
        session.accessToken = token.accessToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    signOut: "/",
    error: "/login",
  },
  debug: true,
});
