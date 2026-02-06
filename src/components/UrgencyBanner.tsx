import { useState, useEffect } from "react";
import { Flame } from "lucide-react";

interface UrgencyBannerProps {
  initialHours?: number;
  initialMinutes?: number;
  initialSeconds?: number;
}

export const UrgencyBanner = ({ 
  initialHours = 3, 
  initialMinutes = 45, 
  initialSeconds = 12 
}: UrgencyBannerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: initialHours,
    minutes: initialMinutes,
    seconds: initialSeconds,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          clearInterval(timer);
          return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-accent text-accent-foreground py-2 px-4 text-center text-sm font-medium animate-urgency-pulse">
      <div className="container flex items-center justify-center gap-2 flex-wrap">
        <Flame className="w-4 h-4 animate-bounce" />
        <span>OFERTA RELÂMPAGO: Preço promocional acaba em:</span>
        <div className="flex items-center gap-1 font-bold bg-white/20 px-2 py-0.5 rounded">
          <span className="tabular-nums">{formatNumber(timeLeft.hours)}h</span>
          <span>:</span>
          <span className="tabular-nums">{formatNumber(timeLeft.minutes)}m</span>
          <span>:</span>
          <span className="tabular-nums">{formatNumber(timeLeft.seconds)}s</span>
        </div>
      </div>
    </div>
  );
};
