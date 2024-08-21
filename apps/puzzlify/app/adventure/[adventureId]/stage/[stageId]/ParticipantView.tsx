"use client";

import { Stage } from "@prisma/client";
import { useState } from "react";

import { useRouter } from "next/navigation";

type ParticipantStageProps = {
  stage: Stage;
  adventureId: string;
};

export default function ParticipateStageView({
  stage,
  adventureId,
}: ParticipantStageProps) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch(
      `/api/adventure/${adventureId}/stage/${stage.id}/verify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      setResult(data.message);
    } else {
      router.push(`/adventure/${adventureId}/dashboard`);
    }
  };

  return (
    <div>
      <h1>Stage</h1>
      <h2>Riddle:</h2>
      <p>{stage.riddle}</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
          required
        />
        <button type="submit">Submit Answer</button>
      </form>
      {result && <p>{result}</p>}
    </div>
  );
}
