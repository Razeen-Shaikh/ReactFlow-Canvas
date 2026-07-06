import type { NodeStatus, ServiceType } from '@/types'
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Layers,
  Server,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const serviceIcons: Record<ServiceType, LucideIcon> = {
  postgres: Database,
  redis: Layers,
  mongodb: Database,
  api: Server,
}

export const serviceColors: Record<ServiceType, string> = {
  postgres: 'text-blue-400',
  redis: 'text-red-400',
  mongodb: 'text-green-400',
  api: 'text-purple-400',
}

export const statusLabels: Record<NodeStatus, string> = {
  healthy: 'Success',
  degraded: 'Warning',
  down: 'Error',
}

export const configTabMeta = {
  cpu: { label: 'CPU', unit: '', min: 0.01, max: 4, step: 0.01 },
  memory: { label: 'Memory', unit: ' GB', min: 0.01, max: 32, step: 0.01 },
  disk: { label: 'Disk', unit: ' GB', min: 1, max: 500, step: 0.01 },
  region: { label: 'Region', unit: '', min: 1, max: 10, step: 1 },
} as const

export const statusBadgeVariant: Record<
  NodeStatus,
  'success' | 'warning' | 'danger'
> = {
  healthy: 'success',
  degraded: 'warning',
  down: 'danger',
}

export const statusIcons: Record<NodeStatus, LucideIcon> = {
  healthy: CheckCircle2,
  degraded: AlertTriangle,
  down: AlertTriangle,
}
