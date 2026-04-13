import { mockUsers } from '@/lib/mock/data';
import { withMockBehavior, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(() => {
    const user = mockUsers.find((u) => u.id === id);
    if (!user) throw 'NOT_FOUND';
    return success(user);
  }).catch(() => error(ApiErrorCode.NOT_FOUND, `User ${id} not found`));
}
