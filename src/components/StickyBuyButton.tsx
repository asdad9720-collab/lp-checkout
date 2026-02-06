import { ShoppingCart } from "lucide-react";

interface StickyBuyButtonProps {
  price: number;
  quantity: number;
  onClick: () => void;
}

export const StickyBuyButton = ({ price, quantity, onClick }: StickyBuyButtonProps) => {
  const totalPrice = price * quantity;
  
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border p-4 safe-area-bottom">
      <div className="container max-w-lg mx-auto flex items-center gap-3">
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">
            Total {quantity > 1 ? `(${quantity}x)` : ""}
          </p>
          <p className="text-xl font-bold text-foreground">{formatPrice(totalPrice)}</p>
        </div>
        <button
          onClick={onClick}
          className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-6 rounded-xl animate-pulse-soft animate-glow transition-all active:scale-95"
        >
          <ShoppingCart className="w-5 h-5" />
          COMPRAR AGORA
        </button>
      </div>
    </div>
  );
};
