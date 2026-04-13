'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import DashboardHeader from '@/app/components/DashboardHeader';
import DashboardSidebar from '@/app/components/DashboardSidebar';

interface DashboardPageContentProps {
  children: React.ReactNode;
}

export default function DashboardPageContent({
  children,
}: DashboardPageContentProps) {
  const locale = useLocale();
  const t = useTranslations('DashboardLayout');

  const links = [
    { href: `/${locale}/dashboard`, label: t('home') },
    { href: `/${locale}/dashboard/performance`, label: t('performance') },
    { href: `/${locale}/dashboard/settings`, label: t('settings') },
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      <DashboardHeader
        locale={locale}
        translations={{
          user: t('user'),
          settings: t('settings'),
          logout: t('logout'),
          loggedInUser: t('loggedInUser'),
        }}
      />

      <div className="flex flex-1">
        <DashboardSidebar
          locale={locale}
          links={links}
          menuLabel={t('menu')}
        />

        <main className="flex-1 p-6 bg-neutral-100 text-neutral-900">
          {children}
        </main>
      </div>
    </div>
  );
}
