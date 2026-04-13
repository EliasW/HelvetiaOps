import { mockUsers } from '@/lib/mock/data';
import { withMockBehavior, success, paginated } from '@/lib/mock/helpers';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  return withMockBehavior(() => {
    const start = (page - 1) * limit;
    const slice = mockUsers.slice(start, start + limit);
    return paginated(slice, page, limit, mockUsers.length);
  });
}
