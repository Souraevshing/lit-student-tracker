export const runtime = "nodejs"; // 👈 Forces Node.js runtime, not Edge

/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
    Credentials({
      async authorize(credentials: Partial<Record<string, unknown>>) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user?.password) {
          return null;
        }

        const isPasswordCorrect = await compare(password, user.password);

        if (!isPasswordCorrect) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token = Object.assign({}, token, {
          access_token: account.access_token,
        });
        return token;
      }
      return null;
    },
    async session({ session, token }) {
      if (session) {
        session = Object.assign({}, session, {
          access_token: token.access_token,
        });
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "credentials") {
        return true;
      }

      if (account?.provider === "google" && profile?.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (existingUser) {
          // Check if account already exists to avoid duplicates
          const existingAccount = await prisma.account.findFirst({
            where: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          });

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            });
          }
          return true;
        } else {
          // Create a new user with default values for required fields
          const calculateAge = (birthdate: string): number => {
            const birthDate = new Date(birthdate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (
              monthDiff < 0 ||
              (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
              age--;
            }
            return age;
          };

          const newUser = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name!,
              age: calculateAge(profile.birthdate!),
              gender: profile.gender!,
              qualification: "not_specified",
              course: "not_specified",
            },
          });

          // Create the account link
          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          });

          return true;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
    signOut: "/",
    error: "/login",
  },
});
