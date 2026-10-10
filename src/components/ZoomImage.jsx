import React, { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ZenImage from "@/components/ZenImage";
import JapanesePhotoFrame from "@/components/JapanesePhotoFrame";
import { cn } from "@/lib/utils";

// Reusable hover-zoom image frame with authentic Japanese gold border & scroll shine.
// Mouse: zooms on hover. Touch: zooms when entering viewport.
// Frame stays fixed; only the inner image scales. Respects reduced motion.
export default function ZoomImage({
  src,
  alt,
  label,
  children,
  aspect = "aspect-[4/5]",
  overlay = false,
  className,
  frameClassName,
  zoom = 1.12,
  duration = 0.9,
  priority = false,
  framed = true,
  showCorners = true,
  showShine = true,
}) {
  const reduce = useReducedMotion();
  const [isTouch] = useState(
    () =>
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0)
  );

  const inner = children || (
    <ZenImage
      src={src}
      alt={alt}
      label={label}
      aspect="h-full"
      overlay={overlay}
      className="h-full w-full"
      priority={priority}
    />
  );

  const motionContent = reduce ? (
    <div className="h-full w-full overflow-hidden">
      {inner}
    </div>
  ) : (
    <motion.div
      className="h-full w-full will-change-transform"
      whileHover={!isTouch ? { scale: zoom } : undefined}
      whileInView={isTouch ? { scale: zoom } : undefined}
      viewport={isTouch ? { once: true, margin: "-80px" } : undefined}
      transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
    >
      {inner}
    </motion.div>
  );

  if (framed) {
    return (
      <JapanesePhotoFrame
        aspect={aspect}
        className={cn(frameClassName, className)}
        showCorners={showCorners}
        showShine={showShine}
      >
        {motionContent}
      </JapanesePhotoFrame>
    );
  }

  return (
    <div className={cn("overflow-hidden", aspect, frameClassName, className)}>
      {motionContent}
    </div>
  );
}