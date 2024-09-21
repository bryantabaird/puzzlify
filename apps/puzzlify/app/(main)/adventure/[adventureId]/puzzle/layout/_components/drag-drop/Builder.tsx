"use client";

import React, { useState } from "react";
import { Puzzle } from "./types"; // Adjust the import path if necessary
import { useListData } from "react-stately";
import RightRail from "./RightRail";
import Finish from "./Finish";
import TrackGroup from "./TrackGroup";
import Start from "./Start";

const initialPuzzles: Puzzle[] = [
  { id: "1", trackGroupId: "1", trackId: "1", name: "Puzzle 1" },
  { id: "2", trackGroupId: "1", trackId: "1", name: "Puzzle 2" },
  { id: "3", trackGroupId: "1", trackId: "1", name: "Puzzle 3" },
  { id: "4", trackGroupId: "1", trackId: "1", name: "Puzzle 4" },
  { id: "5", trackGroupId: "1", trackId: "1", name: "Puzzle 5" },
  { id: "6", trackGroupId: "1", trackId: "1", name: "Puzzle 6" },
  { id: "7", trackGroupId: "1", trackId: "2", name: "Puzzle 7" },
  { id: "8", trackGroupId: "1", trackId: "2", name: "Puzzle 8" },
  { id: "9", trackGroupId: "1", trackId: "2", name: "Puzzle 9" },
  { id: "10", trackGroupId: "1", trackId: "2", name: "Puzzle 10" },
  { id: "11", trackGroupId: "1", trackId: "2", name: "Puzzle 11" },
  { id: "12", trackGroupId: "1", trackId: "2", name: "Puzzle 12" },
  { id: "13", trackGroupId: "1", trackId: "3", name: "Puzzle 13" },
  { id: "14", trackGroupId: "1", trackId: "3", name: "Puzzle 14" },
  { id: "15", trackGroupId: "1", trackId: "3", name: "Puzzle 15" },
  { id: "16", trackGroupId: "1", trackId: "3", name: "Puzzle 16" },
  { id: "17", trackGroupId: "1", trackId: "4", name: "Puzzle 17" },
  { id: "18", trackGroupId: "1", trackId: "unassigned", name: "Puzzle 18" },
];

const initialTracks = [
  { id: "1", name: "Track 1" },
  { id: "2", name: "Track 2" },
  { id: "3", name: "Track 3" },
  { id: "4", name: "Track 4" },
];

const initialTrackGroups = [
  { id: "1", name: "Track Group 1", tracks: initialTracks },
];

const finishTrack = { id: "finish", name: "Final Puzzle" };

const Builder: React.FC = () => {
  const [puzzles, setPuzzles] = useState<Puzzle[]>(initialPuzzles);

  const [trackGroups, setTrackGroups] = useState(initialTrackGroups);

  const addTrack = (trackGroupId: string) => {
    setTrackGroups((prevTrackGroups) =>
      prevTrackGroups.map((group) =>
        group.id === trackGroupId
          ? {
              ...group,
              tracks: [
                ...group.tracks,
                {
                  id: `${group.tracks.length + 1}`,
                  name: `Track ${group.tracks.length + 1}`,
                },
              ],
            }
          : group,
      ),
    );
  };

  const removeTrack = (trackGroupId: string, trackId: string) => {
    const puzzlesToUnassign = puzzles.filter(
      (puzzle) =>
        puzzle.trackId === trackId && puzzle.trackGroupId === trackGroupId,
    );
    setPuzzles((prevPuzzles) =>
      prevPuzzles.map((puzzle) =>
        puzzle.trackId === trackId && puzzle.trackGroupId === trackGroupId
          ? { ...puzzle, trackId: "unassigned" }
          : puzzle,
      ),
    );
    unassignedList.append(...puzzlesToUnassign);

    setTrackGroups((prevTrackGroups) =>
      prevTrackGroups.map((group) =>
        group.id === trackGroupId
          ? {
              ...group,
              tracks: group.tracks.filter((track) => track.id !== trackId),
            }
          : group,
      ),
    );
  };

  const unassignedList = useListData({
    initialItems: puzzles.filter((puzzle) => puzzle.trackId === "unassigned"),
  });

  return (
    <div className="flex w-full h-full">
      <div className="flex-1 grid gap-4 grid-rows-[auto_1fr]">
        <div className="col-span-full rounded-md text-center">
          <div className={"p-2 border rounded-md shadow-sm overflow-auto"}>
            <Start />
          </div>
        </div>

        {trackGroups.map((trackGroup) => (
          <TrackGroup
            key={trackGroup.id}
            tracks={trackGroup.tracks}
            puzzles={puzzles.filter(
              (puzzle) => puzzle.trackGroupId === trackGroup.id,
            )}
            setPuzzles={setPuzzles}
            addTrack={() => addTrack(trackGroup.id)}
            removeTrack={(trackId) => removeTrack(trackGroup.id, trackId)}
          />
        ))}
        <div className="col-span-full rounded-md text-center">
          <div className={"p-2 border rounded-md shadow-sm overflow-auto"}>
            <Finish
              setPuzzles={setPuzzles}
              puzzles={puzzles.filter(
                (puzzle) => puzzle.trackId === finishTrack.id,
              )}
              ariaLabel={finishTrack.name}
              trackId={finishTrack.id}
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
            trackId={"Unassigned"}
          />
        </div>
      </div>
    </div>
  );
};

export default Builder;
