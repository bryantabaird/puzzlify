"use server";

import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";

export const baseActionClient = createSafeActionClient({
  defineMetadataSchema: () => z.object({ actionName: z.string() }),
}).use(async ({ next, clientInput, metadata }) => {
  console.log("LOGGING MIDDLEWARE");

  // Here we await the action execution.
  const result = await next();

  // console.log("Result ->", result);
  // console.log("Client input ->", clientInput);
  // console.log("Metadata ->", metadata);

  // And then return the result of the awaited action.
  return result;
});

export const participantActionClient = baseActionClient
  .bindArgsSchemas<[adventureId: z.ZodString]>([z.string().uuid()])
  .use(async ({ next, clientInput, metadata, bindArgsClientInputs }) => {
    console.log("LOGGING MIDDLEWARE");

    // Here we await the action execution.
    const result = await next();

    console.log("Result ->", result);
    console.log("Client input ->", clientInput);
    console.log("Metadata ->", metadata);

    console.log("Bind args client inputs ->", bindArgsClientInputs);

    // And then return the result of the awaited action.
    return result;
  });
