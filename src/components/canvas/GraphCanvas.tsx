import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Edge,
  type OnSelectionChangeParams,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCallback, useEffect } from 'react'
import { CanvasToolbar } from '@/components/canvas/CanvasToolbar'
import { DbNodeCard } from '@/components/canvas/DbNodeCard'
import { ServiceNodeCard } from '@/components/canvas/ServiceNodeCard'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppGraph } from '@/hooks/useAppGraph'
import { createGraphNode } from '@/lib/node-factory'
import { useAppStore } from '@/store/useAppStore'
import type { GraphNodeType, ServiceNodeData } from '@/types'

const nodeTypes = {
  service: ServiceNodeCard,
  db: DbNodeCard,
}

export function GraphCanvas() {
  const selectedAppId = useAppStore((s) => s.selectedAppId)
  const selectedNodeId = useAppStore((s) => s.selectedNodeId)
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId)
  const setPanelOpen = useAppStore((s) => s.setPanelOpen)
  const { data, isLoading, isError, error } = useAppGraph(selectedAppId)
  const { fitView, screenToFlowPosition } = useReactFlow()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node<ServiceNodeData>>(
    [],
  )
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  useEffect(() => {
    if (data) {
      setNodes(data.nodes)
      setEdges(data.edges)
      setSelectedNodeId(null)
      requestAnimationFrame(() => {
        void fitView({ padding: 0.2, duration: 300 })
      })
    }
  }, [data, setNodes, setEdges, fitView, setSelectedNodeId])

  useEffect(() => {
    if (selectedNodeId && !nodes.some((n) => n.id === selectedNodeId)) {
      setSelectedNodeId(null)
    }
  }, [nodes, selectedNodeId, setSelectedNodeId])

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: OnSelectionChangeParams) => {
      const node = selectedNodes[0]
      setSelectedNodeId(node?.id ?? null)
    },
    [setSelectedNodeId],
  )

  const handleAddNode = useCallback(
    (nodeType: GraphNodeType) => {
      const pane = document.querySelector('.react-flow')
      const rect = pane?.getBoundingClientRect()
      const centerX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2
      const centerY = rect ? rect.top + rect.height / 2 : window.innerHeight / 2
      const position = screenToFlowPosition({ x: centerX, y: centerY })
      const jitter = (nodes.length % 5) * 24

      const newNode = createGraphNode(nodeType, {
        x: position.x + jitter,
        y: position.y + jitter,
      })

      setNodes((current) => [...current, newNode])
      setSelectedNodeId(newNode.id)
      setPanelOpen(true)
    },
    [nodes.length, screenToFlowPosition, setNodes, setPanelOpen, setSelectedNodeId],
  )

  if (!selectedAppId) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select an application to view its graph
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full flex-col gap-4 p-8">
        <Skeleton className="h-32 w-56" />
        <Skeleton className="h-32 w-56 self-end" />
        <Skeleton className="h-32 w-56" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
        <p className="text-destructive">Failed to load graph</p>
        <p className="text-sm text-muted-foreground">
          {error instanceof Error ? error.message : 'Unknown error'}
        </p>
      </div>
    )
  }

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onSelectionChange={onSelectionChange}
      nodeTypes={nodeTypes}
      fitView
      deleteKeyCode={['Backspace', 'Delete']}
      className="bg-canvas"
      proOptions={{ hideAttribution: true }}
    >
      <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#2a2a2a" />
      <CanvasToolbar onAddNode={handleAddNode} />
    </ReactFlow>
  )
}
