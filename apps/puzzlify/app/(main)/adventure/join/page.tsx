import { getTeamAdventures } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import Link from "next/link";

export default async function JoinAdventure() {
  const userId = await getUserId();

  const adventures = await getTeamAdventures(userId);

  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <div className="p-6">
        {adventures.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold mb-4">
              Available Adventures to Join
            </h2>
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
          </>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center bg-base-100 text-base-content">
            <div className="card bg-base-300 rounded-box grid flex-1 place-items-center max-w-lg">
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-semibold mb-4">
                  No Adventures Found
                </h2>
                <p className="mb-6">
                  It looks like there are no adventures currently available to
                  join. Maybe create one instead?
                </p>
                <button className="btn btn-primary w-full max-w-xs">
                  <Link href="/adventure/create">Create Adventure</Link>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
