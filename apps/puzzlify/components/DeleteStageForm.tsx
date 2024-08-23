"use client";

import { deleteStage } from "@/app/actions/host/delete-stage";
import { Adventure, Stage } from "@prisma/client";

type Props = {
  adventureId: Adventure["id"];
  stageId: Stage["id"];
};

const DeleteStageForm = ({ adventureId, stageId }: Props) => {
  const deleteStageWithIds = deleteStage.bind(null, {
    adventureId,
    stageId,
  });

  return (
    <>
      <form action={deleteStageWithIds}>
        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Delete Stage
        </button>
      </form>
    </>
  );
};

export default DeleteStageForm;
