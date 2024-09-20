import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Adventure, Stage, TeamAdventure, Tier } from "@prisma/client";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import Link from "next/link";

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

  // TODO: Show inline alert for error

  return (
    <Card className="transition-all ease-in-out duration-300 hover:bg-muted focus:border-ring">
      <Link href={`/adventure/${adventure.id}/teams`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className={"text-base font-medium"}>Teams</CardTitle>
          <Users />
        </CardHeader>
        <CardContent>
          <div className={"text-2xl font-bold"}>
            {teamsSignedUp} / {maxTeamCount}
          </div>
          <p className="text-xs text-muted-foreground">+10 from the past 24h</p>
        </CardContent>
      </Link>
    </Card>
  );
}
