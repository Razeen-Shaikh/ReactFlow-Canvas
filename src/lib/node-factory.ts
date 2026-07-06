import type { ConfigTab, GraphNode, GraphNodeType, ServiceNodeData } from '@/types'
import type { XYPosition } from '@xyflow/react'

const defaultConfig: ServiceNodeData['config'] = {
  cpu: 0.02,
  memory: 0.05,
  disk: 10,
  region: 1,
}

export function createGraphNode(
  nodeType: GraphNodeType,
  position: XYPosition,
): GraphNode {
  const isDb = nodeType === 'db'

  return {
    id: `${nodeType}-${crypto.randomUUID().slice(0, 8)}`,
    type: nodeType,
    position,
    data: {
      label: isDb ? 'New Database' : 'New Service',
      description: isDb ? 'Database instance' : 'Application service',
      status: 'healthy',
      utilization: 0,
      serviceType: isDb ? 'postgres' : 'api',
      pricePerHour: isDb ? '$0.03/HR' : '$0.05/HR',
      config: { ...defaultConfig },
    },
  }
}

export function clampConfigValue(tab: ConfigTab, value: number): number {
  const limits = {
    cpu: { min: 0.01, max: 4, step: 0.01 },
    memory: { min: 0.01, max: 32, step: 0.01 },
    disk: { min: 1, max: 500, step: 0.01 },
    region: { min: 1, max: 10, step: 1 },
  } as const

  const { min, max, step } = limits[tab]
  const clamped = Math.min(max, Math.max(min, value))
  return step >= 1 ? Math.round(clamped) : Math.round(clamped / step) * step
}
