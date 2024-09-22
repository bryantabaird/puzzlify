"use client";

import React, { useState } from "react";
import { Puzzle } from "./types"; // Adjust the import path if necessary
import RightRail from "./RightRail";
import Finish from "./Finish";
import TrackGroupComponent from "./TrackGroup";
import Start from "./Start";
import { useListData } from "react-stately";

type Track = {
  id: string;
  name: string;
};

const initialTracks: Array<Track> = [
  { id: "1", name: "Track 1" },
  { id: "2", name: "Track 2" },
  { id: "3", name: "Track 3" },
  { id: "4", name: "Track 4" },
];

type BuilderProps = {
  initialPuzzles: Puzzle[];
};

const Builder: React.FC<BuilderProps> = ({ initialPuzzles }) => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>(initialPuzzles);
  const [tracks, setTracks] = useState(initialTracks);

  const addTrack = () => {
    setTracks((prevTracks) => [
      ...prevTracks,
      {
        id: `${prevTracks.length + 1}`,
        name: `Track ${prevTracks.length + 1}`,
      },
    ]);
  };

  const removeTrack = (trackId: string) => {
    const puzzlesToUnassign = puzzles.filter(
      (puzzle) => puzzle.trackId === trackId,
    );

    setPuzzles((prevPuzzles) =>
      prevPuzzles.map((puzzle) =>
        puzzle.trackId === trackId
          ? (() => {
              const { trackId, ...puzzleProps } = puzzle;
              return puzzleProps;
            })()
          : puzzle,
      ),
    );

    unassignedList.append(...puzzlesToUnassign);

    setTracks((prevTracks) =>
      prevTracks.filter((track) => track.id !== trackId),
    );
  };

  const unassignedList = useListData({
    initialItems: puzzles.filter(
      (puzzle) =>
        !puzzle.trackId &&
        puzzle.nextPuzzleIds.length === 0 &&
        puzzle.previousPuzzleIds.length === 0,
    ),
  });

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 grid gap-4 grid-rows-[auto_1fr]">
        <div className="col-span-full rounded-md text-center">
          <div className="p-2 border rounded-md shadow-sm overflow-auto">
            <Start />
          </div>
        </div>

        <TrackGroupComponent
          tracks={tracks}
          puzzles={puzzles.filter((puzzle) => puzzle.trackId !== "unassigned")}
          setPuzzles={setPuzzles}
          addTrack={addTrack}
          removeTrack={removeTrack}
        />

        <div className="col-span-full rounded-md text-center">
          <div className="p-2 border rounded-md shadow-sm overflow-auto">
            <Finish
              setPuzzles={setPuzzles}
              puzzles={puzzles.filter((puzzle) => puzzle.trackId === "finish")}
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
