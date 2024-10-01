"use server";

import { riddleSubmission } from "@/schemas/riddle";
import { puzzleAdventureActionClient } from "@/lib/next-safe-action";
import { getPuzzleValidationData } from "@/server/db/puzzle";
import {
  getCountOfIncompletePreviousPuzzles,
  createTeamProgress,
  updateTeamProgress,
} from "@/server/db/team-progress";
import { compareInput } from "@/server/helpers/hashInput";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const verifyPuzzle = puzzleAdventureActionClient
  .schema(riddleSubmission)
  .metadata({ roleName: "team", actionName: "verify-puzzle" })
  .action(async ({ parsedInput, ctx }) => {
    const { teamId, adventureId, puzzleId } = ctx;
    const { answer } = parsedInput;

    const puzzle = await getPuzzleValidationData(puzzleId);

    if (!puzzle) {
      return { message: "Puzzle not found" };
    }

    if (!puzzle.answer) {
      return { message: "Puzzle does not have an answer" };
    }

    try {
      const isCorrectAnswer = await compareInput(answer, puzzle.answer);

      if (isCorrectAnswer) {
        const now = new Date();

        // const nextPuzzles =
        //   await getNextPuzzlesWithNextedPreviousPuzzles(puzzleId);

        // TODO: Transaction for the following operations
        // TODO: Refactor with the 'order' field
        // await Promise.all(
        //   nextPuzzles.map(async (nextPuzzle) => {
        //     const previousPuzzleIds = nextPuzzle.toPuzzle.previousPuzzles.map(
        //       (puzzleRelation) => puzzleRelation.fromPuzzleId,
        //     );

        //     const incompletePreviousPuzzlesCount =
        //       await getCountOfIncompletePreviousPuzzles({
        //         adventureId,
        //         teamId,
        //         previousPuzzleIds,
        //       });

        //     if (incompletePreviousPuzzlesCount === 0) {
        //       await createTeamProgress({
        //         teamId,
        //         adventureId,
        //         puzzleId: nextPuzzle.toPuzzleId,
        //         startTime: now,
        //       });
        //     }
        //   }),
        // );

        // Update the user progress entry for the current puzzle
        await updateTeamProgress(teamId, adventureId, puzzleId, now);

        // TODO: Does this revalidate the path for all users or just
        // the current user? Only needs to be the current user
        revalidatePath(`/adventure/${adventureId}/puzzle`);
      } else {
        return { message: "Incorrect answer. Try again." };
      }
    } catch (error) {
      console.error("Error verifying answer:", error);
      return { message: "An error occurred" };
    }

    redirect(`/adventure/${adventureId}/puzzle`);
  });
