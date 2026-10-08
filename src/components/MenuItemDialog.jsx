import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { X, Star, AlertCircle } from "lucide-react";
import MenuImage from "@/components/MenuImage";
import { dietaryIcons, getAvailabilityInfo } from "@/data/menu";
import { useCurrency } from "@/context/CurrencyContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function MenuItemDialog({ item, isOpen, onClose }) {
  const { format } = useCurrency();
  const reduce = useReducedMotion();
  const dialogRef = useRef(null);
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Close on Escape key & focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset reviews toggle when item changes
  useEffect(() => {
    setShowAllReviews(false);
  }, [item]);

  if (!isOpen || !item) return null;

  const availability = getAvailabilityInfo(item.available);
  const displayedReviews = showAllReviews ? item.reviews : item.reviews.slice(0, 3);

  // Calculate rating distribution
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  item.reviews.forEach((r) => {
    const star = Math.min(5, Math.max(1, Math.round(r.rating)));
    ratingCounts[star] = (ratingCounts[star] || 0) + 1;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 bg-zen-espresso/60 backdrop-blur-xs"
          aria-hidden="true"
        />

        {/* Modal Dialog (Bottom sheet on mobile, centered modal on desktop) */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={item.name}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl max-h-[92vh] sm:max-h-[88vh] flex flex-col rounded-t-2xl sm:rounded-2xl border border-zen-hairline bg-zen-paper paper-grain shadow-2xl overflow-hidden mt-auto sm:mt-0"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-zen-hairline/60 bg-zen-surface/60 px-5 py-3.5 backdrop-blur-xs shrink-0">
            <div className="flex items-center gap-2">
              <span className="label-eyebrow text-zen-clay text-[10px]">
                {item.category}
              </span>
              {item.isSignature && (
                <span className="rounded-full bg-zen-charcoal px-2 py-0.5 text-[9px] uppercase tracking-wider text-zen-paper font-medium">
                  Signature Dish
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close dish details"
              className="flex h-8 w-8 items-center justify-center rounded-full text-zen-muted hover:bg-zen-surface hover:text-zen-charcoal transition-colors min-h-[36px] min-w-[36px]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-8 space-y-6">
            {/* Top Grid: Image + Core Info */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              <div className="sm:col-span-5">
                <MenuImage
                  src={item.image.src}
                  alt={item.image.alt}
                  name={item.name}
                  japaneseName={item.japaneseName}
                  category={item.category}
                  aspect="aspect-[4/5]"
                  className="rounded-xl border border-zen-hairline/60 shadow-xs"
                />
              </div>

              <div className="sm:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="font-heading text-2xl sm:text-3xl font-medium text-zen-charcoal">
                      {item.name}
                    </h3>
                    <span className="font-heading text-2xl text-zen-charcoal shrink-0">
                      {format(item.price)}
                    </span>
                  </div>
                  {item.japaneseName && (
                    <p className="font-jp text-sm tracking-[0.2em] text-zen-muted mt-1">
                      {item.japaneseName}
                    </p>
                  )}

                  {/* Rating + Availability */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs">
                    <div
                      className="flex items-center gap-1.5"
                      aria-label={`Rated ${item.rating} out of 5 from ${item.reviewsCount} reviews`}
                    >
                      <div className="flex items-center text-amber-700">
                        <Star className="h-3.5 w-3.5 fill-current" />
                      </div>
                      <span className="font-medium text-zen-charcoal">{item.rating}</span>
                      <span className="text-zen-muted">({item.reviewsCount} reviews)</span>
                    </div>

                    <span className="text-zen-hairline">·</span>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          availability.isAvailable ? "bg-zen-sage" : "bg-zen-muted"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          availability.isAvailable ? "text-zen-sage" : "text-zen-muted"
                        )}
                      >
                        {availability.label}
                      </span>
                    </div>
                  </div>

                  <p className="mt-4 text-sm text-zen-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Dietary Badges */}
                {item.dietary?.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 pt-4 border-t border-zen-hairline/40">
                    {item.dietary.map((d) => {
                      const icon = dietaryIcons[d];
                      return (
                        <span
                          key={d}
                          className="flex items-center gap-1 rounded-sm border border-zen-hairline px-2 py-0.5 text-[10px] uppercase tracking-wider text-zen-charcoal font-medium"
                        >
                          {icon && (
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: icon.color }}
                            />
                          )}
                          {icon?.label || d}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Ingredients & Allergens Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-5 border-t border-zen-hairline">
              <div>
                <h4 className="label-eyebrow text-zen-charcoal text-[11px] mb-2.5">
                  Ingredients
                </h4>
                <ul className="space-y-1 text-xs text-zen-muted">
                  {item.ingredients.map((ing, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="h-1 w-1 rounded-full bg-zen-clay" />
                      <span>{ing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="label-eyebrow text-zen-charcoal text-[11px] mb-2.5">
                  Allergen Advisory
                </h4>
                {item.allergens.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.allergens.map((alg, idx) => (
                      <span
                        key={idx}
                        className="rounded-sm bg-zen-surface px-2 py-0.5 text-[10px] uppercase font-medium tracking-wide text-zen-charcoal border border-zen-hairline/50"
                      >
                        Contains {alg}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zen-muted mb-2">No common allergens.</p>
                )}
                <p className="flex items-center gap-1 text-[11px] text-zen-muted/80 italic">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  Allergen info is for demo purposes only.
                </p>
              </div>
            </div>

            {/* Rating Breakdown */}
            <div className="pt-5 border-t border-zen-hairline">
              <div className="flex items-center justify-between mb-4">
                <h4 className="label-eyebrow text-zen-charcoal text-[11px]">
                  Customer Reviews
                </h4>
                <span className="text-xs text-zen-muted italic">
                  Sample reviews for demo purposes
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-zen-surface/40 p-4 rounded-xl border border-zen-hairline/40">
                <div className="sm:col-span-4 text-center border-b sm:border-b-0 sm:border-r border-zen-hairline/60 pb-3 sm:pb-0 sm:pr-4">
                  <div className="font-heading text-4xl font-medium text-zen-charcoal">
                    {item.rating}
                  </div>
                  <div className="flex items-center justify-center gap-0.5 text-amber-700 my-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={cn(
                          "h-3.5 w-3.5",
                          star <= Math.round(item.rating)
                            ? "fill-current"
                            : "text-zen-hairline"
                        )}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-zen-muted">
                    Based on {item.reviewsCount} guest reviews
                  </p>
                </div>

                {/* Rating bars */}
                <div className="sm:col-span-8 space-y-1.5 text-xs">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingCounts[stars] || 0;
                    const percent =
                      item.reviews.length > 0 ? (count / item.reviews.length) * 100 : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2 text-zen-muted">
                        <span className="w-6 text-[11px] text-right">{stars}★</span>
                        <div className="flex-1 h-1.5 rounded-full bg-zen-hairline/50 overflow-hidden">
                          <div
                            className="h-full bg-zen-clay rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="w-5 text-[10px] text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Reviews List */}
              <div className="mt-5 space-y-3.5">
                {displayedReviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-lg border border-zen-hairline/60 bg-zen-paper"
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-zen-charcoal">
                        {rev.author}
                      </span>
                      <span className="text-[11px] text-zen-muted">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-amber-700 mb-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={cn(
                            "h-3 w-3",
                            s <= rev.rating ? "fill-current" : "text-zen-hairline"
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-zen-muted leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}

                {item.reviews.length > 3 && (
                  <button
                    type="button"
                    onClick={() => setShowAllReviews((prev) => !prev)}
                    className="w-full text-center py-2 text-xs text-zen-charcoal hover:underline min-h-[36px]"
                  >
                    {showAllReviews
                      ? "Show less reviews"
                      : `Show all ${item.reviews.length} reviews`}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="border-t border-zen-hairline/60 bg-zen-surface/40 p-4 px-6 flex items-center justify-between shrink-0">
            <Link
              to="/reservations"
              className="text-xs uppercase tracking-[0.14em] text-zen-charcoal hover:text-zen-clay transition-colors"
            >
              Reserve a table for this dish →
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm bg-zen-charcoal px-5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-zen-paper hover:bg-zen-espresso transition-colors min-h-[36px]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
