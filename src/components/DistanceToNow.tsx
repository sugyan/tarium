import { formatDistanceToNowStrict, parseISO } from "date-fns";
import { FC, useEffect, useRef, useState } from "react";

const REFRESHES = [
  { threshold: 10_000, interval: 1000 },
  { threshold: 60_000, interval: 10_000 },
  { threshold: 3600_000, interval: 60_000 },
];

const DistanceToNow: FC<{ date: string }> = ({ date }) => {
  const parsed = parseISO(date);
  const [distance, setDistance] = useState<string>();
  const timeoutId = useRef<number>();
  useEffect(() => {
    const updateDistance = () => {
      setDistance(formatDistanceToNowStrict(parsed));
      const d = new Date().getTime() - parsed.getTime();
      const refresh = REFRESHES.find(({ threshold }) => d < threshold);
      timeoutId.current = setTimeout(
        updateDistance,
        refresh ? refresh.interval - (d % refresh.interval) : 3600_000
      );
    };
    updateDistance();
    return () => clearTimeout(timeoutId.current);
  }, [date]);
  return <>{distance}</>;
};

export default DistanceToNow;
