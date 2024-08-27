"use client";

import { beginAdventure } from "@/actions/participant/begin-adventure";
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
        <>
          <h1>You are all signed up! Adventure starts soon.</h1>
          <h2 className="text-xl font-bold">Adventure starts in:</h2>
          <p className="text-lg">{timeRemaining}</p>
        </>
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
