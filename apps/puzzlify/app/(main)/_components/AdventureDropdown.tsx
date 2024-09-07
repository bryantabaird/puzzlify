import { getHostAdventures } from "@/server/db/adventure";
import { getUserId } from "@/server/helpers/getUserId";
import Link from "next/link";
import { Suspense } from "react";

const DropdownItems = async () => {
  const userId = await getUserId();
  const adventures = await getHostAdventures(userId);

  const sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(5000);

  return (
    <>
      {adventures.map((adventure: { id: string; name: string }) => (
        <li key={adventure.id}>
          <Link href={`/adventure/${adventure.id}`}>{adventure.name}</Link>
        </li>
      ))}
    </>
  );
};

const AdventureDropdown = () => {
  return (
    <div className="dropdown dropdown-bottom dropdown-end">
      <div tabIndex={0} role="button" className="btn m-1">
        Adventures
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        <Suspense fallback={<div>Loading...</div>}>
          <DropdownItems />
        </Suspense>
      </ul>
    </div>
  );
};

export default AdventureDropdown;
