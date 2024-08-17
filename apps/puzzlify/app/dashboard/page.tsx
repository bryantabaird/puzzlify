import { auth } from "@/auth";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  console.log(session);

  return (
    <div className="flex flex-col justify-center items-center m-4">
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(session, null, 4)}</pre>
      <Link href="adventures/create" className="mx-2 underline">
        Create Adventure
      </Link>
    </div>
  );
}
