import { useState, useEffect } from "react";
import { Copy, Check, Clock, Shield, ChevronDown, ChevronUp } from "lucide-react";
import { PaymentResponse } from "@/types/product";
import techshopLogo from "@/assets/techshop-logo.jpg";

interface SuccessPageProps {
  paymentData: PaymentResponse;
  onNewOrder: () => void;
}

const paymentSteps = [
  "Clique em copiar o código PIX, logo abaixo",
  "Acesse o app do seu banco",
  "Vá até a opção PIX",
  "Escolha a opção 'COPIA E COLA'",
  "Insira o código copiado e finalize seu pagamento",
];

export const SuccessPage = ({ paymentData, onNewOrder }: SuccessPageProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopyPix = async () => {
    if (paymentData.pixPayload) {
      await navigator.clipboard.writeText(paymentData.pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logo */}
      <header className="bg-card border-b border-border py-4 px-4">
        <div className="max-w-md mx-auto flex items-center justify-center">
          <img 
            src={techshopLogo} 
            alt="TechShop" 
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="ml-2 font-bold text-foreground">TechShop</span>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 pb-24">
        {/* Title section */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Já é quase seu...
          </h1>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4 text-destructive flex-shrink-0" />
            <span>Pague seu pix dentro de</span>
            <span className="font-bold text-destructive text-lg tabular-nums">{formatTime(timeLeft)}</span>
            <span>para garantir sua compra.</span>
          </div>
        </div>

        {/* QR Code section */}
        <div className="bg-card rounded-2xl p-6 shadow-lg mb-4 animate-fade-in">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Aponte a câmera do seu celular
          </p>
          
          <div className="flex justify-center mb-4">
            {paymentData.qrCodeUrl ? (
              <img
                src={paymentData.qrCodeUrl}
                alt="QR Code Pix"
                className="w-52 h-52 bg-white rounded-lg p-2"
              />
            ) : (
              <div className="w-52 h-52 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Carregando QR Code...</span>
              </div>
            )}
          </div>

          <div className="bg-success/10 text-success text-center py-2 rounded-lg text-sm font-medium mb-4">
            Aguardando pagamento ...
          </div>

          {/* Pix code preview */}
          {paymentData.pixPayload && (
            <div className="bg-secondary rounded-xl p-3 mb-4">
              <p className="text-xs text-muted-foreground font-mono break-all text-center">
                {paymentData.pixPayload.length > 60 
                  ? `${paymentData.pixPayload.slice(0, 60)}...` 
                  : paymentData.pixPayload}
              </p>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopyPix}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl transition-all active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5" />
                Código Copiado!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copiar código pix
              </>
            )}
          </button>
        </div>

        {/* Total value */}
        <div className="bg-success/10 border border-success/30 rounded-xl p-4 mb-4 text-center animate-fade-in">
          <p className="text-foreground">
            Valor do Pix:{" "}
            <span className="font-bold text-success text-lg">
              {formatCurrency(paymentData.total || 0)}
            </span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            <Shield className="w-3 h-3 inline mr-1" />
            Pagamento processado de forma segura
          </p>
        </div>

        {/* Order items (collapsible) */}
        {paymentData.orderItems && paymentData.orderItems.length > 0 && (
          <div className="bg-card rounded-xl border border-border mb-4 overflow-hidden animate-fade-in">
            <button
              onClick={() => setShowItems(!showItems)}
              className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
            >
              <span className="font-semibold text-foreground">
                Itens do pedido ({paymentData.orderItems.length})
              </span>
              {showItems ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
            
            {showItems && (
              <div className="border-t border-border p-4 space-y-3">
                {paymentData.orderItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
                {paymentData.shippingPrice !== undefined && paymentData.shippingPrice > 0 && (
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span className="text-sm text-muted-foreground">Frete</span>
                    <span className="font-medium text-foreground">
                      {formatCurrency(paymentData.shippingPrice)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Payment instructions */}
        <div className="bg-card rounded-xl p-4 mb-6 animate-fade-in">
          <h3 className="font-semibold text-foreground mb-4">Como pagar o pix:</h3>
          <div className="space-y-3">
            {paymentSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-muted-foreground pt-0.5">
                  {index === 0 || index === 2 || index === 3 ? (
                    <>
                      {step.split("PIX")[0]}
                      {step.includes("PIX") && <span className="text-primary font-semibold">PIX</span>}
                      {step.split("PIX")[1]}
                    </>
                  ) : (
                    step
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* New order button */}
        <button
          onClick={onNewOrder}
          className="w-full text-center text-primary font-medium hover:underline py-2"
        >
          Fazer novo pedido
        </button>
      </main>
    </div>
  );
};
