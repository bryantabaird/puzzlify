"use client";

import { Stage } from "@prisma/client";

import verify from "./actions/verify";

type ParticipantStageProps = {
  stage: Stage;
  adventureId: string;
};

export default function ParticipateStageView({
  stage,
  adventureId,
}: ParticipantStageProps) {
  const verifyWithIds = verify.bind(null, { adventureId, stageId: stage.id });

  return (
    <div>
      <h1>Stage</h1>
      <h2>Riddle:</h2>
      <p>{stage.riddle}</p>
      <form action={verifyWithIds}>
        <input
          type="text"
          name="answer"
          placeholder="Enter your answer"
          required
        />
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
}
