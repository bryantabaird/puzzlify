import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";

type DashboardPageProps = {
  params: {
    adventureId: string;
  };
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div>
        <h1>You need to be logged in to view this page.</h1>
      </div>
    );
  }

  const stagesInProgress = await prisma.userProgress.findMany({
    where: {
      userId: userId,
      adventureId: params.adventureId,
      completionTime: null,
    },
    include: {
      stage: true,
    },
  });

  console.log("progress", stagesInProgress);

  if (stagesInProgress.length === 0) {
    return (
      <div>
        <h1>No stages currently in progress</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Stages in Progress</h1>
      <ul>
        {stagesInProgress.map((progress) => (
          <li key={progress.stage.id}>
            <Link
              href={`/adventure/${params.adventureId}/stage/${progress.stage.id}`}
              className="underline"
            >
              {progress.stage.riddle}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
