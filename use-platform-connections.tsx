import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { PlatformConnection } from '@shared/schema';
import { queryClient } from '@/lib/queryClient';

export function usePlatformConnections() {
  return useQuery({
    queryKey: ['/api/platform-connections'],
    select: (data: PlatformConnection[]) => data
  });
}

export function usePlatformConnection(platformId: number) {
  return useQuery({
    queryKey: ['/api/platform-connections', platformId],
    select: (data: PlatformConnection) => data,
    enabled: !!platformId
  });
}

export function useUpdatePlatformConnection() {
  return useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: number; 
      data: Partial<PlatformConnection> 
    }) => {
      return apiRequest('PATCH', `/api/platform-connections/${id}`, data);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/platform-connections'] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['/api/platform-connections', variables.id] 
      });
    }
  });
}