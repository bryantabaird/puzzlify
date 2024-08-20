import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Dashboard() {
  // Fetch the session to get the user ID
  const session = await auth();

  if (!session || !session.user?.id) {
    return (
      <div className="flex flex-col justify-center items-center m-4">
        <h1>Dashboard</h1>
        <p>You need to be logged in to view your adventures.</p>
      </div>
    );
  }

  // Fetch the adventures hosted by the user
  const hostedAdventures = await prisma.adventure.findMany({
    where: {
      hostId: session.user.id,
    },
  });

  // Fetch adventures that the user has not created
  const adventures = await prisma.adventure.findMany({
    where: {
      NOT: {
        hostId: session.user.id,
      },
    },
  });

  // Fetch the adventures the user is participating in
  // const participatedAdventures = await prisma.userProgress.findMany({
  //   where: {
  //     userId: session.user.id,
  //     completedAt: null, // Assuming this field signifies the stage is incomplete
  //   },
  //   include: {
  //     adventure: true, // Include adventure details
  //   },
  //   distinct: ['adventureId'], // Ensure each adventure appears only once
  // });

  return (
    <div className="flex flex-col justify-center items-center m-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <Link href="/adventure/create" className="mx-2 underline">
        Create Adventure
      </Link>

      <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Hosted Adventures</h2>
        {hostedAdventures.length > 0 ? (
          <ul className="list-disc ml-4">
            {hostedAdventures.map((adventure) => (
              <li key={adventure.id} className="mb-2">
                <Link
                  href={`/adventure/${adventure.id}`}
                  className="text-blue-600 hover:underline"
                >
                  {adventure.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No adventures hosted.</p>
        )}
      </div>

      {/* <div className="mt-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">Participated Adventures</h2>
        {participatedAdventures.length > 0 ? (
          <ul className="list-disc ml-4">
            {participatedAdventures.map((entry) => (
              <li key={entry.adventure.id} className="mb-2">
                <Link href={`/adventure/${entry.adventure.id}`} className="text-blue-600 hover:underline">
                  {entry.adventure.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No adventures participated in.</p>
        )}
      </div> */}

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          Available Adventures to Join
        </h2>
        {adventures.length > 0 ? (
          <ul className="space-y-2">
            {adventures.map((adventure) => (
              <li
                key={adventure.id}
                className="p-2 border rounded-md shadow-sm"
              >
                <h2 className="text-lg font-medium">{adventure.name}</h2>
                <p className="text-sm">Created by: {adventure.hostId}</p>
                <Link
                  href={`/adventure/${adventure.id}`}
                  className="text-blue-600 underline"
                >
                  View Adventure
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No adventures available to join at the moment.</p>
        )}
      </div>
    </div>
  );
}
