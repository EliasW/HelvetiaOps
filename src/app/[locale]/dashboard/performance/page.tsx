import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import PerformanceDashboard from '@/app/components/dashboard/PerformanceDashboard';

export default async function PerformancePage() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session) {
    redirect(`/${locale}/auth`);
  }

  return (
    <DashboardPageContent>
      <PerformanceDashboard />
    </DashboardPageContent>
  );
}
