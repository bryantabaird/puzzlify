// TODO: SSR?
"use client";

import React from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  type TooltipProps,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const teams = payload.map((pld) => pld.value)[0];

    const teamsLabel = teams && teams > 1 ? "teams" : "team";

    return (
      <div className="bg-foreground p-2 rounded">
        <p className="text-background">{label}:</p>
        <span className="text-primary font-semibold">
          {teams} {teamsLabel}
        </span>
      </div>
    );
  }

  return null;
};

const data = [
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 240,
    puzzleName: "Puzzle 1",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 210,
    puzzleName: "Puzzle 2",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 180,
    puzzleName: "Puzzle 3",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 150,
    puzzleName: "Puzzle 4",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 120,
    puzzleName: "Puzzle 5",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 90,
    puzzleName: "Puzzle 6",
  },
  {
    numberOfTeamsCompleted: Math.floor(Math.random() * 30) + 60,
    puzzleName: "Puzzle 7",
  },
  {
    numberOfTeamsCompleted: 1,
    puzzleName: "Puzzle 8",
  },
];

export default function OverviewCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="puzzleName"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "transparent" }}
            />
            {/* <Tooltip /> */}
            <Bar
              dataKey="numberOfTeamsCompleted"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
