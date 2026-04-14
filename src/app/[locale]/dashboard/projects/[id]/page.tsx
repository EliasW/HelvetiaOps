import { getServerSession } from 'next-auth';
import { getLocale } from 'next-intl/server';
import { redirect } from 'next/navigation';
import { authOptions } from '@/auth';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import ProjectDetailView from '@/app/components/dashboard/ProjectDetailView';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const { id } = await params;

  if (!session) {
    redirect(`/${locale}/auth`);
  }

  return (
    <DashboardPageContent>
      <ProjectDetailView projectId={id} />
    </DashboardPageContent>
  );
}
