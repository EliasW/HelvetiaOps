'use client';

import React from 'react';

type Severity = 'error' | 'warning' | 'info';

interface ErrorBannerProps {
  title?: string;
  message: string;
  severity?: Severity;
  onRetry?: () => void;
  retryLabel?: string;
  onDismiss?: () => void;
}

const styles: Record<Severity, { bg: string; border: string; icon: string; title: string; text: string; btn: string }> = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-400',
    title: 'text-red-800',
    text: 'text-red-700',
    btn: 'border-red-300 text-red-700 hover:bg-red-100',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-400',
    title: 'text-amber-800',
    text: 'text-amber-700',
    btn: 'border-amber-300 text-amber-700 hover:bg-amber-100',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-400',
    title: 'text-blue-800',
    text: 'text-blue-700',
    btn: 'border-blue-300 text-blue-700 hover:bg-blue-100',
  },
};

const icons: Record<Severity, React.ReactNode> = {
  error: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  ),
};

export default function ErrorBanner({
  title,
  message,
  severity = 'error',
  onRetry,
  retryLabel = 'Try again',
  onDismiss,
}: ErrorBannerProps) {
  const s = styles[severity];

  return (
    <div className={`${s.bg} border ${s.border} rounded-lg p-4`} role="alert">
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${s.icon}`}>{icons[severity]}</div>
        <div className="flex-1 min-w-0">
          {title && <h3 className={`text-sm font-medium ${s.title}`}>{title}</h3>}
          <p className={`${title ? 'mt-1' : ''} text-sm ${s.text}`}>{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className={`mt-3 inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded bg-white transition ${s.btn}`}
            >
              {retryLabel}
            </button>
          )}
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className={`flex-shrink-0 ${s.icon} hover:opacity-70`} aria-label="Dismiss">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
