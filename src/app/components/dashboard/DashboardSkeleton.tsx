'use client';

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-5 flex items-center gap-4 animate-pulse">
      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-neutral-200"></div>
      <div className="flex-1">
        <div className="h-4 bg-neutral-200 rounded w-20 mb-2"></div>
        <div className="h-7 bg-neutral-200 rounded w-12"></div>
      </div>
    </div>
  );
}

export function KPICardSkeleton() {
  return (
    <div className="rounded-lg border p-4 bg-white animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="h-4 bg-neutral-200 rounded w-32"></div>
        <div className="h-5 bg-neutral-200 rounded-full w-16"></div>
      </div>
      <div className="h-3 bg-neutral-200 rounded w-48 mb-3"></div>
      <div className="flex justify-between mb-2">
        <div className="h-4 bg-neutral-200 rounded w-24"></div>
        <div className="h-4 bg-neutral-200 rounded w-20"></div>
      </div>
      <div className="w-full bg-neutral-200 rounded-full h-1.5"></div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      {/* Section title skeleton */}
      <div className="h-6 bg-neutral-200 rounded w-40 animate-pulse"></div>

      {/* KPI cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <KPICardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
