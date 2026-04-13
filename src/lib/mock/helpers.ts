import { ApiResponse, PaginatedResponse, ApiErrorCode } from '@/types/api';

/**
 * Simulate network latency (200-800ms)
 */
export async function simulateLatency(min = 200, max = 800): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  await new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Simulate random errors (default 10% chance)
 */
export function shouldSimulateError(rate = 0.1): boolean {
  return Math.random() < rate;
}

/**
 * Create a success response
 */
export function success<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create a paginated response
 */
export function paginated<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Create an error response
 */
export function error(code: ApiErrorCode, message: string): Response {
  const statusMap: Record<ApiErrorCode, number> = {
    [ApiErrorCode.UNAUTHORIZED]: 401,
    [ApiErrorCode.FORBIDDEN]: 403,
    [ApiErrorCode.NOT_FOUND]: 404,
    [ApiErrorCode.VALIDATION_ERROR]: 422,
    [ApiErrorCode.CONFLICT]: 409,
    [ApiErrorCode.INTERNAL_ERROR]: 500,
    [ApiErrorCode.BAD_REQUEST]: 400,
  };

  return Response.json(
    {
      success: false,
      error: { code, message },
      timestamp: new Date().toISOString(),
    },
    { status: statusMap[code] }
  );
}

/**
 * Wrap handler with latency simulation and random error injection
 */
export async function withMockBehavior<T>(
  handler: () => T | Promise<T>,
  errorRate = 0.1
): Promise<Response> {
  await simulateLatency();

  if (shouldSimulateError(errorRate)) {
    return error(ApiErrorCode.INTERNAL_ERROR, 'Simulated server error');
  }

  const result = await handler();
  return Response.json(result);
}
