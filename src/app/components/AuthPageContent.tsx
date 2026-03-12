'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

interface AuthPageContentProps {
  children: React.ReactNode;
}

export default function AuthPageContent({ children }: AuthPageContentProps) {
  const t = useTranslations('AuthLayout');

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-100 to-neutral-200">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-neutral-900">{t('appName')}</h1>
        <p className="text-sm text-neutral-600 mt-1">{t('subtitle')}</p>
      </div>

      {/* Auth Card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        {children}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-neutral-500">{t('copyright')}</p>
      </div>
    </div>
  );
}
