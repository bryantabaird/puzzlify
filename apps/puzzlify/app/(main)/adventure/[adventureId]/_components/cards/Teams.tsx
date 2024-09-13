import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Adventure, Stage, TeamAdventure, Tier } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

type Props = {
  adventure: Adventure & {
    stages: Stage[];
    teams: TeamAdventure[];
    tier: Tier;
  };
};

export default function TeamsCard({ adventure }: Props) {
  const totalStages = adventure.stages.length;
  const teamsSignedUp = 99; //adventure.teams.length;
  const maxTeamCount = 200; //adventure.tier.maxTeamCount;
  const isUserCountError = teamsSignedUp > maxTeamCount;
  const isUserCountWarning = teamsSignedUp > maxTeamCount * 0.25;

  return (
    <Card className={cn(isUserCountError && "border-warning")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle
          className={cn(
            "text-base font-medium",
            isUserCountError && "text-warning",
          )}
        >
          Teams
        </CardTitle>
        <Users />
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            "text-2xl font-bold",
            isUserCountError && "text-warning",
          )}
        >
          {teamsSignedUp} / {maxTeamCount}
        </div>
        <p className="text-xs text-muted-foreground">+10 from the past 24h</p>
      </CardContent>
    </Card>
  );
}
