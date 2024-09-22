"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

export type Progress = {
  id: string;
  teamName: string;
  puzzle1: number;
  puzzle2: number;
};

const formatDuration = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  let result = "";

  if (days > 0) {
    result += `${days}d `;
  }
  if (hours > 0) {
    result += `${String(hours).padStart(2, "0")}h `;
  }

  result += `${String(minutes).padStart(2, "0")}m ${String(secs).padStart(2, "0")}s`;

  return result.trim();
};

export const columns: ColumnDef<Progress>[] = [
  {
    accessorKey: "teamName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Team Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "puzzle1",
    header: "Puzzle 1",
    cell: ({ row }) => {
      const time = row.getValue<Progress["puzzle1"]>("puzzle1");
      return formatDuration(time);
    },
  },
  {
    accessorKey: "puzzle2",
    header: "Puzzle 2",
    cell: ({ row }) => {
      const time = row.getValue<Progress["puzzle2"]>("puzzle2");
      return formatDuration(time);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
