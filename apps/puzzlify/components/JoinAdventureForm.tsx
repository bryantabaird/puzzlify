"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdventureJoinButton({
  adventureId,
}: {
  adventureId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinAdventure = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`/api/adventure/${adventureId}/join`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to join adventure");
      }

      router.push(`/adventure/${adventureId}/dashboard`);
    } catch (error) {
      console.error("Error joining adventure:", error);
      alert("Failed to join adventure");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoinAdventure}
      disabled={isLoading}
      className="mx-2 underline"
    >
      {isLoading ? "Joining..." : "Join Adventure"}
    </button>
  );
}
