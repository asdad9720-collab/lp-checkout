import { useState, useEffect, useMemo } from "react";
import { X, Loader2, MapPin } from "lucide-react";
import { CheckoutData, Product, PaymentResponse, OrderItem } from "@/types/product";
import { formatCPF, formatPhone, formatCEP, validateCPF, validatePhone, validateCEP } from "@/utils/validators";
import { useAddressLookup } from "@/hooks/useAddressLookup";
import { ShippingSelector, shippingOptions } from "./checkout/ShippingSelector";
import { OrderBumps, bumpOptions } from "./checkout/OrderBumps";
import { supabase } from "@/integrations/supabase/client";
import { getTrackingParameters } from "@/lib/tracking";

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  quantity?: number;
  onSuccess: (response: PaymentResponse) => void;
}

const initialFormData: CheckoutData = {
  fullName: "",
  cpf: "",
  phone: "",
  cep: "",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export const CheckoutDrawer = ({ isOpen, onClose, product, quantity = 1, onSuccess }: CheckoutDrawerProps) => {
  const [formData, setFormData] = useState<CheckoutData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState(1);
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const { lookupAddress, loading: cepLoading } = useAddressLookup();

  // Calculate totals
  const totals = useMemo(() => {
    const productTotal = product.price * quantity;
    const shippingPrice = shippingOptions.find((s) => s.id === selectedShipping)?.price || 0;
    const bumpsTotal = selectedBumps.reduce((sum, bumpId) => {
      const bump = bumpOptions.find((b) => b.id === bumpId);
      return sum + (bump?.price || 0);
    }, 0);
    const finalTotal = productTotal + shippingPrice + bumpsTotal;

    return {
      product: productTotal,
      shipping: shippingPrice,
      bumps: bumpsTotal,
      total: finalTotal,
    };
  }, [product.price, quantity, selectedShipping, selectedBumps]);

  useEffect(() => {
    if (!isOpen) {
      setFormData(initialFormData);
      setErrors({});
      setSelectedShipping(1);
      setSelectedBumps([]);
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CheckoutData, value: string) => {
    let formattedValue = value;

    if (field === "cpf") formattedValue = formatCPF(value);
    if (field === "phone") formattedValue = formatPhone(value);
    if (field === "cep") formattedValue = formatCEP(value);

    setFormData((prev) => ({ ...prev, [field]: formattedValue }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    if (field === "cep" && formattedValue.replace(/\D/g, "").length === 8) {
      handleCepLookup(formattedValue);
    }
  };

  const handleCepLookup = async (cep: string) => {
    const address = await lookupAddress(cep);
    if (address) {
      setFormData((prev) => ({
        ...prev,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      }));
    }
  };

  const handleBumpToggle = (bumpId: string) => {
    setSelectedBumps((prev) =>
      prev.includes(bumpId) ? prev.filter((id) => id !== bumpId) : [...prev, bumpId]
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutData, string>> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Nome é obrigatório";
    if (!validateCPF(formData.cpf)) newErrors.cpf = "CPF inválido";
    if (!validatePhone(formData.phone)) newErrors.phone = "Telefone inválido";
    if (!validateCEP(formData.cep)) newErrors.cep = "CEP inválido";
    if (!formData.street.trim()) newErrors.street = "Rua é obrigatória";
    if (!formData.number.trim()) newErrors.number = "Número é obrigatório";
    if (!formData.neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório";
    if (!formData.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.state.trim()) newErrors.state = "Estado é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Build bumps array with full data
    const bumpsData = selectedBumps.map((bumpId) => {
      const bump = bumpOptions.find((b) => b.id === bumpId);
      return bump ? {
        id: bump.id,
        name: `${bump.title} ${bump.highlight}`,
        price: bump.price,
      } : null;
    }).filter(Boolean);

    const payload = {
      customer: {
        name: formData.fullName,
        cpf: formData.cpf.replace(/\D/g, ""),
        phone: formData.phone.replace(/\D/g, ""),
        address: {
          cep: formData.cep.replace(/\D/g, ""),
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
      },
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      },
      shipping: {
        optionId: selectedShipping,
        price: totals.shipping,
      },
      bumps: bumpsData,
      total: totals.total,
      trackingParameters: getTrackingParameters(),
    };

    try {
      const { data, error } = await supabase.functions.invoke('create-pix-payment', {
        body: payload,
        headers: { "x-debug-utmify": "1" },
      });

      if (error) {
        throw new Error(error.message || 'Erro ao processar pagamento');
      }

      if (!data?.success) {
        throw new Error(data?.error || 'Erro ao processar pagamento');
      }

      if (data?.utmifyDebug) {
        console.log("[UTMify Debug]", data.utmifyDebug);
      }

      // Build order items array
      const orderItems: OrderItem[] = [
        {
          name: product.name,
          price: product.price / quantity, // Unit price
          quantity,
          image: product.images[0],
        },
      ];

      // Add bump items
      selectedBumps.forEach((bumpId) => {
        const bump = bumpOptions.find((b) => b.id === bumpId);
        if (bump) {
          orderItems.push({
            name: `${bump.title} ${bump.highlight}`,
            price: bump.price,
            quantity: 1,
            image: bump.image,
          });
        }
      });

      const paymentResponse: PaymentResponse = {
        success: true,
        pixPayload: data.pixPayload,
        qrCodeUrl: data.qrCodeUrl,
        orderId: data.orderId,
        orderItems,
        shippingPrice: totals.shipping,
        total: totals.total,
      };

      onSuccess(paymentResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao processar pagamento";
      setErrors({ fullName: errorMessage + ". Tente novamente." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/60 animate-fade-in" onClick={onClose} />

      {/* Drawer */}
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-3xl max-h-[90vh] overflow-hidden animate-slide-up flex flex-col">
        {/* Handle */}
        <div className="flex justify-center py-3 flex-shrink-0">
          <div className="w-12 h-1.5 bg-muted rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 pb-4 border-b border-border flex-shrink-0">
          <h3 className="text-lg font-bold text-foreground">Finalizar Compra</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-secondary transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Form - Scrollable */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Product summary */}
          <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
            <img src={product.images[0]} alt={product.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground">Qtd: {quantity}</p>
              <p className="text-lg font-bold text-primary">{formatCurrency(product.price * quantity)}</p>
            </div>
          </div>

          {/* Personal info */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Dados Pessoais</h4>

            <div>
              <input
                type="text"
                placeholder="Nome Completo"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.fullName ? "ring-2 ring-destructive" : ""
                }`}
              />
              {errors.fullName && <p className="text-xs text-destructive mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="CPF"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange("cpf", e.target.value)}
                  className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.cpf ? "ring-2 ring-destructive" : ""
                  }`}
                />
                {errors.cpf && <p className="text-xs text-destructive mt-1">{errors.cpf}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="WhatsApp"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.phone ? "ring-2 ring-destructive" : ""
                  }`}
                />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Endereço de Entrega
            </h4>

            <div className="relative">
              <input
                type="text"
                placeholder="CEP"
                value={formData.cep}
                onChange={(e) => handleInputChange("cep", e.target.value)}
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.cep ? "ring-2 ring-destructive" : ""
                }`}
              />
              {cepLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-primary" />
              )}
              {errors.cep && <p className="text-xs text-destructive mt-1">{errors.cep}</p>}
            </div>

            <div>
              <input
                type="text"
                placeholder="Rua"
                value={formData.street}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.street ? "ring-2 ring-destructive" : ""
                }`}
              />
              {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  placeholder="Número"
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.number ? "ring-2 ring-destructive" : ""
                  }`}
                />
                {errors.number && <p className="text-xs text-destructive mt-1">{errors.number}</p>}
              </div>
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Complemento"
                  value={formData.complement}
                  onChange={(e) => handleInputChange("complement", e.target.value)}
                  className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <input
                type="text"
                placeholder="Bairro"
                value={formData.neighborhood}
                onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.neighborhood ? "ring-2 ring-destructive" : ""
                }`}
              />
              {errors.neighborhood && <p className="text-xs text-destructive mt-1">{errors.neighborhood}</p>}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <input
                  type="text"
                  placeholder="Cidade"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.city ? "ring-2 ring-destructive" : ""
                  }`}
                />
                {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="UF"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value.toUpperCase())}
                  className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.state ? "ring-2 ring-destructive" : ""
                  }`}
                />
                {errors.state && <p className="text-xs text-destructive mt-1">{errors.state}</p>}
              </div>
            </div>
          </div>

          {/* Shipping Selector */}
          <ShippingSelector selected={selectedShipping} onSelect={setSelectedShipping} />

          {/* Order Bumps */}
          <OrderBumps selectedBumps={selectedBumps} onToggle={handleBumpToggle} />
        </div>

        {/* Sticky Footer */}
        <div className="p-4 border-t border-border bg-card flex-shrink-0">
          {/* Totals Summary */}
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
            <span>
              Frete: {totals.shipping === 0 ? "Grátis" : formatCurrency(totals.shipping)}
              {totals.bumps > 0 && ` | Adicionais: ${formatCurrency(totals.bumps)}`}
            </span>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-foreground">Total:</span>
            <span className="text-2xl font-bold text-primary">{formatCurrency(totals.total)}</span>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleCheckout}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-400 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] text-lg h-14"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando seu Pix...
              </>
            ) : (
              "🔒 FINALIZAR COMPRA AGORA"
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-1 text-muted-foreground">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span className="text-xs">Compra Segura</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <span className="text-xs">Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
