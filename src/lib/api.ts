import type { AppSummary, GraphResponse } from '@/types'

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as {
      message?: string
    }
    throw new Error(body.message ?? `Request failed: ${response.status}`)
  }
  return response.json() as Promise<T>
}

export function fetchApps(): Promise<AppSummary[]> {
  return fetchJson<AppSummary[]>('/api/apps')
}

export function fetchAppGraph(appId: string): Promise<GraphResponse> {
  return fetchJson<GraphResponse>(`/api/apps/${appId}/graph`)
}
