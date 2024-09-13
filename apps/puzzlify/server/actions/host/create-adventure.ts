"use server";

import { adventureSchema } from "@/schemas/adventure";
import { userActionClient } from "@/lib/next-safe-action";
import { revalidatePath } from "next/cache";
import {
  createAdventureDb,
  CreateAdventurePayload,
} from "@/server/db/adventure";
import { getTier } from "@/server/db/tier";
import { TierId } from "@prisma/client";

export const createAdventure = userActionClient
  .schema(adventureSchema)
  .metadata({ roleName: "host", actionName: "create-adventure" })
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const { name, startDate } = parsedInput;

    const tier = await getTier({ tierId: TierId.FREE });

    if (!tier) {
      throw new Error("Tier not found");
    }

    const data: CreateAdventurePayload = {
      name,
      hostId: userId,
      startDate: new Date(startDate),
      flow: "LINEAR",
    };

    try {
      const adventure = await createAdventureDb(data);
      const adventureId = adventure.id;

      revalidatePath(`/adventure/${adventureId}`);
      return { adventureId };
    } catch (error) {
      const userFacingErrorMessage = "Failed to add adventure";
      console.error(userFacingErrorMessage, error);
      return { error: userFacingErrorMessage };
    }
  });
