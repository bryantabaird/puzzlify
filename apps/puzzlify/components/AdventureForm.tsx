"use client";

import { createAdventure } from "@/actions/host/create-adventure";
import { editAdventure } from "@/actions/host/edit-adventure";
import { adventureSchema } from "@/app/schemas/adventure";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure } from "@prisma/client";

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

  const { name, startDate } = adventure || { name: "", startDate: "" };
  // datetime-local input doesn't accept ISO strings or date objects
  const startDateLocalTime = startDate
    ? getLocalDateTime(new Date(startDate))
    : "";
  const defaultValues = { name, startDate: startDateLocalTime };

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateAdventure,
    // TODO: A bad schema here isn't showing errors
    zodResolver(adventureSchema),
    { formProps: { defaultValues } },
  );

  const minDateTime = getLocalDateTime(new Date());

  return (
    <>
      <form
        className="my-5 flex flex-col items-center border p-3 border-gray-200 rounded-md"
        onSubmit={handleSubmitWithAction}
      >
        <label htmlFor="name" className="block">
          Name
        </label>
        <input
          {...form.register("name")}
          className="border mx-2 border-gray-500 rounded"
        />
        {form.formState.errors.name ? (
          <p>{form.formState.errors.name.message}</p>
        ) : null}

        <label htmlFor="startDate" className="block">
          Start Date
        </label>
        <input
          {...form.register("startDate", {
            setValueAs: (value) => (value ? new Date(value).toISOString() : ""),
          })}
          type="datetime-local"
          min={minDateTime}
          className="border mx-2 border-gray-500 rounded"
        />
        {form.formState.errors.startDate ? (
          <p>{form.formState.errors.startDate.message}</p>
        ) : null}

        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          {mode === "create" ? "Create Adventure" : "Edit Adventure"}
        </button>
      </form>
    </>
  );
};

export default AdventureForm;
