"use client";

import { login } from "@/app/actions";
import Link from "next/link";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("submitting");
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      const response = await login(formData);

      if (response.error) {
        console.error(response.error);
        return;
      }

      router.push("/home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" id="email" />
          <label htmlFor="password">Password</label>
          <input type="password" id="password" />
        </div>
        <button type="submit">Log in</button>
      </form>
      <Link href="register">Register</Link>
    </main>
  );
}
