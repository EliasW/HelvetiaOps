import { mockActivities } from '@/lib/mock/activityData';
import { withMockBehavior, paginated } from '@/lib/mock/helpers';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return withMockBehavior(() => {
    const activities = mockActivities
      .filter((a) => a.projectId === id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return paginated(activities, 1, 50, activities.length);
  }, 0.05);
}
