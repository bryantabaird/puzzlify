"use client";
// TODO: Can I remove useclient?

import { deleteAdventure } from "@/server/actions/host/delete-adventure";
import { Adventure } from "@prisma/client";

type Props = {
  adventureId: Adventure["id"];
};

const DeleteAdventureForm = ({ adventureId }: Props) => {
  const deleteAdventureWithIds = deleteAdventure.bind(null, { adventureId });

  return (
    <>
      <form action={deleteAdventureWithIds}>
        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Delete Adventure
        </button>
      </form>
    </>
  );
};

export default DeleteAdventureForm;
