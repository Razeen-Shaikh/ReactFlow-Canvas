import type { Edge, Node } from '@xyflow/react'

export type NodeStatus = 'healthy' | 'degraded' | 'down'

export type InspectorTab = 'config' | 'runtime'

export type ConfigTab = 'cpu' | 'memory' | 'disk' | 'region'

export type GraphNodeType = 'service' | 'db'

export type ServiceType = 'postgres' | 'redis' | 'mongodb' | 'api'

export interface ServiceConfig {
  cpu: number
  memory: number
  disk: number
  region: number
}

export interface AppSummary {
  id: string
  name: string
  icon: ServiceType
}

export interface ServiceNodeData extends Record<string, unknown> {
  label: string
  description: string
  status: NodeStatus
  utilization: number
  serviceType: ServiceType
  pricePerHour: string
  config: ServiceConfig
}

export type GraphNode = Node<ServiceNodeData, GraphNodeType>

export interface GraphResponse {
  nodes: GraphNode[]
  edges: Edge[]
}
