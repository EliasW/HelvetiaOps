import React from 'react';
import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import Can from '@/app/components/Can';
import LogoutButton from '@/app/components/LogoutButton';
import DashboardPageContent from '@/app/components/DashboardPageContent';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log("session", session)
  const locale = await getLocale();
  const t = await getTranslations('Dashboard');

  // redirect to auth if not logged in
  if (!session) {
    redirect(`/${locale}/auth`);
  }

  return (
    <DashboardPageContent>
      <div>
        <h1 className="text-2xl font-bold mb-4">{t('title')}</h1>
        {session?.user && (
          <p className="mt-2">
            {t('loggedInAs')} <strong>{session.user.email}</strong> ({t('role')}: <em>{(session.user as any).role}</em>)
          </p>
        )}
        {/* guarded UI actions */}
        <div id='listMembers' className="mt-4 space-x-2">
          <div>{t('membersList')}</div>
          {/* Admin-only action */}
          <Can minRole="admin" fallback={null}>
            <button className="px-3 py-1 bg-indigo-600 text-white rounded">{t('adminPanel')}</button>
          </Can>

          {/* Manager+ action */}
          <Can minRole="manager" fallback={null}>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded">{t('manageUsers')}</button>
          </Can>

          {/* Viewer+ action (everyone with a session) */}
          <Can minRole="viewer" fallback={null}>
            <button className="px-3 py-1 bg-gray-600 text-white rounded">{t('viewReports')}</button>
          </Can>
        </div>
        <LogoutButton locale={locale} label={t('signOut')} />
      </div>
    </DashboardPageContent>
  );
}