"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Adventure } from "@prisma/client";
import Link from "next/link";
import PuzzleCard from "./PuzzleCard";

type PuzzleCardState = {
  id: string;
  label: string;
  thumbnail?: string;
};

type PuzzlesCardViewProps = {
  puzzles: PuzzleCardState[];
  adventureId: Adventure["id"];
};

export default function PuzzlesCardView({
  puzzles,
  adventureId,
}: PuzzlesCardViewProps) {
  const [puzzleCards, setPuzzleCards] = useState<PuzzleCardState[]>(puzzles);

  const handleDelete = (puzzleId: string) => {
    setPuzzleCards(puzzleCards.filter((item) => item.id !== puzzleId));
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between pb-4">
        <h1 className="text-2xl font-bold">Puzzles</h1>
        <Link
          href={`/adventure/${adventureId}/puzzle/create`}
          className={buttonVariants()}
        >
          Create
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[80vh] overflow-y-auto">
        {puzzleCards.map((puzzle) => (
          <PuzzleCard
            key={puzzle.id}
            puzzleId={puzzle.id}
            label={puzzle.label}
            thumbnail={puzzle.thumbnail}
            adventureId={adventureId}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
