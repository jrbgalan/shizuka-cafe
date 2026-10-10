import React, { useMemo } from 'react';
import { getSeigaihaDataUri } from '@/lib/seigaiha';
import { cn } from '@/lib/utils';

/**
 * @typedef {'paper' | 'dark' | 'sage'} SeigaihaVariant
 * @typedef {'radial-center' | 'radial' | 'vertical' | 'top' | 'none'} SeigaihaMask
 */

/**
 * Resolves the CSS mask-image value for soft edge transitions.
 * @param {SeigaihaMask} mask
 * @returns {string | undefined}
 */
function getMaskImage(mask) {
  switch (mask) {
    case 'radial-center':
      // Gentle calm center: pattern fades to ~18% behind the center text, strongest toward edges
      return 'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(0, 0, 0, 0.18) 0%, rgba(0, 0, 0, 0.42) 52%, black 88%)';
    case 'vertical':
      // Top and bottom vertical gradient fade (for section dividers / strips)
      return 'linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)';
    case 'top':
      // Fade toward the top (for footer brand band)
      return 'linear-gradient(to top, black 25%, transparent 100%)';
    case 'radial':
      // Center visible, outer perimeter fades to transparent
      return 'radial-gradient(ellipse 70% 60% at 50% 50%, black 30%, transparent 85%)';
    case 'none':
    default:
      return undefined;
  }
}

/**
 * SeigaihaBackground Component
 *
 * Renders an absolutely positioned, pointer-events-none, aria-hidden wave background
 * using a single CSS background-image with an 80x40 seamless SVG tile data URI.
 *
 * - Responsive tile sizing: 60x30 on mobile, 80x40 from md (768px), 100x50 from xl (1440px).
 * - High-DPI seamless rendering with integer 2:1 pixel scaling.
 * - Soft edge masking via CSS mask-image.
 * - Optional GPU-accelerated slow drift (90s linear infinite loop, transform only, md+ only).
 * - Zero per-circle DOM nodes, zero JS animation overhead.
 */
export default function SeigaihaBackground({
  variant = 'paper',
  mask = 'none',
  drift = false,
  position,
  bg,
  line,
  opacity,
  strokeWidth,
  className,
  style,
}) {
  // Memoized SVG data URI for the specified variant and color overrides
  const dataUri = useMemo(
    () => getSeigaihaDataUri(variant, { bg, line, opacity, strokeWidth }),
    [variant, bg, line, opacity, strokeWidth]
  );

  const maskImage = getMaskImage(mask);

  const maskStyle = maskImage
    ? {
        WebkitMaskImage: maskImage,
        maskImage: maskImage,
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
      }
    : undefined;

  const isBottom = position === 'center bottom';

  const patternStyle = {
    backgroundImage: `url("${dataUri}")`,
    ...(position ? { backgroundPosition: position } : {}),
    ...style,
  };

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none z-0 overflow-hidden select-none',
        className
      )}
      style={maskStyle}
      aria-hidden="true"
    >
      <div
        className={cn(
          'seigaiha-tile absolute inset-y-0 left-0',
          isBottom && 'seigaiha-tile-bottom',
          drift ? 'seigaiha-drift-layer' : 'inset-x-0'
        )}
        style={patternStyle}
      />
    </div>
  );
}
