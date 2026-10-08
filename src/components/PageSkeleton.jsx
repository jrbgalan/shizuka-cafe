import React from "react";

// Skeleton loader for Suspense fallback during lazy route loading.
export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-zen-paper pt-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16">
        <div className="h-12 w-64 bg-zen-surface animate-pulse" />
        <div className="mt-4 h-4 w-32 bg-zen-surface animate-pulse" />
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <div className="aspect-[4/5] bg-zen-surface animate-pulse" />
              <div className="mt-4 h-6 w-3/4 bg-zen-surface animate-pulse" />
              <div className="mt-2 h-4 w-1/2 bg-zen-surface animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}