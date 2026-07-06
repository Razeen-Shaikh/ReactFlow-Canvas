import { useQuery } from '@tanstack/react-query'
import { fetchApps } from '@/lib/api'

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: fetchApps,
  })
}
