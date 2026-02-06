import { Lock, MapPin, Mail } from "lucide-react";
import pixLogo from "@/assets/pix-logo.png";

export const TrustFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 mt-2 pb-28">
      {/* Main footer content */}
      <div className="p-4 border-b border-border">
        <div className="grid grid-cols-2 gap-6">
          {/* Endereço */}
          <div>
            <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              Endereço
            </h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Avenida Helena Rosa de Morais<br />
              Bairro Alcides Junqueira<br />
              Ituiutaba, MG<br />
              CEP: 38304-082<br />
              CNPJ: 72.261.957/0001-00
            </p>
          </div>

          {/* Contato + Segurança */}
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1">
                <Mail className="w-3 h-3" />
                Contato
              </h4>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                contato@techshop.com.br<br />
                +55 (11) 99999-9999
              </p>
            </div>
            
            {/* Pagamento Seguro */}
            <div className="flex items-center gap-2 bg-card px-3 py-2 rounded-lg border border-border">
              <Lock className="w-5 h-5 text-success" />
              <div>
                <p className="text-xs font-bold text-foreground">PAGAMENTO</p>
                <p className="text-[10px] text-success font-medium">100% SEGURO</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment methods */}
      <div className="p-4 border-b border-border">
        <p className="text-xs text-muted-foreground text-center mb-3">Formas de pagamento</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {/* Pix */}
          <div className="bg-card px-2 py-1 rounded border border-border">
            <img src={pixLogo} alt="PIX" className="h-5 w-auto object-contain" />
          </div>
          {/* Visa */}
          <div className="bg-card px-2 py-1.5 rounded border border-border">
            <svg className="h-4 w-8" viewBox="0 0 48 16" fill="none">
              <path d="M17.545 15.296L19.818 1.296H23.455L21.182 15.296H17.545Z" fill="#1434CB"/>
              <path d="M33.818 1.632C33.091 1.344 31.909 1.008 30.455 1.008C26.909 1.008 24.455 2.832 24.455 5.424C24.409 7.392 26.227 8.496 27.591 9.168C29 9.84 29.455 10.32 29.455 10.944C29.455 11.904 28.318 12.336 27.227 12.336C25.727 12.336 24.909 12.096 23.636 11.52L23.136 11.28L22.591 14.832C23.545 15.264 25.227 15.648 27 15.648C30.773 15.648 33.182 13.824 33.227 11.088C33.227 9.504 32.227 8.304 30.136 7.296C28.864 6.672 28.091 6.24 28.091 5.568C28.136 4.944 28.818 4.32 30.364 4.32C31.591 4.272 32.545 4.56 33.227 4.848L33.545 5.04L34.091 1.632H33.818Z" fill="#1434CB"/>
              <path d="M39.455 1.296C38.591 1.296 37.909 1.536 37.5 2.4L32.182 15.296H35.955L36.727 12.912H41.318L41.773 15.296H45.091L42.227 1.296H39.455ZM37.727 10.176C37.727 10.176 38.909 6.96 39.182 6.24L39.545 4.272C39.545 4.272 40.091 6.576 40.364 7.776L40.909 10.176H37.727Z" fill="#1434CB"/>
              <path d="M14.727 1.296L11.227 10.8L10.818 8.88C10.136 6.672 8.091 4.272 5.818 3.072L9.045 15.248H12.864L18.545 1.296H14.727Z" fill="#1434CB"/>
              <path d="M8.182 1.296H2.455L2.409 1.584C6.909 2.736 9.909 5.424 10.818 8.88L9.864 2.448C9.682 1.584 9 1.344 8.182 1.296Z" fill="#F9A533"/>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="bg-card px-2 py-1.5 rounded border border-border">
            <svg className="h-4 w-8" viewBox="0 0 48 30" fill="none">
              <circle cx="18" cy="15" r="11" fill="#EB001B"/>
              <circle cx="30" cy="15" r="11" fill="#F79E1B"/>
              <path d="M24 6.67C26.74 8.79 28.5 12.18 28.5 16C28.5 19.82 26.74 23.21 24 25.33C21.26 23.21 19.5 19.82 19.5 16C19.5 12.18 21.26 8.79 24 6.67Z" fill="#FF5F00"/>
            </svg>
          </div>
          {/* Elo */}
          <div className="bg-card px-3 py-1.5 rounded border border-border">
            <span className="text-[10px] font-bold text-foreground">elo</span>
          </div>
          {/* Boleto */}
          <div className="bg-card px-3 py-1.5 rounded border border-border">
            <span className="text-[10px] font-bold text-muted-foreground">Boleto</span>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="p-4 border-b border-border">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Termos de Uso
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Política de Privacidade
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Contato
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Rastrear Pedido
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          TechShop | Todos os direitos reservados
        </p>
      </div>
    </footer>
  );
};
