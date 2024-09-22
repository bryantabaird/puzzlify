"use client";

import { useRef, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Adventure } from "@prisma/client";
import { createPuzzle } from "@/server/actions/host/create-puzzle";
import { puzzleFormSchema } from "@/schemas/puzzle";
import uploadAssets, { FileAsset } from "./uploadAssets";

type CreatePuzzlePageProps = {
  adventureId: Adventure["id"];
};

export default function CreatePuzzlePage({
  adventureId,
}: CreatePuzzlePageProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "puzzle-details",
  ]);

  const defaultValues = {
    label: "",
    riddle: "",
    answer: "",
    assets: [],
    hints: [],
  };

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    createPuzzle.bind(null, { adventureId }),
    zodResolver(puzzleFormSchema),
    {
      formProps: { defaultValues },
      actionProps: {
        onSuccess: async ({ data, input }) => {
          if (data?.puzzleId) {
            uploadAssets({
              adventureId,
              puzzleId: data.puzzleId,
              fileAssets: fileAssetsRef.current,
            });
          }
        },
      },
    },
  );

  console.log("action return", action);

  const {
    fields: assetFields,
    append: appendAsset,
    remove: removeAsset,
  } = useFieldArray({
    control: form.control,
    name: "assets",
  });

  const {
    fields: hintFields,
    append: appendHint,
    remove: removeHint,
  } = useFieldArray({
    control: form.control,
    name: "hints",
  });

  const handleAddAsset = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const assetId = self.crypto.randomUUID();
        appendAsset({
          id: assetId,
          fileType: file.type,
          preview: URL.createObjectURL(file),
        });
        fileAssetsRef.current.push({ assetId, file });
      });
    }
  };

  const handleRemoveAsset = (index: number) => {
    removeAsset(index);
    fileAssetsRef.current.splice(index, 1);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const fileAssetsRef = useRef<Array<FileAsset>>([]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Create New Puzzle</h1>

      <Form {...form}>
        <form onSubmit={handleSubmitWithAction} className="space-y-6">
          <Accordion type="multiple" value={expandedSections}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puzzle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter puzzle name" {...field} />
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
                      <Textarea
                        placeholder="Enter the riddle for this puzzle"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Answer</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter answer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <AccordionItem value="assets">
              <AccordionTrigger onClick={() => toggleSection("assets")}>
                Images
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="asset-upload">Upload Images</Label>
                    <Input
                      id="asset-upload"
                      type="file"
                      onChange={handleAddAsset}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {assetFields.map((field, index) => (
                      <Card key={field.id} className="relative">
                        <CardContent className="p-2">
                          <img
                            src={field.preview}
                            alt={`Asset ${field.id}`}
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={() => handleRemoveAsset(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    <Card className="flex items-center justify-center cursor-pointer border-dashed border-2 border-gray-300">
                      <CardContent className="p-2 h-32 flex flex-col justify-center items-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            document.getElementById("asset-upload")?.click()
                          } // Assuming addAsset is your function to add a new asset
                        >
                          <Plus />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* TODO: If form error, consider handling if the section is collapsed */}
            <AccordionItem value="hints">
              <AccordionTrigger onClick={() => toggleSection("hints")}>
                Hints
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  {hintFields.map((field, index) => (
                    <Card key={field.id}>
                      <CardContent className="p-4">
                        {/* Flexbox container for responsiveness */}
                        <div className="flex flex-col justify-start md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0">
                          <FormField
                            control={form.control}
                            name={`hints.${index}.hint`}
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormLabel>Hint</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter hint" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Delay Input */}
                          <FormField
                            control={form.control}
                            name={`hints.${index}.delay`}
                            render={({ field }) => (
                              <FormItem className="md:w-32">
                                <FormLabel>Delay (seconds)</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={0}
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(+e.target.value)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Remove Hint Button */}
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => removeHint(index)}
                            className="w-full md:w-auto"
                          >
                            Remove Hint
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => appendHint({ hint: "", delay: 8 })}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Hint
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <Button type="submit" className="w-full">
            Save Puzzle
          </Button>
        </form>
      </Form>
    </div>
  );
}
