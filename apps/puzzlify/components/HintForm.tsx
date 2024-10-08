"use client";

import { addHint } from "@/server/actions/host/create-puzzle-hint";
import { editHint } from "@/server/actions/host/edit-puzzle-hint";
import { hintSchema } from "@/schemas/puzzle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure, Hint, Puzzle } from "@prisma/client";
import { use, useEffect, useState } from "react";
import DeleteHintForm from "./DeleteHintForm";

type HintProps = {
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
  hint?: Hint;
};

const HintForm = ({ adventureId, puzzleId, hint }: HintProps) => {
  const mode = hint ? "edit" : "create";

  const updateHint = !hint
    ? addHint.bind(null, { adventureId, puzzleId })
    : editHint.bind(null, { adventureId, puzzleId, hintId: hint.id });

  const [isSubmitSuccess, setIsSubmitSuccess] = useState<boolean>();

  const { hint: hintMessage, delay } = hint || {
    hintMessage: "",
    delay: undefined,
  };
  const defaultValues = { hint: hintMessage, delay };

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateHint,
    // TODO: A bad schema here isn't showing errors
    zodResolver(hintSchema),
    {
      formProps: { defaultValues },
      actionProps: { onSuccess: () => setIsSubmitSuccess(true) },
    },
  );

  useEffect(() => {
    if (isSubmitSuccess) {
      if (mode === "create") {
        form.reset();
      }
      setIsSubmitSuccess(false);
    }
  }, [isSubmitSuccess]);

  return (
    <div className="flex flex-row gap-2">
      <form onSubmit={handleSubmitWithAction}>
        <div className="flex flex-row gap-2">
          <div>
            <label
              htmlFor="hint"
              className={`input input-bordered ${form.formState.errors.hint ? "input-error" : ""} flex items-center gap-2 mb-2`}
            >
              Hint
              <input {...form.register("hint")} />
            </label>
            {form.formState.errors.hint ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {form.formState.errors.hint.message}
                </span>
              </div>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="delay"
              className={`input input-bordered ${form.formState.errors.delay ? "input-error" : ""} flex items-center gap-2 mb-2`}
            >
              Delay
              <input {...form.register("delay")} type="number" />
            </label>
            {form.formState.errors.delay ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {form.formState.errors.delay.message}
                </span>
              </div>
            ) : null}
          </div>

          <button type="submit" className="btn btn-secondary">
            {mode === "create" ? "Create Hint" : "Edit Hint"}
          </button>
        </div>
      </form>
      {mode === "edit" && hint && (
        <DeleteHintForm
          adventureId={adventureId}
          puzzleId={puzzleId}
          hintId={hint.id}
        />
      )}
    </div>
  );
};

export default HintForm;
