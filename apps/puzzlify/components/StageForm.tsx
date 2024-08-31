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

  const { riddle, label } = stage || { riddle: "", answer: "", label: "" };
  const defaultValues = { riddle: riddle || "", answer: "", label };

  const { form, handleSubmitWithAction } = useHookFormAction(
    boundUpdateStage,
    zodResolver(stageSchema),
    { formProps: { defaultValues } },
  );

  return (
    <form onSubmit={handleSubmitWithAction}>
      <div className="flex flex-col gap-2">
        <div>
          <label
            className={`input input-bordered ${form.formState.errors.label ? "input-error" : ""} flex items-center gap-2 mb-2`}
          >
            Name
            <input type="text" className="grow" {...form.register("label")} />
          </label>
          {form.formState.errors.label ? (
            <div className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.label.message}
              </span>
            </div>
          ) : null}
        </div>

        <div>
          <label
            className={`input input-bordered ${form.formState.errors.riddle ? "input-error" : ""} flex items-center gap-2 mb-2`}
          >
            Riddle
            <input type="text" className="grow" {...form.register("riddle")} />
          </label>
          {form.formState.errors.riddle ? (
            <div className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.riddle.message}
              </span>
            </div>
          ) : null}
        </div>

        <div>
          <label
            className={`input input-bordered ${form.formState.errors.answer ? "input-error" : ""} flex items-center gap-2 mb-2`}
          >
            Answer
            <input type="text" className="grow" {...form.register("answer")} />
          </label>
          {form.formState.errors.answer ? (
            <div className="label">
              <span className="label-text-alt text-error">
                {form.formState.errors.answer.message}
              </span>
            </div>
          ) : null}
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {mode === "create" ? "Create Stage" : "Update Stage"}
        </button>
      </div>
    </form>
  );
};

export default StageForm;
