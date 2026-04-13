import { getServerSession } from 'next-auth';
import { getLocale, getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import DashboardOverview from '@/app/components/dashboard/DashboardOverview';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const t = await getTranslations('Dashboard');

  if (!session) {
    redirect(`/${locale}/auth`);
  }

  return (
    <DashboardPageContent>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('title')}</h1>
          {session?.user && (
            <p className="text-sm text-neutral-500">
              {t('loggedInAs')} <span className="font-medium text-neutral-700">{session.user.email}</span>
            </p>
          )}
        </div>
        <DashboardOverview />
      </div>
    </DashboardPageContent>
  );
}