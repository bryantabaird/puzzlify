"use client";

import { verifyPuzzle } from "@/server/actions/team/verify-puzzle";
import { riddleSubmission } from "@/schemas/riddle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure, Puzzle } from "@prisma/client";

type Props = {
  puzzle: Pick<Puzzle, "id" | "riddle">;
  adventureId: Adventure["id"];
};

const RiddleForm = ({ puzzle, adventureId }: Props) => {
  const verifyWithIds = verifyPuzzle.bind(null, {
    adventureId,
    puzzleId: puzzle.id,
  });

  const { form, handleSubmitWithAction } = useHookFormAction(
    verifyWithIds,
    zodResolver(riddleSubmission),
    { formProps: { defaultValues: { answer: "" } } },
  );

  return (
    <div>
      <h1>Puzzle</h1>
      <h2>Riddle:</h2>
      <p>{puzzle.riddle}</p>
      <form onSubmit={handleSubmitWithAction}>
        <label htmlFor="answer" className="block">
          Riddle
        </label>
        <input
          {...form.register("answer")}
          className="border mx-2 border-gray-500 rounded"
        />
        {form.formState.errors.answer ? (
          <p>{form.formState.errors.answer.message}</p>
        ) : null}
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
};

export default RiddleForm;
