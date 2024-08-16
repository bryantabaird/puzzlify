import { auth } from "@/auth";

import { logout } from "@/app/actions";

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <>
      <h1>Home Page</h1>
      <div>{session?.user?.name}</div>
      <form action={logout}>
        <button type="submit">Log out</button>
      </form>
    </>
  );
}
