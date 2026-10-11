import React from 'react';
import SeigaihaBackground from '@/components/SeigaihaBackground';
import type { SeigaihaVariant } from '@/lib/seigaiha';
import { cn } from '@/lib/utils';

export interface SeigaihaDividerProps {
  variant?: SeigaihaVariant;
  height?: string;
  className?: string;
}

/**
 * SeigaihaDivider Component
 *
 * A reusable horizontal transitional strip (80–120px tall) featuring a soft
 * vertical fade (top and bottom) that breathes Japanese wave geometry between major sections.
 */
export default function SeigaihaDivider({
  variant = 'paper',
  height = 'h-24 md:h-28',
  className,
}: SeigaihaDividerProps) {
  return (
    <div
      className={cn('relative w-full overflow-hidden pointer-events-none select-none', height, className)}
      aria-hidden="true"
    >
      <SeigaihaBackground variant={variant} mask="vertical" />
    </div>
  );
}

