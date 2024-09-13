import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Adventure, Stage, TeamAdventure, Tier } from "@prisma/client";
import { Puzzle } from "lucide-react";

type Props = {
  adventure: Adventure & {
    stages: Stage[];
    teams: TeamAdventure[];
    tier: Tier;
  };
};

export default function StagesCard({ adventure }: Props) {
  const stagesCompleted = 0;
  const totalStages = adventure.stages.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium">Puzzles</CardTitle>
        <Puzzle />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {stagesCompleted} / {totalStages}{" "}
        </div>
        <p className="text-xs text-muted-foreground">+150 completions in 24h</p>
      </CardContent>
    </Card>
  );
}
