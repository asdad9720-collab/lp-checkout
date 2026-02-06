import { Truck, Check } from "lucide-react";
import correiosLogo from "@/assets/correios-logo.png";
import sedexLogo from "@/assets/sedex-logo.png";
import jadlogLogo from "@/assets/jadlog-logo.png";

export interface ShippingOption {
  id: number;
  title: string;
  subtitle: string;
  price: number;
  priceLabel: string;
  carrierName: string;
  logo: string;
}

export const shippingOptions: ShippingOption[] = [
  {
    id: 1,
    title: "de 7 a 12 dias Úteis",
    subtitle: "7 a 12 dias",
    price: 0,
    priceLabel: "Grátis",
    carrierName: "Correios",
    logo: correiosLogo,
  },
  {
    id: 2,
    title: "de 4 até 7 dias Úteis",
    subtitle: "4 a 7 dias",
    price: 16.87,
    priceLabel: "R$ 16,87",
    carrierName: "SEDEX",
    logo: sedexLogo,
  },
  {
    id: 3,
    title: "1 dia útil",
    subtitle: "1 a 1 dias",
    price: 26.49,
    priceLabel: "R$ 26,49",
    carrierName: "JadLog",
    logo: jadlogLogo,
  },
];

interface ShippingSelectorProps {
  selected: number;
  onSelect: (id: number) => void;
}

export const ShippingSelector = ({ selected, onSelect }: ShippingSelectorProps) => {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
        <Truck className="w-4 h-4" />
        Opções de Envio
      </h4>
      <div className="space-y-2">
        {shippingOptions.map((option) => {
          const isSelected = selected === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelect(option.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Radio indicator */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? "border-blue-500 bg-blue-500" : "border-gray-300"
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </div>

                {/* Content */}
                <div className="text-left">
                  <p className={`text-sm font-medium ${isSelected ? "text-blue-700" : "text-foreground"}`}>
                    {option.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{option.subtitle}</span>
                    <img 
                      src={option.logo} 
                      alt={option.carrierName} 
                      className="h-4 w-auto object-contain"
                    />
                    <span className="text-xs font-medium text-muted-foreground">
                      {option.carrierName}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <span
                className={`font-bold text-sm flex-shrink-0 ${
                  option.price === 0 ? "text-green-600" : "text-blue-600"
                }`}
              >
                {option.priceLabel}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
