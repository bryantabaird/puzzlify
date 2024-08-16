import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { getItem } from "@/server/helpers/db";
import { AUTH_USER_TABLE_NAME } from "@repo/shared";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/",
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (process.env.NODE_ENV === "development") {
          return { id: "fakeUserId", email: "fakeuser@example.com" };
        }

        if (credentials.email === null) {
          return null;
        }

        try {
          if (!credentials.email || !credentials.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await getItem(email, AUTH_USER_TABLE_NAME);

          if (!user) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
          );

          if (isPasswordMatch) {
            return { id: user.id, email: user.email };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          console.error("Error signing in", error);
          throw new Error("Failed to sign in");
        }
      },
    }),
  ],
});
