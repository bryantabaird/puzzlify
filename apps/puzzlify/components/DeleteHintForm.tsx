"use client";
// TODO: Can I remove use client?

import { deleteHint } from "@/app/actions/host/delete-stage-hint";
import { Adventure, Hint, Stage } from "@prisma/client";

type HintProps = {
  adventureId: Adventure["id"];
  stageId: Stage["id"];
  hintId: Hint["id"];
};

const DeleteHintForm = ({ adventureId, stageId, hintId }: HintProps) => {
  const deleteHintWithIds = deleteHint.bind(null, {
    adventureId,
    stageId,
    hintId,
  });

  return (
    <>
      <form action={deleteHintWithIds}>
        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Delete Hint
        </button>
      </form>
    </>
  );
};

export default DeleteHintForm;
