import { Puzzle } from "@prisma/client";

export type TrackProps = {
  setPuzzles: React.Dispatch<React.SetStateAction<Puzzle[]>>;
  puzzles: Array<Puzzle>;
  ariaLabel: string;
  trackId: string;
};

export type Track = {
  id: string;
  label: string;
};
