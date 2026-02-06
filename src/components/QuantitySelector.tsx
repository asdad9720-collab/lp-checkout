import { Minus, Plus } from "lucide-react";
import { useState } from "react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  max?: number;
}

export const QuantitySelector = ({ 
  quantity, 
  onQuantityChange, 
  max = 10 
}: QuantitySelectorProps) => {
  const [isAnimating, setIsAnimating] = useState<"plus" | "minus" | null>(null);

  const handleChange = (delta: number) => {
    const newQuantity = Math.max(1, Math.min(max, quantity + delta));
    if (newQuantity !== quantity) {
      setIsAnimating(delta > 0 ? "plus" : "minus");
      onQuantityChange(newQuantity);
      setTimeout(() => setIsAnimating(null), 150);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card border-t border-border">
      <span className="font-semibold text-foreground">Quantidade:</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => handleChange(-1)}
          disabled={quantity <= 1}
          className={`w-10 h-10 rounded-full bg-secondary flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAnimating === "minus" ? "scale-90 bg-primary/20" : ""
          }`}
        >
          <Minus className="w-5 h-5 text-foreground" />
        </button>
        <span className="w-8 text-center text-lg font-bold text-foreground tabular-nums">
          {quantity}
        </span>
        <button
          onClick={() => handleChange(1)}
          disabled={quantity >= max}
          className={`w-10 h-10 rounded-full bg-primary flex items-center justify-center transition-all active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed ${
            isAnimating === "plus" ? "scale-110 shadow-lg" : ""
          }`}
        >
          <Plus className="w-5 h-5 text-primary-foreground" />
        </button>
      </div>
    </div>
  );
};
