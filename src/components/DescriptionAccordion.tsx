import { useState } from "react";
import { ChevronDown, ChevronUp, Droplets, Battery, Shield, RotateCcw, Sparkles } from "lucide-react";

export const DescriptionAccordion = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card p-4 mt-2">
      <h3 className="font-bold text-foreground mb-3">
        Barbeador Pro 4D - À Prova D'Água e Sem Fio
      </h3>
      
      <div className="relative">
        <div 
          className={`overflow-hidden transition-all duration-300 ease-out ${
            isExpanded ? "max-h-[500px]" : "max-h-[120px]"
          }`}
        >
          <p className="text-sm text-muted-foreground mb-4">
            Cansado de irritações e cortes? O <span className="font-semibold text-foreground">Barbeador Pro 4D</span> é a solução definitiva para um barbear rente e confortável.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Droplets className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">100% À Prova D'Água (IPX7)</p>
                <p className="text-xs text-muted-foreground">Use no banho, a seco ou com espuma.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Battery className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Bateria Longa Duração</p>
                <p className="text-xs text-muted-foreground">60 minutos de uso contínuo com carga USB rápida.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Lâminas Hipoalergênicas</p>
                <p className="text-xs text-muted-foreground">Tecnologia anti-irritação ideal para peles sensíveis.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Cabeça 3D Flexível</p>
                <p className="text-xs text-muted-foreground">Adapta-se perfeitamente aos contornos do rosto e pescoço.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Limpeza Fácil</p>
                <p className="text-xs text-muted-foreground">Cabeça removível e lavável.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Fade gradient overlay */}
        {!isExpanded && (
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-card to-transparent pointer-events-none" />
        )}
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-sm text-primary font-medium hover:bg-primary/5 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <>
            Ver menos <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            Ver descrição completa <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
};
