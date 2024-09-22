"use client";

import { useState } from "react";
import Image from "next/image";
import { MoreVertical, Edit, Trash } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Adventure } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteStage } from "@/server/actions/host/delete-stage";
import { useAction } from "next-safe-action/hooks";

type PuzzleCard = {
  id: string;
  label: string;
  thumbnail?: string;
};

type PuzzlesCardViewProps = {
  puzzles: PuzzleCard[];
  adventureId: Adventure["id"];
};

export default function PuzzlesCardView({
  puzzles,
  adventureId,
}: PuzzlesCardViewProps) {
  const [puzzleCards, setPuzzleCards] = useState<PuzzleCard[]>(puzzles);
  const router = useRouter();

  const handleEdit = (id: string) => {
    router.push(`/adventure/${adventureId}/puzzle/layout?puzzleId=${id}`);
  };

  const handleDelete = (stageId: string) => {
    setPuzzleCards(puzzleCards.filter((item) => item.id !== stageId));
    execute({ stageId });
  };

  const deleteStageBound = deleteStage.bind(null, { adventureId });

  const { execute } = useAction(deleteStageBound);

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
          <Card key={puzzle.id} className="flex flex-col">
            <CardHeader className="flex-grow">
              <CardTitle className="flex justify-between items-center">
                <span>{puzzle.label}</span>
                <Dialog>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(puzzle.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Are you sure you want to delete this puzzle?
                          </DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently
                            delete the puzzle and remove its data from our
                            servers.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline">Cancel</Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleDelete(puzzle.id)}
                          >
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square relative">
                <Image
                  src={puzzle.thumbnail || "https://picsum.photos/200/300"}
                  alt={puzzle.label}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Link
                href={`/adventure/${adventureId}/puzzle/${puzzle.id}`}
                className={buttonVariants({ variant: "secondary" })}
              >
                View Details
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
