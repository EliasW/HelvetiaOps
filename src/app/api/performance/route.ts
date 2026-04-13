import { generatePerformanceData } from '@/lib/mock/performanceData';
import { simulateLatency, shouldSimulateError, error } from '@/lib/mock/helpers';
import { ApiErrorCode } from '@/types/api';

export async function GET(req: Request) {
  await simulateLatency(100, 400);

  if (shouldSimulateError(0.05)) {
    return error(ApiErrorCode.INTERNAL_ERROR, 'Simulated server error');
  }

  const { searchParams } = new URL(req.url);
  const startStr = searchParams.get('start');
  const endStr = searchParams.get('end');
  const compareStartStr = searchParams.get('compareStart');
  const compareEndStr = searchParams.get('compareEnd');

  const end = endStr ? new Date(endStr) : new Date();
  const start = startStr
    ? new Date(startStr)
    : new Date(end.getTime() - 30 * 86400000);

  const current = generatePerformanceData(start, end);

  let comparison = null;
  if (compareStartStr && compareEndStr) {
    comparison = generatePerformanceData(
      new Date(compareStartStr),
      new Date(compareEndStr)
    );
  }

  return Response.json({
    success: true,
    data: { current, comparison },
    timestamp: new Date().toISOString(),
  });
}
