"use client";

import * as React from "react";

import { Adventure } from "@prisma/client";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdventureSwitcher({
  adventureId,
  adventureGroups,
}: {
  adventureId: Adventure["id"];
  adventureGroups: Array<{ label: string; adventures: Array<Adventure> }>;
}) {
  const router = useRouter();

  const handleValueChange = (adventureId: string) => {
    router.push(`/adventure/${adventureId}`);
  };

  return (
    <Select defaultValue={adventureId} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[240px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {adventureGroups.map((group, index) => (
          <SelectGroup key={index}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.adventures.map((adventure) => (
              <SelectItem key={adventure.id} value={adventure.id}>
                {adventure.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
}
