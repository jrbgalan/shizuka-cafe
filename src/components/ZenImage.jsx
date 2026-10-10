import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { getUnsplashImageUrl } from "@/lib/unsplash";
import JapanesePhotoFrame from "@/components/JapanesePhotoFrame";

// A tranquil, high-resolution image component powered by Unsplash.
// Automatically matches labels and alts to curated Japanese/Korean café imagery.
// Preserves layout with aspect ratio containers and displays immediately without opacity delays.

export default function ZenImage({
  src,
  alt,
  label,
  className,
  frameClassName,
  aspect = "aspect-[4/5]",
  overlay = false,
  caption = false,
  priority = false,
  framed = false,
  showCorners = true,
  showShine = true,
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
    } else {
      setIsLoaded(false);
    }
  }, [src, resolvedSrc]);

  const handleError = () => {
    // If remote fails, fallback to matched Unsplash URL
    if (!hasFailed) {
      setHasFailed(true);
      setCurrentSrc(getUnsplashImageUrl(text));
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const content = (
    <div
      className={cn(
        "relative overflow-hidden bg-zen-surface paper-grain select-none transition-colors duration-500",
        aspect,
        className
      )}
    >
      <img
        ref={imgRef}
        src={currentSrc}
        alt={alt || text}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "h-full w-full object-cover transition-all duration-700 ease-zen",
          // Micro-smooth reveal: no abrupt pops, immediate paint if cached
          isLoaded ? "opacity-100 scale-100" : "opacity-90 scale-[1.01] blur-2xs"
        )}
      />

      {/* Gentle placeholder watermark while loading or offline */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-zen-surface/40 pointer-events-none">
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

  if (framed) {
    return (
      <JapanesePhotoFrame
        aspect={aspect}
        className={frameClassName}
        showCorners={showCorners}
        showShine={showShine}
      >
        {content}
      </JapanesePhotoFrame>
    );
  }

  return content;
}