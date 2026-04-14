import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import ProjectForm from '@/app/components/dashboard/ProjectForm';
import { authOptions } from '@/auth';
import { mockTeams, mockUsers } from '@/lib/mock/data';

interface NewProjectPageProps {
  params: {
    locale: string;
  };
}

export default async function NewProjectPage({ params: { locale } }: NewProjectPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/auth`);
  }

  const teams = mockTeams.map((team) => ({
    id: team.id,
    name: team.name,
  }));

  const users = mockUsers.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
  }));

  return (
    <DashboardPageContent>
      <ProjectForm mode="create" teams={teams} users={users} />
    </DashboardPageContent>
  );
}
