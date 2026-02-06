import { ShoppingBag } from "lucide-react";

interface HeaderProps {
  cartCount?: number;
  onCartClick?: () => void;
}

export const Header = ({ cartCount = 1, onCartClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b border-border">
      <div className="container flex items-center justify-between h-14 px-4">
        <div className="w-10" />
        <h1 className="font-bold text-lg tracking-tight text-foreground">TechShop</h1>
        <button 
          onClick={onCartClick}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <ShoppingBag className="w-5 h-5 text-foreground" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-accent-foreground text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce-subtle">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
