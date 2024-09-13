import { auth } from "@/auth";
import DeleteAdventureForm from "@/components/DeleteAdventureForm";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getHostAdventures, getTeamAdventures } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import Link from "next/link";

export default async function Dashboard() {
  const userId = await getUserId();

  const [hostedAdventures, adventures] = await Promise.all([
    await getHostAdventures(userId),
    await getTeamAdventures(userId),
  ]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 m-40">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Welcome to Adventure Quest!</h1>
          <p className="mt-2">Choose your path to begin your adventure.</p>
        </div>
        <div className="flex w-full flex-col lg:flex-row gap-6">
          <div className="card bg-base-300 rounded-box grid flex-1 place-items-center">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Join Existing Adventure
              </h2>
              <p className="mb-6">
                Already have an adventure code? Jump right in and start your
                quest!
              </p>
              <div className="w-full">
                <Link href="/adventure/join">
                  <Button>Join Adventure</Button>
                </Link>
              </div>
            </div>
          </div>
          <Separator orientation="vertical" />

          <div className="card bg-base-300 rounded-box grid flex-1 place-items-center">
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Create an Adventure
              </h2>
              <p className="mb-6">
                Set up a new adventure and challenge your friends!
              </p>
              <div className="w-full">
                <Link href="/adventure/create">
                  <Button>Create Adventure</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center m-4">
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

                  <DeleteAdventureForm adventureId={adventure.id} />
                </li>
              ))}
            </ul>
          ) : (
            <p>No adventures hosted.</p>
          )}
        </div>

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
    </div>
  );
}
