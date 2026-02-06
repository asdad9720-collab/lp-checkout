import { ShieldCheck, Clock } from "lucide-react";
import techshopLogo from "@/assets/techshop-logo.jpg";

// Instagram-style verified badge
const VerifiedBadge = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" fill="#1DA1F2" />
    <path
      d="M9 12l2 2 4-4"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OfficialStoreBadge = () => {
  return (
    <div className="bg-card border-y border-border py-6 px-4">
      <div className="flex items-center gap-4">
        {/* Logo como avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary shadow-lg">
            <img
              src={techshopLogo}
              alt="TechShop Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Badge de verificado estilo Instagram */}
          <div className="absolute -bottom-0.5 -right-0.5">
            <VerifiedBadge className="w-6 h-6 drop-shadow-md" />
          </div>
        </div>

        {/* Informações da loja */}
        <div className="flex-1">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-foreground">TechShop</h3>
            <VerifiedBadge className="w-4 h-4" />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Último login há 3 minutos
          </p>
          
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <div className="flex items-center gap-1 bg-success/10 text-success px-2 py-1 rounded-full">
              <ShieldCheck className="w-3 h-3" />
              <span className="text-[10px] font-medium">Loja Segura</span>
            </div>
            <div className="flex items-center gap-1 bg-[#1DA1F2]/10 text-[#1DA1F2] px-2 py-1 rounded-full">
              <VerifiedBadge className="w-3 h-3" />
              <span className="text-[10px] font-medium">Verificada</span>
            </div>
            <div className="flex items-center gap-1 bg-secondary text-muted-foreground px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              <span className="text-[10px] font-medium">Responde Rápido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
