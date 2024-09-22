import React from "react";
import Link from "next/link";
import JoinAdventureForm from "@/components/JoinAdventureForm";
import { getUserId } from "@/server/helpers/getUserId";
import { getAdventureWithStages } from "@/server/db/adventure";
import { Adventure } from "@prisma/client";
import { getUserAdventure } from "@/server/db/user-adventure";
import { buttonVariants } from "@/components/ui/button";

export default async function JoinAdventure({
  params,
}: {
  params: { adventureId: Adventure["id"] };
}) {
  const userId = await getUserId();

  const adventureId = params.adventureId;
  const adventure = await getAdventureWithStages(adventureId);

  if (!adventure) {
    return (
      <div>
        <h1>Adventure not found</h1>
      </div>
    );
  }

  /**
   * If a user is in the adventure, UI should redirect
   * If a user is NOT in the adventure, they should create a team and join the adventure
   */

  const userAdventure = await getUserAdventure({
    userId,
    adventureId: adventureId,
  });

  if (userAdventure) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
          <div className="card-body">
            <div className="items-center mt-2">
              You are already in this adventure!
              <Link
                href={`/adventure/${adventureId}`}
                className={buttonVariants()}
              >
                Go to adventure
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-full">
      <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
        <div className="card-body">
          <div className="items-center mt-2">
            <JoinAdventureForm adventureId={adventureId} />
          </div>
        </div>
      </div>
    </div>
  );
}
