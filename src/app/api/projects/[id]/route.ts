import { mockProjects } from '@/lib/mock/data';
import { withMockBehavior, success, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(() => {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) throw new Error(`Project ${id} not found`);
    return success(project);
  }).catch(() => error(ApiErrorCode.NOT_FOUND, `Project ${id} not found`));
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return withMockBehavior(async () => {
    const project = mockProjects.find((p) => p.id === id);
    if (!project) {
      return error(ApiErrorCode.NOT_FOUND, `Project ${id} not found`);
    }

    const body = await req.json();
    const { name, description, status, startDate, endDate } = body;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;
    if (status !== undefined) project.status = status;
    if (startDate !== undefined) project.startDate = new Date(startDate);
    if (endDate !== undefined) {
      project.endDate = endDate ? new Date(endDate) : undefined;
    }

    project.updatedAt = new Date();
    return success(project);
  });
}
