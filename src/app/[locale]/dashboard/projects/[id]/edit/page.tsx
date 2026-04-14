import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import DashboardPageContent from '@/app/components/DashboardPageContent';
import ProjectForm from '@/app/components/dashboard/ProjectForm';
import { authOptions } from '@/auth';
import { mockProjects, mockTeams, mockUsers } from '@/lib/mock/data';

interface EditProjectPageProps {
  readonly params: Readonly<{
    locale: string;
    id: string;
  }>;
}

export default async function EditProjectPage({ params: { locale, id } }: EditProjectPageProps) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect(`/${locale}/auth`);
  }

  const project = mockProjects.find((item) => item.id === id);
  if (!project) {
    redirect(`/${locale}/dashboard/projects`);
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

  const projectFormValue = {
    id: project.id,
    name: project.name,
    description: project.description ?? '',
    teamId: project.teamId,
    ownerId: project.owner,
    status: project.status,
    startDate: project.startDate.toISOString().slice(0, 10),
    endDate: project.endDate?.toISOString().slice(0, 10) ?? '',
  };

  return (
    <DashboardPageContent>
      <ProjectForm mode="edit" project={projectFormValue} teams={teams} users={users} />
    </DashboardPageContent>
  );
}
