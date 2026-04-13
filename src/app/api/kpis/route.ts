import { mockKPIs } from '@/lib/mock/data';
import { withMockBehavior, paginated } from '@/lib/mock/helpers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const projectId = searchParams.get('projectId');
  const status = searchParams.get('status');
  const ownerId = searchParams.get('ownerId');

  return withMockBehavior(() => {
    let filtered = mockKPIs;
    if (projectId) filtered = filtered.filter((k) => k.projectId === projectId);
    if (status) filtered = filtered.filter((k) => k.status === status);
    if (ownerId) filtered = filtered.filter((k) => k.owner === ownerId);

    const start = (page - 1) * limit;
    const slice = filtered.slice(start, start + limit);
    return paginated(slice, page, limit, filtered.length);
  });
}
