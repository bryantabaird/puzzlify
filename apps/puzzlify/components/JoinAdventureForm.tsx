"use client";

import { joinAdventure } from "@/actions/participant/join-adventure";
import { Adventure } from "@prisma/client";

type Props = {
  adventureId: Adventure["id"];
};

const JoinAdventureForm = ({ adventureId }: Props) => {
  const joinAdventureWithIds = joinAdventure.bind(null, { adventureId });

  return (
    <>
      <form action={joinAdventureWithIds}>
        <button
          type="submit"
          className="bg-orange-300 mt-4 rounded flex justify-center items-center w-36"
        >
          Join Adventure
        </button>
      </form>
    </>
  );
};

export default JoinAdventureForm;
