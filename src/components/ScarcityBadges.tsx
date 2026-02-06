import { Zap, Package, TrendingUp } from "lucide-react";

interface ScarcityBadgesProps {
  soldLast24h?: number;
  stockLeft?: number;
}

export const ScarcityBadges = ({ 
  soldLast24h = 1245, 
  stockLeft = 7 
}: ScarcityBadgesProps) => {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-accent/10 rounded-full animate-fade-in">
        <TrendingUp className="w-3.5 h-3.5 text-accent" />
        <span className="text-xs font-medium text-accent">
          {soldLast24h.toLocaleString()} vendidos nas últimas 24h
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-destructive/10 rounded-full animate-fade-in">
        <Package className="w-3.5 h-3.5 text-destructive" />
        <span className="text-xs font-medium text-destructive">
          Apenas {stockLeft} unidades restantes
        </span>
      </div>
    </div>
  );
};
