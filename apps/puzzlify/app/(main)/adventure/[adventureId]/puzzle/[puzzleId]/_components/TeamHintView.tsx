"use client";

import GetHintForm from "@/components/GetHintForm";
import useCountdown from "@/hooks/useCountdown";
import { Adventure, Hint, Stage } from "@prisma/client";

type Props = {
  hintId: Hint["id"];
  puzzleId: Stage["id"];
  adventureId: Adventure["id"];
  delay: Hint["delay"];
  startDate: Date;
};

export default function TeamHintView({
  hintId,
  puzzleId,
  adventureId,
  delay,
  startDate,
}: Props) {
  const hintReleaseTime = new Date(startDate.getTime() + delay * 1000);
  const timeRemaining = useCountdown(hintReleaseTime);

  return (
    <>
      {timeRemaining ? (
        <p>(Available in {timeRemaining})</p>
      ) : (
        <GetHintForm
          hintId={hintId}
          stageId={puzzleId}
          adventureId={adventureId}
        />
      )}
    </>
  );
}
