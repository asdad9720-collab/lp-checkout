import { Product } from "@/types/product";
import { Star, Truck, Shield, Clock } from "lucide-react";
import { ScarcityBadges } from "./ScarcityBadges";

interface PriceSectionProps {
  product: Product;
}

export const PriceSection = ({ product }: PriceSectionProps) => {
  const formatPrice = (price: number) =>
    price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="bg-card animate-fade-up">
      {/* Discount badge */}
      <div className="flex items-center gap-2 p-4 pb-2">
        <span className="px-2 py-1 bg-discount text-discount-foreground text-xs font-bold rounded animate-pulse">
          -{product.discount}% OFF
        </span>
        <span className="text-xs text-muted-foreground">🔥 Oferta por tempo limitado</span>
      </div>

      {/* Price */}
      <div className="px-4">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-3xl font-extrabold text-foreground">
            {formatPrice(product.price)}
          </span>
          <span className="text-lg text-price-old line-through">
            {formatPrice(product.originalPrice)}
          </span>
        </div>

        {/* Installments */}
        <p className="text-sm text-muted-foreground mb-3">
          ou 3x de {formatPrice(product.price / 3)} sem juros
        </p>
      </div>

      {/* Scarcity badges */}
      <ScarcityBadges soldLast24h={1245} stockLeft={7} />

      {/* Product name */}
      <div className="px-4">
        <h2 className="text-lg font-semibold text-foreground mb-2">{product.name}</h2>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-star text-star" />
            <span className="font-semibold text-foreground">{product.rating}</span>
          </div>
          <span className="text-muted-foreground text-sm">
            ({product.reviewCount.toLocaleString()} avaliações)
          </span>
          <span className="text-muted-foreground text-sm">
            • {product.soldCount.toLocaleString()} vendidos
          </span>
        </div>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-3 gap-2 p-4 pt-0">
        <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary rounded-xl">
          <Truck className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground">Frete Grátis</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary rounded-xl">
          <Shield className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground">Garantia 1 ano</span>
        </div>
        <div className="flex flex-col items-center text-center gap-1 p-3 bg-secondary rounded-xl">
          <Clock className="w-5 h-5 text-primary" />
          <span className="text-xs text-muted-foreground">Envio 24h</span>
        </div>
      </div>
    </div>
  );
};
