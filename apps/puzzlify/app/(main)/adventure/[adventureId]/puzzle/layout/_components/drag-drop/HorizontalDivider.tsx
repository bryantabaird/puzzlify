import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";

export default function HorizontalDivider({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <div className="flex items-center justify-center my-2">
      <hr className="border-t border-gray-300 flex-grow" />
      <Button size="icon" variant="ghost" onClick={onPress}>
        <CirclePlus className="text-secondary-foreground" />
      </Button>
      <hr className="border-t border-gray-300 flex-grow" />
    </div>
  );
}
