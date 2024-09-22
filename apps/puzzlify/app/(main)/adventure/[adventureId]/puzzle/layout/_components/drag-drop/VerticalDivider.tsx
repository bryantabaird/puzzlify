import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export default function VerticalDivider({ onPress }: { onPress: () => void }) {
  return (
    <div className="flex flex-col items-center pl-4">
      <div className="flex-grow w-px bg-border"></div>
      <Button onClick={onPress} size="icon" variant="ghost">
        <CirclePlus className="text-secondary-foreground" />
      </Button>
      <div className="flex-grow w-px bg-border"></div>
    </div>
  );
}
