'use client';

import React from 'react';

/**
 * Loading skeleton component
 */
export function QueryLoading() {
  return (
    <div className="space-y-4">
      <div className="h-8 bg-neutral-200 rounded animate-pulse"></div>
      <div className="h-6 bg-neutral-200 rounded animate-pulse w-3/4"></div>
      <div className="h-6 bg-neutral-200 rounded animate-pulse w-1/2"></div>
    </div>
  );
}

/**
 * Error display component
 */
export function QueryError({ error, onRetry }: { error: Error | null; onRetry?: () => void }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium text-red-800">Error loading data</h3>
          <p className="mt-1 text-sm text-red-700">{error.message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50 transition"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Empty state component
 */
export function QueryEmpty({ message = 'No data available' }: { message?: string }) {
  return (
    <div className="text-center py-12">
      <svg
        className="mx-auto h-12 w-12 text-neutral-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="mt-4 text-neutral-600">{message}</p>
    </div>
  );
}

/**
 * Query wrapper component that handles all states
 */
interface QueryWrapperProps {
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
}

export function QueryWrapper({
  isLoading,
  isError,
  error,
  isEmpty = false,
  emptyMessage,
  onRetry,
  children,
}: QueryWrapperProps) {
  if (isLoading) {
    return <QueryLoading />;
  }

  if (isError) {
    return <QueryError error={error} onRetry={onRetry} />;
  }

  if (isEmpty) {
    return <QueryEmpty message={emptyMessage} />;
  }

  return <>{children}</>;
}
