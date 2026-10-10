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

  // If image fails or no src provided, render graceful zen craft fallback
  if (hasError || !src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-xl bg-zen-surface paper-grain flex flex-col justify-between p-5 select-none h-full w-full",
          aspect,
          className
        )}
      >
        {/* Traditional Japanese Washi Inset Border */}
        <div className="absolute inset-2 rounded-lg border border-dashed border-[#c5a059]/40 pointer-events-none" />

        {/* Top: Category watermark & Traditional Hanko Seal */}
        <div className="relative z-10 flex justify-between items-center">
          <span className="label-eyebrow text-zen-clay text-[10px]">
            {category}
          </span>
          <span className="inline-flex items-center justify-center border border-[#A8322D]/60 bg-[#A8322D]/10 text-[#A8322D] text-[9px] font-jp px-1.5 py-0.5 rounded-xs tracking-wider select-none shadow-2xs">
            静か
          </span>
        </div>

        {/* Center: Dish Name in Cormorant Garamond Serif */}
        <div className="relative z-10 text-center my-auto px-3">
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
        <div className="relative z-10 flex items-center justify-center gap-2 pt-2 border-t border-zen-hairline/40">
          <span className="h-px w-5 bg-zen-clay/60" />
          <span className="text-[9px] uppercase tracking-[0.25em] text-zen-muted font-medium">
            Shizuka Craft
          </span>
          <span className="h-px w-5 bg-zen-clay/60" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl bg-zen-surface/60",
        aspect,
        className
      )}
    >
      <img
        src={src}
        alt={alt || name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setHasError(true)}
        className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
      />
      {/* Subtle craft hairline edge */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/8 pointer-events-none" />
    </div>
  );
}

