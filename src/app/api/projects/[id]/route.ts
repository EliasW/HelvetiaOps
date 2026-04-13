import { mockProjects } from '@/lib/mock/data';
import { withMockBehavior, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(() => {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) throw 'NOT_FOUND';
    return success(project);
  }).catch(() => error(ApiErrorCode.NOT_FOUND, `Project ${id} not found`));
}
