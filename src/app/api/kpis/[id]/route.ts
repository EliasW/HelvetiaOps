import { mockKPIs } from '@/lib/mock/data';
import { withMockBehavior, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(() => {
    const kpi = mockKPIs.find((k) => k.id === id);
    if (!kpi) throw 'NOT_FOUND';
    return success(kpi);
  }).catch(() => error(ApiErrorCode.NOT_FOUND, `KPI ${id} not found`));
}
