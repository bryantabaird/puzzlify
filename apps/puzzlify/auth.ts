import NextAuth from "next-auth";
import bcrypt from "bcrypt";
import Credentials from "next-auth/providers/credentials";
import { getItem } from "@/server/helpers/db";
import { AUTH_USER_TABLE_NAME } from "@repo/shared";

export const { handlers, signIn, signOut, auth } = NextAuth({
  callbacks: {
    authorized: async ({ auth }) => {
      console.log("authorized callback");
      console.log("auth", auth);
      return !!auth;
    },
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

          const user = await getItem(email, AUTH_USER_TABLE_NAME);

          console.log("getting user", user);

          console.log("email", email);
          console.log("password", password);

          if (!user) {
            return null;
          }

          const isPasswordMatch = await bcrypt.compare(
            password,
            user.hashedPassword,
          );

          console.log("isPasswordMatch", isPasswordMatch);

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
