"use client";

import { useState } from "react";
import { getHintIfAvailable } from "@/server/fetchers/get-hint";
import { Hint, Puzzle } from "@prisma/client";

type Props = {
  adventureId: Hint["id"];
  hintId: Hint["id"];
  puzzleId: Puzzle["id"];
};

const GetHintForm = ({ hintId, puzzleId, adventureId }: Props) => {
  const [hintContent, setHintContent] = useState<string | null>(null);

  // TODO: Ensure hints are not available client-side before the hint release time
  const handleGetHint = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const hint = await getHintIfAvailable(hintId, puzzleId, adventureId);
      if (hint) {
        setHintContent(hint);
      }
    } catch (error) {
      console.error("Failed to retrieve hint:", error);
    }
  };

  return (
    <div>
      {!hintContent && (
        <form onSubmit={handleGetHint}>
          <button
            type="submit"
            className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
          >
            Get Hint
          </button>
        </form>
      )}

      {hintContent && (
        <div className="mt-4">
          <p className="text-gray-800">Hint: {hintContent}</p>
        </div>
      )}
    </div>
  );
};

export default GetHintForm;
