import { buttonVariants } from "@/components/ui/button";
import { getHostAdventures, getTeamAdventures } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function AdventurePage() {
  const userId = await getUserId();

  const [hostedAdventures, teamAdventures] = await Promise.all([
    await getHostAdventures(userId),
    await getTeamAdventures(userId),
  ]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Adventures</h1>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 p-6 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">My Teams</h2>
            <Link
              href={`/adventure/join`}
              className={buttonVariants({ variant: "outline" })}
            >
              Explore
            </Link>
          </div>
          {teamAdventures.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 mb-4">
                No adventures found. Why not join one?
              </p>
              <Link
                href={`/adventure/join`}
                className={buttonVariants({ variant: "default" })}
              >
                Find Adventures
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {teamAdventures.map((adventure) => (
                <li key={adventure.id} className="p-4 rounded-lg">
                  <Link href={`/adventure/${adventure.id}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">{adventure.name}</h3>
                        <p className="text-sm">
                          {adventure.startDate.toISOString()}
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex-1 p-6 border rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Hosted</h2>
            <Link
              href={`/adventure/create`}
              className={buttonVariants({ variant: "outline" })}
            >
              Create
            </Link>
          </div>
          {hostedAdventures.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg text-gray-500 mb-4">
                You haven't hosted any adventures yet.
              </p>
              <Link
                href={`/adventure/join`}
                className={buttonVariants({ variant: "default" })}
              >
                Find Adventures
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {hostedAdventures.map((adventure) => (
                <li
                  key={adventure.id}
                  className="group p-4 border rounded-lg transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105 focus-within:shadow-lg"
                >
                  <Link href={`/adventure/${adventure.id}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold">{adventure.name}</h3>
                        <div className="border-t my-2"></div>
                        <p className="text-sm">
                          Start Time:{" "}
                          {new Date(adventure.startDate).toLocaleString()}
                        </p>
                      </div>

                      <ArrowRight className="w-5 group-hover:text-primary transition-colors duration-200" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
