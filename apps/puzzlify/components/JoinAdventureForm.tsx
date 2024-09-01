"use client";

import { joinAdventureSchema } from "@/schemas/adventure";
import { joinAdventure } from "@/server/actions/team/join-adventure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure } from "@prisma/client";

type Props = {
  adventureId: Adventure["id"];
};

const JoinAdventureForm = ({ adventureId }: Props) => {
  const joinAdventureWithIds = joinAdventure.bind(null, { adventureId });

  const defaultValues = { teamName: "" };

  const { form, handleSubmitWithAction } = useHookFormAction(
    joinAdventureWithIds,
    zodResolver(joinAdventureSchema),
    { formProps: { defaultValues } },
  );

  return (
    <>
      <form onSubmit={handleSubmitWithAction}>
        <div className="flex flex-col gap-2">
          <div>
            <label
              className={`input input-bordered ${form.formState.errors.teamName ? "input-error" : ""} flex items-center gap-2 mb-2`}
            >
              Team Name
              <input
                type="text"
                className="grow"
                {...form.register("teamName")}
              />
            </label>
            {form.formState.errors.teamName ? (
              <div className="label">
                <span className="label-text-alt text-error">
                  {form.formState.errors.teamName.message}
                </span>
              </div>
            ) : null}
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Join Adventure
          </button>
        </div>
      </form>
    </>
  );
};

export default JoinAdventureForm;
