import NextAuth from "next-auth";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "./server/db/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  callbacks: {
    session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
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
        if (credentials.email === null) {
          return null;
        }

        try {
          if (!credentials.email || !credentials.password) {
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          const user = await getUserByEmail(email);

          if (!user) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(password, user.password);

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
