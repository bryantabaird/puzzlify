"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LinearFlow from "./LinearFlow";
import ParallelFlow from "./ParallelFlow";

const FormSchema = z.object({
  type: z.enum(["all", "mentions", "none"], {
    required_error: "You need to select a notification type.",
  }),
});

interface RadioLabelProps {
  title: string;
  description: string;
  flowType: "linear" | "parallel";
}

const linearFlowDescription =
  "Puzzles must be solved in a fixed sequence, where each puzzle must be completed before moving on to the next.";
const parallelFlowDescription =
  "Puzzles are placed into separate tracks that can be solved simultaneously in a flexible, non-sequential manner.";

const RadioLabel: React.FC<RadioLabelProps> = ({
  title,
  description,
  flowType,
}) => {
  return (
    <div className="flex flex-row item gap-4 justify-between items-center">
      <div className="flex flex-col">
        <span className="text-lg font-semibold pb-2">{title}</span>
        <span className="text-sm text-gray-500">{description}</span>
      </div>
      <div className="min-w-24">
        {flowType === "linear" && <LinearFlow />}
        {flowType === "parallel" && <ParallelFlow />}
      </div>
    </div>
  );
};

export default function RadioGroupForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log("data", data);
  }

  return (
    // <Form {...form}>
    //   <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
    <FormField
      control={form.control}
      name="type"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>Puzzle Layout</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-col lg:flex-row"
            >
              <FormItem className="flex-1 w-full flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-primary hover:border-primary">
                <FormControl>
                  <RadioGroupItem value="linear" />
                </FormControl>
                <FormLabel className="font-normal w-full">
                  <RadioLabel
                    title="Linear"
                    description={linearFlowDescription}
                    flowType="linear"
                  />
                </FormLabel>
              </FormItem>
              <FormItem className="flex-1 w-full flex items-center gap-3 p-4 border rounded-lg transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-primary hover:border-primary">
                <FormControl>
                  <RadioGroupItem value="parallel" />
                </FormControl>
                <FormLabel className="font-normal w-full">
                  <RadioLabel
                    title="Parallel"
                    description={parallelFlowDescription}
                    flowType="parallel"
                  />
                </FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
    //     <Button type="submit">Submit</Button>
    //   </form>
    // </Form>
  );
}
