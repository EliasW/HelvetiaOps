import { mockProjects } from '@/lib/mock/data';
import { withMockBehavior, paginated } from '@/lib/mock/helpers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
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
