import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getUnsplashImageUrl } from "@/lib/unsplash";

// A tranquil, high-resolution image component powered by Unsplash.
// Automatically matches labels and alts to curated Japanese/Korean café imagery.
// Preserves layout with aspect ratio containers and displays immediately without opacity delays.

export default function ZenImage({
  src,
  alt,
  label,
  className,
  aspect = "aspect-[4/5]",
  overlay = false,
  caption = false,
  priority = false
}) {
  const text = label || alt || "coffee";
  
  // Resolve image source: remote URL or match from Unsplash
  const resolvedSrc = (src && !src.startsWith("/images/"))
    ? src
    : getUnsplashImageUrl(text);

  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);
  const [hasFailed, setHasFailed] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);

  // Sync state whenever the src or resolvedSrc changes (carousel, swipe, navigation)
  useEffect(() => {
    setCurrentSrc(resolvedSrc);
    setHasFailed(false);
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [resolvedSrc]);

  const handleError = () => {
    if (!hasFailed) {
      setHasFailed(true);
      // Safe fallback to general coffee unsplash image
      setCurrentSrc("https://images.unsplash.com/photo-1559484379-68a6d9c90c73?auto=format&fit=crop&w=1200&q=85");
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={cn("relative overflow-hidden bg-zen-surface paper-grain", aspect, className)}>
      <img
        ref={(el) => {
          imgRef.current = el;
          if (el && el.complete && el.naturalWidth > 0 && !isLoaded) {
            setIsLoaded(true);
          }
        }}
        key={currentSrc}
        src={currentSrc}
        alt={alt || text}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className="h-full w-full object-cover transition-opacity duration-300 opacity-100 block"
      />

      {/* Gentle placeholder ensō ring visible only while image is downloading */}
      {!isLoaded && !hasFailed && (
        <div className="absolute inset-0 flex items-center justify-center bg-zen-surface/40 pointer-events-none transition-opacity duration-300">
          <svg
            viewBox="0 0 100 100"
            className="h-10 w-10 text-zen-charcoal/15 animate-pulse"
            aria-hidden="true"
          >
            <circle cx="50" cy="52" r="34" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeDasharray="205 30" />
          </svg>
        </div>
      )}

      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-zen-espresso/75 via-zen-espresso/15 to-transparent pointer-events-none" />
      )}

      {caption && (
        <span className="absolute bottom-3 left-3 label-eyebrow text-zen-paper/95 bg-zen-espresso/60 px-2.5 py-1 backdrop-blur-xs rounded-xs">
          {text}
        </span>
      )}
    </div>
  );
}