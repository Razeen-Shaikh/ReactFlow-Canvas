import { http, HttpResponse, delay } from 'msw'
import { apps, getGraphForApp } from './data'

let simulateError = false

export function setSimulateError(value: boolean) {
  simulateError = value
}

export function getSimulateError() {
  return simulateError
}

export const handlers = [
  http.get('/api/apps', async () => {
    await delay(400)
    if (simulateError) {
      return HttpResponse.json(
        { message: 'Failed to load applications' },
        { status: 500 },
      )
    }
    return HttpResponse.json(apps)
  }),

  http.get('/api/apps/:appId/graph', async ({ params }) => {
    await delay(500)
    if (simulateError) {
      return HttpResponse.json(
        { message: 'Failed to load graph' },
        { status: 500 },
      )
    }
    const appId = params.appId as string
    return HttpResponse.json(getGraphForApp(appId))
  }),
]
