"use client";

import { verifyStage } from "@/actions/participant/verify-stage";
import { riddleSubmission } from "@/app/schemas/riddle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure, Stage } from "@prisma/client";

type Props = {
  stage: Pick<Stage, "id" | "riddle">;
  adventureId: Adventure["id"];
};

const RiddleForm = ({ stage, adventureId }: Props) => {
  const verifyWithIds = verifyStage.bind(null, {
    adventureId,
    stageId: stage.id,
  });

  const { form, handleSubmitWithAction } = useHookFormAction(
    verifyWithIds,
    zodResolver(riddleSubmission),
    { formProps: { defaultValues: { answer: "" } } },
  );

  return (
    <div>
      <h1>Stage</h1>
      <h2>Riddle:</h2>
      <p>{stage.riddle}</p>
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
