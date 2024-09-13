"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure } from "@prisma/client";
import { adventureSchema } from "@/schemas/adventure";
import { createAdventure } from "@/server/actions/host/create-adventure";
import { editAdventure } from "@/server/actions/host/edit-adventure";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TimePickerDemo } from "./datetime-picker.tsx/time-picker-demo";
import { useRouter } from "next/navigation";
import AdventureFlowSelection from "@/app/(main)/adventure/create/_components/AdventureFlowSelection";

type Props = {
  adventure?: Adventure;
  currentDateTime: Date;
};

export default function AdventureForm({ adventure, currentDateTime }: Props) {
  const router = useRouter();

  const mode = adventure ? "edit" : "create";

  const updateAdventure = !adventure
    ? createAdventure.bind(null, {})
    : editAdventure.bind(null, { adventureId: adventure.id });

  const nextWeek = new Date(currentDateTime);
  nextWeek.setDate(currentDateTime.getDate() + 7);

  const { name, startDate } = adventure || { name: "", startDate: nextWeek };
  const defaultValues = { name, startDate };

  const { form, handleSubmitWithAction } = useHookFormAction(
    updateAdventure,
    // TODO: A bad schema here isn't showing errors
    zodResolver(adventureSchema),
    {
      formProps: { defaultValues },
      actionProps: {
        onSuccess: (response) => {
          if (response.data) {
            router.push(`/adventure/${response.data.adventureId}`);
          } else {
            // TODO: Update form there was an error try again
          }
        },
      },
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmitWithAction} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter the name of the adventure</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel className="text-left">Adventure Start</FormLabel>
                <Popover>
                  <FormControl>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[280px] justify-start text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP HH:mm:ss")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                  </FormControl>
                  <FormDescription>
                    The time where adventure participants can access the first
                    available puzzle(s)
                  </FormDescription>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      // TODO: Don't lose the time when a new date is selected
                      // https://github.com/openstatusHQ/time-picker/blob/185627e1481071740aad424872bbcd8ceb552e16/src/components/time-picker/date-time-picker.tsx#L24
                      onSelect={field.onChange}
                      initialFocus
                    />
                    <div className="p-3 border-t border-border">
                      <TimePickerDemo
                        setDate={field.onChange}
                        date={field.value}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </FormItem>
            );
          }}
        />

        <AdventureFlowSelection />

        <Button type="submit">Create</Button>
      </form>
    </Form>
  );
}
