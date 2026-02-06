import { Gift } from "lucide-react";
import bumpMachine from "@/assets/bump-machine.png";
import bumpBlade from "@/assets/bump-blade.png";

export interface BumpOption {
  id: string;
  image: string;
  title: string;
  highlight: string;
  price: number;
}

export const bumpOptions: BumpOption[] = [
  {
    id: "machine",
    image: bumpMachine,
    title: "Levar",
    highlight: "1x Máquina Extra (Reserva)",
    price: 29.90,
  },
  {
    id: "blades",
    image: bumpBlade,
    title: "Kit",
    highlight: "3x Lâminas de Precisão",
    price: 29.90,
  },
];

interface OrderBumpsProps {
  selectedBumps: string[];
  onToggle: (id: string) => void;
}

export const OrderBumps = ({ selectedBumps, onToggle }: OrderBumpsProps) => {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
        <Gift className="w-4 h-4 text-orange-500" />
        <span>Ofertas que você só vê aqui:</span>
      </h4>

      <div className="space-y-2">
        {bumpOptions.map((bump) => {
          const isSelected = selectedBumps.includes(bump.id);
          return (
            <button
              key={bump.id}
              type="button"
              onClick={() => onToggle(bump.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 border-dashed transition-all ${
                isSelected
                  ? "border-orange-400 bg-orange-50"
                  : "border-orange-200 bg-orange-50/50 hover:border-orange-300"
              }`}
            >
              {/* Checkbox */}
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected
                    ? "border-orange-500 bg-orange-500"
                    : "border-gray-300 bg-white"
                }`}
              >
                {isSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>

              {/* Image */}
              <img
                src={bump.image}
                alt={bump.highlight}
                className="w-12 h-12 rounded-lg object-cover bg-white flex-shrink-0"
              />

              {/* Text */}
              <div className="flex-1 text-left">
                <p className="text-sm text-foreground">
                  {bump.title} <span className="font-bold">{bump.highlight}</span>
                </p>
              </div>

              {/* Price */}
              <span className="font-bold text-sm text-green-600 flex-shrink-0">
                + R$ {bump.price.toFixed(2).replace(".", ",")}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
