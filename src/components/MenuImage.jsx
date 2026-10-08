import React, { useState } from "react";
import { cn } from "@/lib/utils";

/**
 * MenuImage Component
 * Displays dish photography if available at /images/menu/<slug>.webp,
 * with a graceful, serene Japanese-styled art fallback if image file is not present.
 */
export default function MenuImage({
  src,
  alt,
  name,
  japaneseName,
  category,
  aspect = "aspect-[4/5]",
  className,
  priority = false
}) {
  const [hasError, setHasError] = useState(false);

  // If image fails or no src provided, render graceful zen fallback
  if (hasError || !src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden bg-zen-surface paper-grain flex flex-col justify-between p-6 select-none border border-zen-hairline/40 transition-all duration-500",
          aspect,
          className
        )}
      >
        {/* Subtle Ensō / Tea bowl background watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-8 pointer-events-none">
          <svg viewBox="0 0 100 100" className="h-32 w-32 text-zen-charcoal">
            <circle
              cx="50"
              cy="52"
              r="34"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray="205 30"
            />
          </svg>
        </div>

        {/* Top: Category watermark */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="label-eyebrow text-zen-clay text-[10px]">
            {category}
          </span>
          <span className="font-jp text-[10px] text-zen-muted tracking-widest">
            静か 喫茶
          </span>
        </div>

        {/* Center: Dish Name in Cormorant Garamond Serif */}
        <div className="relative z-10 text-center my-auto px-2">
          <h4 className="font-heading text-xl sm:text-2xl text-zen-charcoal tracking-wide leading-snug">
            {name}
          </h4>
          {japaneseName && (
            <p className="font-jp text-xs text-zen-muted tracking-widest mt-2">
              {japaneseName}
            </p>
          )}
        </div>

        {/* Bottom: Subtle craft accent */}
        <div className="relative z-10 flex items-center justify-center gap-2 pt-2 border-t border-zen-hairline/30">
          <span className="h-0.5 w-6 bg-zen-clay/40" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-zen-muted">
            Shizuka Craft
          </span>
          <span className="h-0.5 w-6 bg-zen-clay/40" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-zen-surface", aspect, className)}>
      <img
        src={src}
        alt={alt || name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

