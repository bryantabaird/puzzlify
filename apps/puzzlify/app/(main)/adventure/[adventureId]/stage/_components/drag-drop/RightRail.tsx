// src/components/Track.tsx
import React, { useEffect } from "react";
import {
  ListBox,
  ListBoxItem,
  useDragAndDrop,
  DropIndicator,
  isTextDropItem,
} from "react-aria-components";
import { ListData, useListData } from "react-stately";
import { Puzzle } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowUpFromLine, Grip, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackProps {
  setPuzzles: React.Dispatch<React.SetStateAction<Puzzle[]>>;
  list: ListData<Puzzle>;
  ariaLabel: string;
  trackId: string;
}

const RightRail: React.FC<TrackProps> = ({
  setPuzzles,
  list,
  ariaLabel,
  trackId,
}) => {
  let { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      return [...keys].map((key) => {
        let item = list.getItem(key);
        return {
          "custom-app-type": JSON.stringify(item),
          "text/plain": item.name,
        };
      });
    },

    renderDragPreview(items) {
      return (
        <div className="flex bg-primary opacity-90 items-centerborder shadow-lg rounded-lg p-2 text-sm space-x-2">
          <div className="flex items-center space-x-2">
            <Grip size={16} className="hidden lg:block" />
            <GripVertical size={16} className="block lg:hidden" />
            <span className="font-medium">{items[0]["text/plain"]}</span>
          </div>
          <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs font-semibold">
            {items.length}
          </span>
        </div>
      );
    },

    renderDropIndicator: (target) => (
      <DropIndicator
        target={target}
        className={({ isDropTarget }) =>
          isDropTarget ? "outline outline-1 outline-primary" : ""
        }
      />
    ),

    acceptedDragTypes: ["custom-app-type"],
    getDropOperation: () => "move",

    async onInsert(e) {
      let processedItems = (await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText("custom-app-type")),
          ),
      )) as Puzzle[];

      setPuzzles((prevPuzzles) =>
        prevPuzzles.map((puzzle) =>
          processedItems.map((item) => item.id).includes(puzzle.id)
            ? { ...puzzle, trackId }
            : puzzle,
        ),
      );

      if (e.target.dropPosition === "before") {
        list.insertBefore(e.target.key, ...processedItems);
      } else if (e.target.dropPosition === "after") {
        list.insertAfter(e.target.key, ...processedItems);
      }
    },

    async onRootDrop(e) {
      let processedItems = await Promise.all(
        e.items
          .filter(isTextDropItem)
          .map(async (item) =>
            JSON.parse(await item.getText("custom-app-type")),
          ),
      );
      list.append(...processedItems);
    },

    onReorder(e) {
      if (e.target.dropPosition === "before") {
        list.moveBefore(e.target.key, e.keys);
      } else if (e.target.dropPosition === "after") {
        list.moveAfter(e.target.key, e.keys);
      }
    },

    onDragEnd(e) {
      if (e.dropOperation === "move" && !e.isInternal) {
        list.remove(...e.keys);
      }
    },
  });

  // Workaround for issue where Google Chrome flickers the green plus icon
  // when dragging an item and reordering it within a list
  // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/DataTransfer
  useEffect(() => {
    const handleEvent = (event: DragEvent) => {
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.dropEffect = "move";
      }
    };

    document.addEventListener("dragend", handleEvent);
    document.addEventListener("dragstart", handleEvent);

    return () => {
      document.removeEventListener("dragend", handleEvent);
      document.removeEventListener("dragstart", handleEvent);
    };
  }, []);

  return (
    <div className="w-full p-4 border rounded-tl-md rounded-bl-md shadow-sm overflow-auto">
      <h2 className="text-lg font-semibold mb-2">{ariaLabel}</h2>
      <ListBox
        aria-label={ariaLabel}
        selectionMode="single"
        selectedKeys={list.selectedKeys}
        onSelectionChange={list.setSelectedKeys}
        items={list.items}
        dragAndDropHooks={dragAndDropHooks}
        renderEmptyState={() => (
          <div className="flex items-center border border-dashed rounded-lg justify-center min-h-14 h-full">
            <ArrowUpFromLine />
          </div>
        )}
        className={(props) => {
          if (props.isDropTarget) {
            console.log("isDropTarget", true);
          }
          return cn(
            "flex flex-col",
            props.isDropTarget ? "outline outline-primary rounded-md" : "",
          );
        }}
      >
        {(item) => (
          <ListBoxItem
            className={(props) => {
              // console.log("isDropTarget", props);
              return "flex focus:outline-2 focus:outline-primary items-center cursor-move p-2 text-sm rounded-md m-1 relative group border hover:bg-accent transition-colors";
            }}
          >
            <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-l-md">
              <Grip size={16} className="hidden lg:block" />
              <GripVertical size={16} className="block lg:hidden" />
            </span>
            <span className="lg:ml-2 truncate">{item.name}</span>
          </ListBoxItem>
        )}
      </ListBox>
    </div>
  );
};

export default RightRail;
