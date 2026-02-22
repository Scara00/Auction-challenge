import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface AuctionTimerProps {
  endDate: string;
  onExpire?: () => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function AuctionTimer({ endDate, onExpire }: AuctionTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const end = new Date(endDate).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setIsExpired(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        onExpire?.();
        return;
      }

      setTimeRemaining({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [endDate, onExpire]);

  if (isExpired) {
    return <></>;
  }

  return (
    <Card className="bg-slate-800 text-white">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5" />
          <span className="font-semibold">Tempo rimanente</span>
        </div>
        <div className="grid grid-cols-4 gap-2 text-center">
          <TimeUnit value={timeRemaining.days} label="Giorni" />
          <TimeUnit value={timeRemaining.hours} label="Ore" />
          <TimeUnit value={timeRemaining.minutes} label="Minuti" />
          <TimeUnit value={timeRemaining.seconds} label="Secondi" />
        </div>
      </CardContent>
    </Card>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="text-3xl font-bold">
        {value.toString().padStart(2, "0")}
      </div>
      <div className="text-xs text-gray-300">{label}</div>
    </div>
  );
}
