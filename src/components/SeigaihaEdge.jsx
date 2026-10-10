import React, { useMemo } from 'react';
import { getSeigaihaEdgeDataUri, SEIGAIHA_DARK } from '@/lib/seigaiha';
import { cn } from '@/lib/utils';

/**
 * SeigaihaEdge Component
 *
 * Renders 2 staggered rows of authentic Japanese wave scales with concentric gold rings
 * along the boundary of dark sections.
 *
 * @param {'down' | 'up'} [direction='down'] - 'down' for header bottom (scales rolling down into paper), 'up' for footer top.
 * @param {string} [darkBg=SEIGAIHA_DARK.bg] - Background fill of the scales.
 * @param {string} [line=SEIGAIHA_DARK.line] - Stroke color (#A88A4E).
 * @param {number} [opacity=SEIGAIHA_DARK.opacityEdge] - Stroke opacity (0.38).
 * @param {number} [strokeWidth=SEIGAIHA_DARK.strokeWidthEdge] - Stroke width (0.9).
 */
export default function SeigaihaEdge({
  direction = 'down',
  darkBg = SEIGAIHA_DARK.bg,
  line = SEIGAIHA_DARK.line,
  opacity = SEIGAIHA_DARK.opacityEdge,
  strokeWidth = SEIGAIHA_DARK.strokeWidthEdge,
  className,
  style,
}) {
  const dataUri = useMemo(
    () => getSeigaihaEdgeDataUri(darkBg, line, opacity, strokeWidth),
    [darkBg, line, opacity, strokeWidth]
  );

  const isDown = direction === 'down';

  return (
    <div
      className={cn(
        'absolute left-0 right-0 pointer-events-none select-none z-10 overflow-hidden',
        'h-[60px] md:h-[80px]',
        isDown
          ? '-bottom-[59px] md:-bottom-[79px] scale-y-[-1]'
          : '-top-[59px] md:-top-[79px]',
        className
      )}
      style={style}
      aria-hidden="true"
    >
      <div
        className="seigaiha-edge-tile w-full h-full"
        style={{
          backgroundImage: `url("${dataUri}")`,
        }}
      />
    </div>
  );
}
