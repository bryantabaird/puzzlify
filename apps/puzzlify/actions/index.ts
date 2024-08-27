"use server";

import { signIn, signOut } from "@/auth";

export async function login(formData: FormData) {
  try {
    const response = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
    return response;
  } catch (error) {
    console.error("Error signing in", error);
    throw new Error("Failed to sign in");
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
