import { useState, useEffect, useCallback } from "react";

function useCountdown(startDate: Date): string | null {
  const getTimeRemaining = useCallback(() => {
    const startTime = new Date(startDate).getTime();
    const currentTime = new Date().getTime();
    const difference = startTime - currentTime;

    if (difference <= 0) {
      return null;
    } else {
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      return `${hours}h ${minutes}m ${seconds}s`;
    }
  }, [startDate]);

  const [timeRemaining, setTimeRemaining] = useState<string | null>(
    getTimeRemaining(),
  );

  useEffect(() => {
    const updateCountdown = () => {
      setTimeRemaining(getTimeRemaining());
    };

    const intervalId = setInterval(updateCountdown, 1000);
    return () => clearInterval(intervalId);
  }, [getTimeRemaining]);

  return timeRemaining;
}

export default useCountdown;
