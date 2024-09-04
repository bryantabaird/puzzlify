"use client";
// TODO: Can I remove use client?

import { removeTeam } from "@/server/actions/host/remove-team";
import { Adventure, Team } from "@prisma/client";

export default function HostTeamEdit({
  teamId,
  adventureId,
}: {
  adventureId: Adventure["id"];
  teamId: Team["id"];
}) {
  const handleSubmit = async () => {
    await removeTeam({ adventureId }, { teamId });
  };

  return (
    <>
      <button onClick={handleSubmit} type="submit" className="btn btn-accent">
        Remove
      </button>
    </>
  );
}
