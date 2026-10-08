import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import ZoomImage from "@/components/ZoomImage";
import { cn } from "@/lib/utils";
import { getUnsplashImageUrl } from "@/lib/unsplash";

export default function ProductCard({ product, index = 0 }) {
  const { addItem, toggleWishlist, isWishlisted } = useCart();
  const { format } = useCurrency();
  const wished = isWishlisted(product.id);

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.image || getUnsplashImageUrl(product.imageLabel)];

  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const hasSwipedRef = useRef(false);

  const prevPhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPhotoIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const nextPhoto = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setPhotoIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const handleTouchStart = (e) => {
    hasSwipedRef.current = false;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = touchStartX.current - e.changedTouches[0].clientX;
    const diffY = touchStartY.current - e.changedTouches[0].clientY;
    
    // Only trigger if horizontal swipe is dominant and exceeds threshold
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      hasSwipedRef.current = true;
      if (diffX > 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1], delay: (index % 3) * 0.08 }}
      className="group"
    >
      <div 
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Link 
          to={`/shop/${product.slug}`} 
          aria-label={product.name}
          onClick={(e) => {
            if (hasSwipedRef.current) {
              e.preventDefault();
              hasSwipedRef.current = false;
            }
          }}
        >
          <ZoomImage
            src={images[photoIndex]}
            label={`${product.name} angle ${photoIndex + 1}`}
            alt={product.name}
            aspect="aspect-[4/5]"
            zoom={1.08}
            duration={0.8}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zen-espresso/50 via-transparent to-transparent opacity-60 transition-opacity duration-700 group-hover:opacity-80" />
        </Link>

        {/* Swipe / Next & Prev Buttons */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-zen-paper/90 text-zen-charcoal backdrop-blur-xs opacity-75 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-zen-charcoal hover:text-zen-paper transition-all duration-300 min-h-[36px] min-w-[36px] z-20 shadow-xs"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-zen-paper/90 text-zen-charcoal backdrop-blur-xs opacity-75 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-zen-charcoal hover:text-zen-paper transition-all duration-300 min-h-[36px] min-w-[36px] z-20 shadow-xs"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>

            {/* Photo indicators dots */}
            <div className="absolute bottom-3 right-3 flex items-center gap-1.5 z-20">
              {images.map((_, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setPhotoIndex(i);
                  }}
                  aria-label={`Photo ${i + 1}`}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    photoIndex === i ? "w-4 bg-zen-paper" : "w-1.5 bg-zen-paper/50 hover:bg-zen-paper/80"
                  )}
                />
              ))}
            </div>
          </>
        )}

        <button
          onClick={() => toggleWishlist(product.id)}
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          className={cn(
            "absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-zen-paper/85 backdrop-blur-sm transition-colors z-10 min-h-[36px] min-w-[36px]",
            wished ? "text-red-700" : "text-zen-charcoal hover:text-zen-clay"
          )}
        >
          <Heart className="h-4 w-4" strokeWidth={1.25} fill={wished ? "currentColor" : "none"} />
        </button>

        <button
          onClick={() => addItem(product)}
          className="absolute bottom-3 left-3 flex items-center gap-2 bg-zen-paper/90 px-3 py-2 text-xs uppercase tracking-[0.2em] text-zen-charcoal backdrop-blur-sm transition-all duration-700 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-zen-charcoal hover:text-zen-paper z-10 min-h-[36px]"
        >
          <Plus className="h-3.5 w-3.5" strokeWidth={1.5} /> Add
        </button>
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="label-eyebrow">{product.origin} · {product.roast}</p>
          <Link to={`/shop/${product.slug}`}>
            <h3 className="mt-2 font-heading text-xl leading-tight text-zen-charcoal link-underline w-fit">{product.name}</h3>
          </Link>
          <p className="mt-1 font-jp text-xs tracking-widest text-zen-muted">{product.jp}</p>
          <p className="mt-2 text-sm text-zen-muted">{product.tastingNotes.join(" · ")}</p>
        </div>
        <div className="text-right">
          <p className="font-heading text-lg">{format(product.price)}</p>
          <p className="text-xs text-zen-muted">{product.weight}</p>
        </div>
      </div>
    </motion.article>
  );
}