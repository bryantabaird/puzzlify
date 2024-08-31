"use client";

import { createAdventure } from "@/server/actions/host/create-adventure";
import { editAdventure } from "@/server/actions/host/edit-adventure";
import { adventureSchema } from "@/schemas/adventure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure } from "@prisma/client";
import { useRouter } from "next/navigation";

type Props = {
  adventure?: Adventure;
};

const getLocalDateTime = (date: Date) => {
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
  return localDate.toISOString().slice(0, 16);
};

const AdventureForm = ({ adventure }: Props) => {
  const mode = adventure ? "edit" : "create";

  const updateAdventure = !adventure
    ? createAdventure.bind(null, {})
    : editAdventure.bind(null, { adventureId: adventure.id });

  const now = new Date();
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);

  const { name, startDate } = adventure || { name: "", startDate: "" };
  // datetime-local input doesn't accept ISO strings or date objects
  const startDateLocalTime = startDate
    ? getLocalDateTime(new Date(startDate))
    : getLocalDateTime(nextWeek);
  const defaultValues = { name, startDate: startDateLocalTime };

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateAdventure,
    // TODO: A bad schema here isn't showing errors
    zodResolver(adventureSchema),
    {
      formProps: { defaultValues },
      actionProps: {
        onSuccess: (response) => {
          if (response.data) {
            router.push(`/adventure/${response.data.adventureId}`);
          } else {
            // TODO: Update form there was an error try again
          }
        },
      },
    },
  );

  const router = useRouter();

  const minDateTime = getLocalDateTime(new Date());

  const isSubmitting = form.formState.isSubmitting;

  return (
    <>
      <form onSubmit={handleSubmitWithAction}>
        <label htmlFor="name" className="block">
          <div className="label">
            <span className="label-text">Adventure Name</span>
          </div>
          <input
            {...form.register("name")}
            className={`input input-bordered ${form.formState.errors.name ? "input-error" : ""} w-full max-w-xs`}
          />
        </label>
        {form.formState.errors.name ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.name.message}
            </span>
          </div>
        ) : null}

        <label htmlFor="startDate" className="block">
          <div className="label">
            <span className="label-text">Start Time</span>
          </div>
          <input
            {...form.register("startDate", {
              setValueAs: (value) =>
                value ? new Date(value).toISOString() : "",
            })}
            type="datetime-local"
            min={minDateTime}
            className={`input input-bordered ${form.formState.errors.startDate ? "input-error" : ""} w-full max-w-xs`}
          />
        </label>
        {form.formState.errors.startDate ? (
          <div className="label">
            <span className="label-text-alt text-error">
              {form.formState.errors.startDate.message}
            </span>
          </div>
        ) : null}

        {isSubmitting ? (
          <button
            type="submit"
            className="btn btn-primary btn-disabled w-full mt-6"
          >
            <span className="loading loading-spinner"></span>
            {mode === "create" ? "Creating Adventure" : "Editing Adventure"}
          </button>
        ) : (
          <button type="submit" className="btn btn-primary w-full mt-6">
            {mode === "create" ? "Create Adventure" : "Edit Adventure"}
          </button>
        )}
      </form>
    </>
  );
};

export default AdventureForm;
