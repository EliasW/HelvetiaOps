'use client';

import React from 'react';

interface SkeletonProps {
  className?: string;
}

/** Base skeleton block */
export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`bg-neutral-200 rounded animate-pulse ${className}`} />;
}

/** Single line of text */
export function SkeletonText({ width = 'w-full' }: { width?: string }) {
  return <Skeleton className={`h-4 ${width}`} />;
}

/** Card-shaped skeleton */
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border p-5 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}

/** Stat card skeleton */
export function SkeletonStat() {
  return (
    <div className="bg-white rounded-lg border p-5 flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-12" />
      </div>
    </div>
  );
}

/** Table row skeleton */
export function SkeletonTableRow({ cols = 4 }: { cols?: number }) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b">
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className={`h-4 ${i === 0 ? 'flex-1' : 'w-20'}`} />
      ))}
    </div>
  );
}

/** Full table skeleton */
export function SkeletonTable({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="flex gap-4 px-4 py-3 bg-neutral-50 border-b">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i === 0 ? 'flex-1' : 'w-20'}`} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonTableRow key={i} cols={cols} />
      ))}
    </div>
  );
}

/** Avatar skeleton */
export function SkeletonAvatar({ size = 'w-8 h-8' }: { size?: string }) {
  return <Skeleton className={`${size} rounded-full`} />;
}

/** Page-level skeleton with title + content */
export function SkeletonPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStat key={i} />
        ))}
      </div>
      <Skeleton className="h-6 w-40" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
