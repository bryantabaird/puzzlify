export type Puzzle = {
  id: string;
  label: string;
  trackId?: string;
  previousPuzzleIds: string[];
  nextPuzzleIds: string[];
};

export type TrackProps = {
  setPuzzles: React.Dispatch<React.SetStateAction<Puzzle[]>>;
  puzzles: Array<Puzzle>;
  ariaLabel: string;
  trackId: string;
};

export type Track = {
  id: string;
  name: string;
};
