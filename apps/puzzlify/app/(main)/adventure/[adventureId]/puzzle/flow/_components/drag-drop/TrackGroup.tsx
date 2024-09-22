import { Puzzle, Track } from "./types";
import TrackComponent from "./Track";
import VerticalDivider from "./VerticalDivider";

type TrackGroupProps = {
  tracks: Track[];
  puzzles: Puzzle[];
  setPuzzles: React.Dispatch<React.SetStateAction<Puzzle[]>>;
  addTrack: () => void;
  removeTrack: (trackId: string) => void;
};

const MAX_TRACKS = 5;

export default function TrackGroup({
  tracks,
  puzzles,
  setPuzzles,
  addTrack,
  removeTrack,
}: TrackGroupProps) {
  return (
    <div className={`flex`}>
      {tracks.map((track) => (
        <div key={track.id} className="flex flex-grow px-1">
          <div className="flex flex-grow flex-col p-2 border rounded-md shadow-sm overflow-auto bg-card">
            <TrackComponent
              key={track.id}
              setPuzzles={setPuzzles}
              removeTrack={() => removeTrack(track.id)}
              puzzles={puzzles.filter((puzzle) => puzzle.trackId === track.id)}
              ariaLabel={track.name}
              trackId={track.id}
            />
          </div>
        </div>
      ))}
      {tracks.length < MAX_TRACKS && <VerticalDivider onPress={addTrack} />}
    </div>
  );
}
