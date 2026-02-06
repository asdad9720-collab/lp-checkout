import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  images: string[];
}

export const ProductCarousel = ({ images }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else if (diff < 0 && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    }
  };

  const goTo = (index: number) => setCurrentIndex(index);
  const goPrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);
  const goNext = () => currentIndex < images.length - 1 && setCurrentIndex(currentIndex + 1);

  return (
    <div className="relative bg-card overflow-hidden">
      <div
        className="flex transition-transform duration-300 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.map((image, index) => (
          <div key={index} className="w-full flex-shrink-0 aspect-square">
            <img
              src={image}
              alt={`Produto ${index + 1}`}
              className="w-full h-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>

      {/* Navigation arrows - hidden on mobile */}
      <button
        onClick={goPrev}
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 rounded-full items-center justify-center shadow-lg hover:bg-card transition-colors disabled:opacity-50"
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </button>
      <button
        onClick={goNext}
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/90 rounded-full items-center justify-center shadow-lg hover:bg-card transition-colors disabled:opacity-50"
        disabled={currentIndex === images.length - 1}
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goTo(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-6 bg-primary"
                : "bg-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
