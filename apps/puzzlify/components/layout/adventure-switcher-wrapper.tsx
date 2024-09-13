import { getHostAdventures, getTeamAdventures } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import AdventureSwitcher from "./adventure-switcher";
import { Adventure } from "@prisma/client";

export default async function AdventureSwitcherWrapper({
  adventureId,
}: {
  adventureId: Adventure["id"];
}) {
  const userId = await getUserId();

  const [hostedAdventures, teamAdventures] = await Promise.all([
    await getHostAdventures(userId),
    await getTeamAdventures(userId),
  ]);

  const adventureGroups = [
    {
      label: "Hosted Adventures",
      adventures: hostedAdventures,
    },
    {
      label: "Team Adventures",
      adventures: teamAdventures,
    },
  ];

  return (
    <AdventureSwitcher
      adventureId={adventureId}
      adventureGroups={adventureGroups}
    />
  );
}
