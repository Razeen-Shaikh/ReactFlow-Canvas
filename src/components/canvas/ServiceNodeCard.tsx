import { BaseNodeCard } from '@/components/canvas/BaseNodeCard'
import type { ServiceNodeData } from '@/types'
import type { Node, NodeProps } from '@xyflow/react'

export function ServiceNodeCard(props: NodeProps<Node<ServiceNodeData>>) {
  return <BaseNodeCard {...props} variant="service" />
}
