import { Star, ThumbsUp, ChevronRight, Play } from "lucide-react";
import { Review } from "@/types/product";
import { useState } from "react";

interface ReviewSectionProps {
  reviews: Review[];
  totalReviews: number;
  averageRating: number;
}

export const ReviewSection = ({ reviews, totalReviews, averageRating }: ReviewSectionProps) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());
  const [clickedReview, setClickedReview] = useState<string | null>(null);
  
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "fill-star text-star" : "text-muted"
        }`}
      />
    ));
  };

  const handleHelpful = (reviewId: string) => {
    setClickedReview(reviewId);
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
    setTimeout(() => setClickedReview(null), 200);
  };

  return (
    <div className="bg-card mt-2">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-star text-star" />
              <span className="text-xl font-bold text-foreground">{averageRating}</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {totalReviews.toLocaleString()} avaliações
            </span>
          </div>
          <button className="flex items-center gap-1 text-sm text-primary font-medium">
            Ver todas <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reviews list */}
      <div className="divide-y divide-border">
        {reviews.map((review) => (
          <div key={review.id} className="p-4">
            <div className="flex items-start gap-3">
              {/* Avatar */}
              {review.avatar ? (
                <img 
                  src={review.avatar} 
                  alt={review.author}
                  className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-semibold text-primary">
                    {review.author.charAt(0)}
                  </span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                {/* Author and rating */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-foreground">{review.author}</span>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>

                {/* Date */}
                <span className="text-xs text-muted-foreground">{review.date}</span>

                {/* Comment */}
                <p className="text-sm text-foreground mt-2">{review.comment}</p>

                {/* Review media (images and video) */}
                {(review.images?.length || review.video) && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {/* Video thumbnail */}
                    {review.video && (
                      <div 
                        className="relative w-20 h-20 rounded-lg overflow-hidden cursor-pointer group bg-muted"
                        onClick={() => setPlayingVideo(playingVideo === review.video ? null : review.video!)}
                      >
                        <video 
                          src={`${review.video}#t=0.1`}
                          className="w-full h-full object-cover"
                          muted
                          playsInline
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                          <Play className="w-6 h-6 text-white fill-white" />
                        </div>
                      </div>
                    )}
                    {/* Images */}
                    {review.images?.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt="Foto da avaliação"
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    ))}
                  </div>
                )}

                {/* Video player */}
                {playingVideo === review.video && review.video && (
                  <div className="mt-3 rounded-lg overflow-hidden">
                    <video 
                      src={review.video}
                      className="w-full max-h-64 object-contain bg-black rounded-lg"
                      controls
                      autoPlay
                      playsInline
                    />
                  </div>
                )}

                {/* Helpful button */}
                <button 
                  onClick={() => handleHelpful(review.id)}
                  className={`flex items-center gap-1 mt-3 text-xs transition-all active:scale-95 ${
                    helpfulReviews.has(review.id) 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  } ${clickedReview === review.id ? "scale-110" : ""}`}
                >
                  <ThumbsUp className={`w-3 h-3 ${helpfulReviews.has(review.id) ? "fill-primary" : ""}`} />
                  {helpfulReviews.has(review.id) ? "Útil!" : "Útil"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
