import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
        console.log("credentials", credentials);
        return { id: "1", name: "John Doe", email: "" };
      },
    }),
  ],
});
