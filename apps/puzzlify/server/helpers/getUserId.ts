import { auth } from "@/auth";

export async function getUserId() {
  const session = await auth();
  const user = session?.user;
  if (!user || !user.id) {
    console.error("Error retrieving user from session");
    throw new Error("Internal server error");
  }
  return user.id;
}
