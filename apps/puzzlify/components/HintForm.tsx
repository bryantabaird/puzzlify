"use client";

import { addHint } from "@/actions/host/create-stage-hint";
import { editHint } from "@/actions/host/edit-stage-hint";
import { hintSchema } from "@/schemas/stage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure, Hint, Stage } from "@prisma/client";

type HintProps = {
  adventureId: Adventure["id"];
  stageId: Stage["id"];
  hint?: Hint;
};

const HintForm = ({ adventureId, stageId, hint }: HintProps) => {
  const mode = hint ? "edit" : "create";

  const updateHint = !hint
    ? addHint.bind(null, { adventureId, stageId })
    : editHint.bind(null, { adventureId, stageId, hintId: hint.id });

  const { hint: hintMessage, delay } = hint || { hintMessage: "", delay: 0 };
  const defaultValues = { hint: hintMessage, delay };

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateHint,
    // TODO: A bad schema here isn't showing errors
    zodResolver(hintSchema),
    { formProps: { defaultValues } },
  );

  return (
    <>
      <form
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={handleSubmitWithAction}
      >
        <label htmlFor="hint" className="block">
          Hint
        </label>
        <input
          {...form.register("hint")}
          className="border mx-2 border-gray-500 rounded"
        />
        {form.formState.errors.hint ? (
          <p>{form.formState.errors.hint.message}</p>
        ) : null}

        <label htmlFor="delay" className="block">
          Delay
        </label>
        <input
          {...form.register("delay")}
          type="number"
          className="border mx-2 border-gray-500 rounded"
        />
        {form.formState.errors.delay ? (
          <p>{form.formState.errors.delay.message}</p>
        ) : null}

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          {mode === "create" ? "Create Hint" : "Edit Hint"}
        </button>
      </form>
    </>
  );
};

export default HintForm;
