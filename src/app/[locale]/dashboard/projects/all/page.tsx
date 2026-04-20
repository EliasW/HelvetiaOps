import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import AllProjectsView from '@/app/components/dashboard/AllProjectsView';

export default async function AllProjectsPage() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();

  if (!session) {
    redirect(`/${locale}/auth`);
  }

  return (
    <DashboardPageContent>
      <AllProjectsView />
    </DashboardPageContent>
  );
}
