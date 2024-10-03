"use client";

import React, { useState } from "react";
import RightRail from "./RightRail";
import Finish from "./Finish";
import Step from "./Step";
import Start from "./Start";
import { useListData } from "react-stately";
import { AdventurePuzzles } from "@/server/db/puzzle";
import { Track } from "./types";

type BuilderProps = {
  initialPuzzles: AdventurePuzzles;
  adventureId: string;
};

const Builder: React.FC<BuilderProps> = ({ initialPuzzles, adventureId }) => {
  const [puzzles, setPuzzles] = useState<AdventurePuzzles>(initialPuzzles);

  const initialTracks = puzzles.reduce((acc: Track[], puzzle) => {
    const puzzleTrack = puzzle.track;
    if (puzzleTrack && !acc.some((track) => track.id === puzzleTrack.id)) {
      acc.push(puzzleTrack);
    }
    return acc;
  }, []);

  const [tracks, setTracks] = useState(initialTracks);

  console.log("tracks", tracks);

  const addTrack = () => {
    setTracks((prevTracks) => [
      ...prevTracks,
      {
        id: self.crypto.randomUUID(),
        label: `Track ${prevTracks.length + 1}`,
      },
    ]);
  };

  const removeTrack = (trackId: string) => {
    const puzzlesToUnassign = puzzles.filter(
      (puzzle) => puzzle.track?.id === trackId,
    );

    setPuzzles((prevPuzzles) =>
      prevPuzzles.map((puzzle) =>
        puzzle.track?.id === trackId ? { ...puzzle, trackId: null } : puzzle,
      ),
    );

    unassignedList.append(...puzzlesToUnassign);

    setTracks((prevTracks) =>
      prevTracks.filter((track) => track.id !== trackId),
    );
  };

  const unassignedList = useListData({
    initialItems: puzzles.filter((puzzle) => !puzzle.track?.id),
  });

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 grid gap-4 grid-rows-[auto_1fr]">
        <div className="col-span-full rounded-md text-center">
          <div className="p-2 border rounded-md shadow-sm overflow-auto">
            <Start />
          </div>
        </div>

        <Step
          tracks={tracks}
          puzzles={puzzles.filter(
            (puzzle) => puzzle.track?.id !== "unassigned",
          )}
          setPuzzles={setPuzzles}
          addTrack={addTrack}
          removeTrack={removeTrack}
          adventureId={adventureId}
        />

        <div className="col-span-full rounded-md text-center">
          <div className="p-2 border rounded-md shadow-sm overflow-auto">
            <Finish
              setPuzzles={setPuzzles}
              puzzles={puzzles.filter(
                (puzzle) => puzzle.track?.id === "finish",
              )}
              ariaLabel={"Finish"}
              trackId={"finish"}
            />
          </div>
        </div>
      </div>

      <div className="relative flex gap-4 py-8 justify-center w-48">
        <div className="sticky top-8">
          <RightRail
            setPuzzles={setPuzzles}
            list={unassignedList}
            ariaLabel={"Unassigned"}
            trackId={"unassigned"}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;
