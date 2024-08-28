"use client";

import { Adventure, Stage } from "@prisma/client";
import { createStage } from "@/server/actions/host/create-stage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { stageSchema } from "@/schemas/stage";
import { editStage } from "@/server/actions/host/edit-stage";

type StageFormProps = {
  adventureId: Adventure["id"];
  stage?: Stage;
};

const StageForm = ({ adventureId, stage }: StageFormProps) => {
  const mode = stage ? "edit" : "create";

  const boundUpdateStage = !stage
    ? createStage.bind(null, { adventureId })
    : editStage.bind(null, { adventureId, stageId: stage.id });

  const { riddle, answer } = stage || { riddle: "", answer: "" };
  const defaultValues = { riddle: riddle || "", answer: answer || "" };

  const { form, handleSubmitWithAction } = useHookFormAction(
    boundUpdateStage,
    zodResolver(stageSchema),
    { formProps: { defaultValues } },
  );

  return (
    <form
      className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
      onSubmit={handleSubmitWithAction}
    >
      <label htmlFor="label" className="block">
        Label
      </label>
      <input
        {...form.register("label")}
        className="border mx-2 border-gray-500 rounded"
      />
      {form.formState.errors.label ? (
        <p>{form.formState.errors.label.message}</p>
      ) : null}
      <label htmlFor="riddle" className="block">
        Riddle
      </label>
      <input
        {...form.register("riddle")}
        className="border mx-2 border-gray-500 rounded"
      />
      {form.formState.errors.riddle ? (
        <p>{form.formState.errors.riddle.message}</p>
      ) : null}
      <label htmlFor="answer" className="block">
        Answer
      </label>
      <input
        {...form.register("answer")}
        className="border mx-2 border-gray-500 rounded"
      />
      {form.formState.errors.answer ? (
        <p>{form.formState.errors.answer.message}</p>
      ) : null}
      <button
        type="submit"
        className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
      >
        {mode === "create" ? "Create Stage" : "Edit Stage"}
      </button>
    </form>
  );
};

export default StageForm;
