import React from 'react';
import SeigaihaBackground from '@/components/SeigaihaBackground';
import { cn } from '@/lib/utils';

/**
 * SeigaihaDivider Component
 *
 * A reusable horizontal transitional strip (80–120px tall) featuring a soft
 * vertical fade (top and bottom) that breathes Japanese wave geometry between major sections.
 *
 * @param {Object} props
 * @param {'paper' | 'dark' | 'sage'} [props.variant='paper']
 * @param {string} [props.height='h-24 md:h-28'] - Default ~96px to 112px
 * @param {string} [props.className]
 */
export default function SeigaihaDivider({
  variant = 'paper',
  height = 'h-24 md:h-28',
  className,
}) {
  return (
    <div
      className={cn('relative w-full overflow-hidden pointer-events-none select-none', height, className)}
      aria-hidden="true"
    >
      <SeigaihaBackground variant={variant} mask="vertical" />
    </div>
  );
}

