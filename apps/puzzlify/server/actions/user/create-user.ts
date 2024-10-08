"use server";

import { userSchema } from "@/schemas/user";
import { createUserInDb, getUserByEmail } from "@/server/db/user";
import { baseActionClient } from "@/lib/next-safe-action";
import hashInput from "@/server/helpers/hashInput";
import { redirect } from "next/navigation";

export const createUser = baseActionClient
  .schema(userSchema)
  .metadata({ roleName: "auth", actionName: "create-user" })
  .action(async ({ parsedInput }) => {
    const { email, password } = parsedInput;
    const hashedPassword = await hashInput(password);

    const user = { email, password: hashedPassword };

    const possibleExistingUser = await getUserByEmail(email);

    if (possibleExistingUser) {
      const userFacingErrorMessage = "User already exists";
      console.error(userFacingErrorMessage);
      return { error: userFacingErrorMessage };
    }

    try {
      await createUserInDb(user);
    } catch (error) {
      const userFacingErrorMessage = "Failed to add user";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/dashboard`);
  });
