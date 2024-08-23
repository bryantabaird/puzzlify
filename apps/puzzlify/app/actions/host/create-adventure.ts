"use server";

import { adventureSchema } from "@/app/schemas/adventure";
import { hostActionClient } from "@/lib/nextSafeAction";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const createAdventure = hostActionClient
  .schema(adventureSchema)
  .metadata({ actionName: "create-adventure" })
  .action(async ({ parsedInput, ctx }) => {
    const { name, startDate } = parsedInput;

    const { userId } = ctx;

    const data = { name, hostId: userId, startDate: new Date(startDate) };

    let adventureId;
    try {
      const adventure = await prisma.adventure.create({ data });
      adventureId = adventure.id;

      revalidatePath(`/adventure/${adventureId}`);
    } catch (error) {
      const userFacingErrorMessage = "Failed to add adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }

    redirect(`/adventure/${adventureId}`);
  });
