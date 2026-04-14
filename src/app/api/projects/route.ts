import { mockProjects, mockUsers } from '@/lib/mock/data';
import { withMockBehavior, paginated, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = Number.parseInt(searchParams.get('page') || '1');
  const limit = Number.parseInt(searchParams.get('limit') || '10');
  const teamId = searchParams.get('teamId');
  const status = searchParams.get('status');
  const ownerId = searchParams.get('ownerId');

  return withMockBehavior(() => {
    let filtered = mockProjects;
    if (teamId) filtered = filtered.filter((p) => p.teamId === teamId);
    if (status) filtered = filtered.filter((p) => p.status === status);
    if (ownerId) filtered = filtered.filter((p) => p.owner === ownerId);

    const start = (page - 1) * limit;
    const slice = filtered.slice(start, start + limit);
    return paginated(slice, page, limit, filtered.length);
  });
}

export async function POST(req: Request) {
  return withMockBehavior(async () => {
    const body = await req.json();
    const { name, description, teamId, ownerId, status, startDate, endDate } = body;

    if (!name || !teamId || !ownerId || !startDate) {
      return error(ApiErrorCode.VALIDATION_ERROR, 'Missing required project fields');
    }

    const newProject = {
      id: `p${mockProjects.length + 1}`,
      name,
      description: description ?? '',
      teamId,
      status: status ?? 'active',
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      owner: ownerId,
      members: mockUsers.filter((user) => body.memberIds?.includes(user.id)),
      kpis: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProjects.push(newProject);
    return success(newProject);
  });
}
