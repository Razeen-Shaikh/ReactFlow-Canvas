import { clampConfigValue } from '@/lib/node-factory'
import type { ConfigTab, ServiceNodeData } from '@/types'
import { useReactFlow } from '@xyflow/react'
import { useCallback } from 'react'

export function useNodeDataUpdater() {
  const { setNodes } = useReactFlow()

  const updateNodeData = useCallback(
    (nodeId: string, updater: (data: ServiceNodeData) => ServiceNodeData) => {
      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id !== nodeId) return node
          return {
            ...node,
            data: updater(node.data as ServiceNodeData),
          }
        }),
      )
    },
    [setNodes],
  )

  const patchNodeData = useCallback(
    (nodeId: string, patch: Partial<ServiceNodeData>) => {
      updateNodeData(nodeId, (data) => ({ ...data, ...patch }))
    },
    [updateNodeData],
  )

  const patchNodeConfig = useCallback(
    (nodeId: string, tab: ConfigTab, value: number) => {
      const rounded = clampConfigValue(tab, value)
      updateNodeData(nodeId, (data) => ({
        ...data,
        config: { ...data.config, [tab]: rounded },
      }))
    },
    [updateNodeData],
  )

  return { updateNodeData, patchNodeData, patchNodeConfig }
}
