import { Adventure, User } from "@prisma/client";
import Builder from "../../puzzle/layout/_components/drag-drop/Builder";

export default async function HostStagesView({
  userId,
  adventureId,
}: {
  userId: User["id"];
  adventureId: Adventure["id"];
}) {
  return <Builder />;
}
