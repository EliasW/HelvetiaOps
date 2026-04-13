import { mockTeams } from '@/lib/mock/data';
import { withMockBehavior, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(() => {
    const team = mockTeams.find((t) => t.id === id);
    if (!team) throw 'NOT_FOUND';
    return success(team);
  }).catch(() => error(ApiErrorCode.NOT_FOUND, `Team ${id} not found`));
}
