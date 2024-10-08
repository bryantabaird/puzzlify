import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Adventure, Puzzle, TeamAdventure, Tier } from "@prisma/client";
import { Puzzle as PuzzleIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  adventure: Adventure & {
    puzzles: Puzzle[];
    teams: TeamAdventure[];
    tier: Tier;
  };
};

export default function PuzzlesCard({ adventure }: Props) {
  const puzzlesCompleted = 0;
  const totalPuzzles = adventure.puzzles.length;

  return (
    <Card className="transition-all ease-in-out duration-300 hover:bg-muted focus:border-ring">
      <Link href={`/adventure/${adventure.id}/puzzle`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium">Puzzles</CardTitle>
          <PuzzleIcon />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {puzzlesCompleted} / {totalPuzzles}{" "}
          </div>
          <p className="text-xs text-muted-foreground">
            +150 completions in 24h
          </p>
        </CardContent>
      </Link>
    </Card>
  );
}
