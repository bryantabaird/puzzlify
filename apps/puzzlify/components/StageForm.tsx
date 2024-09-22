"use client";

import { Adventure, Stage } from "@prisma/client";
import { createStage } from "@/server/actions/host/create-stage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { stageSchema } from "@/schemas/stage";
import { editStage } from "@/server/actions/host/edit-stage";
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

type StageFormProps = {
  adventureId: Adventure["id"];
  stage?: Stage;
};

const StageForm = ({ adventureId, stage }: StageFormProps) => {
  const mode = stage ? "edit" : "create";

  const boundUpdateStage = !stage
    ? createStage.bind(null, { adventureId })
    : editStage.bind(null, { adventureId, stageId: stage.id });

  const { riddle, label } = stage || { riddle: "", answer: "", label: "" };
  const defaultValues = {
    riddle: riddle || "",
    answer: "",
    label,
    file: undefined,
  };

  const { form, handleSubmitWithAction } = useHookFormAction(
    boundUpdateStage,
    zodResolver(stageSchema),
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
          {mode === "create" ? "Create Stage" : "Update Stage"}
        </Button>
      </form>
    </Form>
  );
};

export default StageForm;
