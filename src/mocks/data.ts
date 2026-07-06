import type { AppSummary, GraphResponse } from '@/types'

export const apps: AppSummary[] = [
  { id: 'supertokens-golang', name: 'supertokens-golang', icon: 'api' },
  { id: 'supertokens-java', name: 'supertokens-java', icon: 'postgres' },
  { id: 'supertokens-python', name: 'supertokens-python', icon: 'redis' },
  { id: 'supertokens-node', name: 'supertokens-node', icon: 'mongodb' },
  { id: 'supertokens-php', name: 'supertokens-php', icon: 'api' },
]

const graphs: Record<string, GraphResponse> = {
  'supertokens-golang': {
    nodes: [
      {
        id: 'postgres-1',
        type: 'db',
        position: { x: 60, y: 100 },
        data: {
          label: 'Postgres',
          description: 'Primary relational database',
          status: 'healthy',
          utilization: 25,
          serviceType: 'postgres',
          pricePerHour: '$0.03/HR',
          config: { cpu: 0.02, memory: 0.05, disk: 10, region: 1 },
        },
      },
      {
        id: 'redis-1',
        type: 'db',
        position: { x: 380, y: 60 },
        data: {
          label: 'Redis',
          description: 'Session cache layer',
          status: 'degraded',
          utilization: 62,
          serviceType: 'redis',
          pricePerHour: '$0.02/HR',
          config: { cpu: 0.02, memory: 0.05, disk: 10, region: 1 },
        },
      },
      {
        id: 'mongodb-1',
        type: 'db',
        position: { x: 220, y: 280 },
        data: {
          label: 'Mongodb',
          description: 'Document store for analytics',
          status: 'down',
          utilization: 10,
          serviceType: 'mongodb',
          pricePerHour: '$0.04/HR',
          config: { cpu: 0.02, memory: 0.05, disk: 10, region: 1 },
        },
      },
    ],
    edges: [
      { id: 'e-pg-redis', source: 'postgres-1', target: 'redis-1' },
      { id: 'e-redis-mongo', source: 'redis-1', target: 'mongodb-1' },
    ],
  },
  'supertokens-java': {
    nodes: [
      {
        id: 'postgres-2',
        type: 'db',
        position: { x: 100, y: 150 },
        data: {
          label: 'Postgres',
          description: 'Java app database',
          status: 'healthy',
          utilization: 40,
          serviceType: 'postgres',
          pricePerHour: '$0.03/HR',
          config: { cpu: 0.04, memory: 0.08, disk: 20, region: 1 },
        },
      },
      {
        id: 'redis-2',
        type: 'db',
        position: { x: 400, y: 150 },
        data: {
          label: 'Redis',
          description: 'Cache',
          status: 'healthy',
          utilization: 30,
          serviceType: 'redis',
          pricePerHour: '$0.02/HR',
          config: { cpu: 0.02, memory: 0.05, disk: 10, region: 1 },
        },
      },
      {
        id: 'api-2',
        type: 'service',
        position: { x: 250, y: 300 },
        data: {
          label: 'API Gateway',
          description: 'Public API endpoint',
          status: 'degraded',
          utilization: 75,
          serviceType: 'api',
          pricePerHour: '$0.05/HR',
          config: { cpu: 0.08, memory: 0.16, disk: 50, region: 2 },
        },
      },
    ],
    edges: [
      { id: 'e-api-pg', source: 'api-2', target: 'postgres-2' },
      { id: 'e-api-redis', source: 'api-2', target: 'redis-2' },
    ],
  },
}

const defaultGraph = graphs['supertokens-golang']!

export function getGraphForApp(appId: string): GraphResponse {
  return graphs[appId] ?? defaultGraph
}
