import { useState } from "react";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { Header } from "@/components/Header";
import { ProductCarousel } from "@/components/ProductCarousel";
import { PriceSection } from "@/components/PriceSection";
import { DescriptionAccordion } from "@/components/DescriptionAccordion";
import { QuantitySelector } from "@/components/QuantitySelector";
import { ReviewSection } from "@/components/ReviewSection";
import { TrustFooter } from "@/components/TrustFooter";
import { OfficialStoreBadge } from "@/components/OfficialStoreBadge";
import { StickyBuyButton } from "@/components/StickyBuyButton";
import { CheckoutDrawer } from "@/components/CheckoutDrawer";
import { SuccessPage } from "@/components/SuccessPage";
import { product, reviews } from "@/data/product";
import { PaymentResponse } from "@/types/product";

const Index = () => {
  const [quantity, setQuantity] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<PaymentResponse | null>(null);

  const handleCheckoutSuccess = (response: PaymentResponse) => {
    setIsCheckoutOpen(false);
    setPaymentResponse(response);
  };

  const handleNewOrder = () => {
    setPaymentResponse(null);
    setQuantity(1);
  };

  // Show success page after payment
  if (paymentResponse?.success) {
    return (
      <SuccessPage
        paymentData={paymentResponse}
        onNewOrder={handleNewOrder}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Urgency Banner - Fixed at very top */}
      <UrgencyBanner />
      
      <Header cartCount={quantity} onCartClick={() => setIsCheckoutOpen(true)} />
      
      <main className="pb-24">
        <ProductCarousel images={product.images} />
        <PriceSection product={product} />
        <DescriptionAccordion />
        <QuantitySelector 
          quantity={quantity} 
          onQuantityChange={setQuantity} 
        />
        <div className="animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <ReviewSection
            reviews={reviews}
            totalReviews={product.reviewCount}
            averageRating={product.rating}
          />
        </div>
        <OfficialStoreBadge />
        <TrustFooter />
      </main>

      <StickyBuyButton
        price={product.price}
        quantity={quantity}
        onClick={() => setIsCheckoutOpen(true)}
      />

      <CheckoutDrawer
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={{ ...product, price: product.price * quantity }}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};

export default Index;
