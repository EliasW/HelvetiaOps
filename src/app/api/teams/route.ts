import { mockTeams } from '@/lib/mock/data';
import { withMockBehavior, paginated } from '@/lib/mock/helpers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const search = searchParams.get('search')?.toLowerCase();

  return withMockBehavior(() => {
    let filtered = mockTeams;
    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search)
      );
    }
    const start = (page - 1) * limit;
    const slice = filtered.slice(start, start + limit);
    return paginated(slice, page, limit, filtered.length);
  });
}
