import RiddleForm from "@/components/RiddleForm";
import { type PuzzleWithPreviousAndNextPuzzles } from "@/server/db/puzzle";
import { Hint } from "@prisma/client";
import TeamHintView from "./TeamHintView";
import { getPuzzleAssets } from "@/server/db/asset";

type TeamPuzzleProps = {
  puzzle: NonNullable<PuzzleWithPreviousAndNextPuzzles>;
  adventureId: string;
  startDate?: Date;
};

export default async function TeamPuzzleView({
  puzzle,
  adventureId,
  startDate,
}: TeamPuzzleProps) {
  const assets = await getPuzzleAssets({ puzzleId: puzzle.id });

  return (
    <>
      <RiddleForm puzzle={puzzle} adventureId={adventureId} />
      {/* TODO: Not only images */}
      {assets.map(({ id, url }) => (
        <img key={id} src={url} />
      ))}
      <div>
        <h2>Hints</h2>
        <ul>
          {puzzle.hints.map((hint: Hint) => {
            if (!startDate) {
              throw new Error("startDate is required for a user to see hints");
            }

            return (
              <li key={hint.id}>
                <TeamHintView
                  hintId={hint.id}
                  puzzleId={puzzle.id}
                  adventureId={adventureId}
                  delay={hint.delay}
                  startDate={startDate}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
