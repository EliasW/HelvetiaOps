import { UseQueryOptions, UseQueryResult, useQuery } from '@tanstack/react-query';
import { ApiResponse } from '@/types/api';

/**
 * Custom hook for API queries with error handling
 */
export function useApiQuery<T>(
  queryKey: (string | number | object)[],
  queryFn: () => Promise<ApiResponse<T>>,
  options?: Omit<UseQueryOptions<ApiResponse<T>>, 'queryKey' | 'queryFn'>
): UseQueryResult<T, Error> {
  return useQuery({
    queryKey,
    queryFn: async () => {
      const response = await queryFn();
      
      if (!response.success) {
        throw new Error(response.error?.message || 'An error occurred');
      }
      
      return response.data as T;
    },
    ...options,
  }) as UseQueryResult<T, Error>;
}

/**
 * Hook for handling query state with loading and error
 */
export function useQueryState<T>(query: UseQueryResult<T, Error>) {
  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
  };
}
