"use client";
// TODO: Can I remove use client?

import { deleteHint } from "@/server/actions/host/delete-puzzle-hint";
import { Adventure, Hint, Puzzle } from "@prisma/client";

type HintProps = {
  adventureId: Adventure["id"];
  puzzleId: Puzzle["id"];
  hintId: Hint["id"];
};

const DeleteHintForm = ({ adventureId, puzzleId, hintId }: HintProps) => {
  const deleteHintWithIds = deleteHint.bind(null, {
    adventureId,
    puzzleId,
    hintId,
  });

  return (
    <>
      <form action={deleteHintWithIds}>
        <button type="submit" className="btn btn-accent">
          Delete Hint
        </button>
      </form>
    </>
  );
};

export default DeleteHintForm;
