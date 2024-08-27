"use client";

import useCountdown from "@/hooks/useCountdown";
import { Hint } from "@prisma/client";

type HostStageViewProps = {
  hint: Hint;
  startDate: Date;
};

export default function ParticipantHintView({
  hint,
  startDate,
}: HostStageViewProps) {
  const hintReleaseTime = new Date(startDate.getTime() + hint.delay * 1000);

  // TODO: Hints should not be retrieve client side until the time expires.
  // Put behind a server action that verifies the time
  const timeRemaining = useCountdown(hintReleaseTime);

  return (
    <>
      {timeRemaining ? (
        <p>(Available in {timeRemaining})</p>
      ) : (
        <p>{hint.hint}</p>
      )}
    </>
  );
}
