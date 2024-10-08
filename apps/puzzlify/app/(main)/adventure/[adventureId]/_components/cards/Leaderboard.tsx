import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Adventure } from "@prisma/client";
import { Medal } from "lucide-react";

export default function LeaderboardCard({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) {
  const leaderboardData = [
    {
      name: "Olivia Martin",
      rank: "#1",
      level: "Level 10",
      timeSpent: "2h 30m",
    },
    {
      name: "Jackson Lee",
      rank: "#2",
      level: "Level 9",
      timeSpent: "2h 50m",
    },
    {
      name: "Isabella Nguyen",
      rank: "#3",
      level: "Level 9",
      timeSpent: "3h 15m",
    },
    {
      name: "William Kim",
      rank: "#4",
      level: "Level 8",
      timeSpent: "4h 5m",
    },
    {
      name: "Sofia Davis",
      rank: "#5",
      level: "Level 7",
      timeSpent: "5h 0m",
    },
  ];

  return (
    <Card className="col-span-3 transition-all ease-in-out duration-300 hover:bg-muted focus:border-ring">
      <Link href={`/adventure/${adventureId}/leaderboard`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <CardTitle>Leaderboard</CardTitle>
          <Medal />
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {leaderboardData.map((participant, index) => (
              <div key={index} className="flex items-center">
                {/* Rank as a styled number instead of avatar */}
                <div className="flex items-center justify-center h-9 w-9 bg-gray-200 rounded-full">
                  <span className="font-bold text-gray-700">
                    {participant.rank}
                  </span>
                </div>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {participant.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {participant.timeSpent}
                  </p>
                </div>
                <div className="ml-auto font-medium">{participant.level}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
