import React from "react";
import Link from "next/link";
import JoinAdventureForm from "@/components/JoinAdventureForm";
import { getUserId } from "@/server/helpers/getUserId";
import { getAdventureWithStages } from "@/server/db/adventure";
import { Adventure } from "@prisma/client";
import { isAdventureParticipant } from "@/server/helpers/isAdventureParticipant";

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

  const isParticipant = await isAdventureParticipant({ adventureId, userId });

  if (isParticipant) {
    return (
      // TODO: Update the UI here to redirect to the dashboard. Users don't need
      // to join an adventure they are already a part of.
      <div className="flex justify-center items-center h-full">
        <div className="card w-96 bg-base-200 shadow-2xl mt-20 mb-20">
          <div className="card-body">
            <div className="items-center mt-2">
              <Link href={`/adventure/${adventureId}`}>
                <a className="btn btn-primary">Go to adventure</a>
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
