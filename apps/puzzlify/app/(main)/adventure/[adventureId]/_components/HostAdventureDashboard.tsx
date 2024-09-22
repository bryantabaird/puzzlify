import { Adventure, Puzzle, TeamAdventure, Tier } from "@prisma/client";
import Link from "next/link";

type Props = {
  adventure: Adventure & {
    puzzles: Puzzle[];
    teams: TeamAdventure[];
    tier: Tier;
  };
};

export default function HostAdventureDashboard({ adventure }: Props) {
  const totalPuzzles = adventure.puzzles.length;
  const teamsSignedUp = adventure.teams.length;
  const maxTeamCount = adventure.tier.maxTeamCount;
  const isUserCountError = teamsSignedUp > maxTeamCount;
  const isUserCountWarning = teamsSignedUp > maxTeamCount * 0.25;

  return (
    <div className="p-4">
      <div className="grid auto-rows-fr grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat bg-base-300 rounded-box">
          <div className="stat-title text-base-content">Teams Signed Up</div>
          <div
            className={`stat-value ${isUserCountError ? "text-error" : isUserCountWarning ? "text-warning" : "text-accent"}`}
          >
            {teamsSignedUp} / {maxTeamCount}
          </div>
          <div className="stat-actions">
            <button
              className={`btn btn-sm ${isUserCountError ? "btn-error" : isUserCountWarning ? "btn-warning" : "btn-primary"}`}
            >
              View
            </button>
          </div>
        </div>

        <div className="stat bg-base-300 shadow-md rounded-box">
          <div className="stat-title text-base-content">Total Puzzles</div>
          <div className="stat-value text-accent">{totalPuzzles}</div>
          <div className="stat-actions">
            <button className="btn btn-sm btn-primary">
              <Link href={`/adventure/${adventure.id}/puzzle`}>View</Link>
            </button>
          </div>
        </div>

        <div className="col-span-2 sm:col-span-2">
          <div className="stat bg-base-300 shadow-md rounded-box">
            <div className="stat-title text-base-content">Time Remaining</div>
            <div className="stat-value text-accent">7d 10h 5s</div>
            <div className="stat-actions">
              <button className="btn btn-sm btn-primary">View</button>
            </div>
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 sm:row-span-2">
          <div className="flex justify-center items-center h-full bg-base-300">
            Empty graph for now
          </div>
        </div>

        <div className="col-span-1 sm:col-span-2 sm:row-span-2">
          <div className="flex justify-center items-center h-full bg-base-300">
            Empty graph for now
          </div>
        </div>
      </div>
    </div>
  );
}
