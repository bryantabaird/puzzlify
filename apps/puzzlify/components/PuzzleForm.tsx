"use client";

import { Adventure, Puzzle } from "@prisma/client";
import { createPuzzle } from "@/server/actions/host/create-puzzle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { puzzleSchema } from "@/schemas/puzzle";
import { editPuzzle } from "@/server/actions/host/edit-puzzle";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type PuzzleFormProps = {
  adventureId: Adventure["id"];
  puzzle?: Puzzle;
};

const PuzzleForm = ({ adventureId, puzzle }: PuzzleFormProps) => {
  const mode = puzzle ? "edit" : "create";

  const boundUpdatePuzzle = !puzzle
    ? createPuzzle.bind(null, { adventureId })
    : editPuzzle.bind(null, { adventureId, puzzleId: puzzle.id });

  const { riddle, label } = puzzle || { riddle: "", answer: "", label: "" };
  const defaultValues = {
    riddle: riddle || "",
    answer: "",
    label,
    file: undefined,
  };

  const { form, handleSubmitWithAction } = useHookFormAction(
    boundUpdatePuzzle,
    zodResolver(puzzleSchema),
    { formProps: { defaultValues } },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="flex flex-col gap-2">
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="riddle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Riddle</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="answer"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Answer</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="btn btn-primary w-full">
          {mode === "create" ? "Create Puzzle" : "Update Puzzle"}
        </Button>
      </form>
    </Form>
  );
};

export default PuzzleForm;
