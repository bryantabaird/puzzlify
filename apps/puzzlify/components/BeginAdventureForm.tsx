"use client";

import { beginAdventure } from "@/server/actions/team/begin-adventure";
import useCountdown from "@/hooks/useCountdown"; // Adjust the path to where the hook is saved

type Props = {
  adventureId: string;
  startDate: Date;
};

export default function BeginAdventureForm({ adventureId, startDate }: Props) {
  const timeRemaining = useCountdown(startDate);

  const beginAdventureWithIds = beginAdventure.bind(null, { adventureId });

  return (
    <div className="flex flex-col items-center">
      {timeRemaining ? (
        <form action={beginAdventureWithIds}>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Start Adventure
          </button>
        </form>
      ) : (
        <form action={beginAdventureWithIds}>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
          >
            Start Adventure
          </button>
        </form>
      )}
    </div>
  );
}
