import { StatusPill } from '@/components/inspector/StatusPill'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useNodeDataUpdater } from '@/hooks/useNodeDataUpdater'
import { configTabMeta, serviceColors, serviceIcons } from '@/lib/service-meta'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import type { ConfigTab, GraphNodeType, ServiceNodeData, ServiceType } from '@/types'
import { useNodes, type Node } from '@xyflow/react'

const dbServiceTypes: ServiceType[] = ['postgres', 'redis', 'mongodb']
const serviceTypes: ServiceType[] = ['api']

export function NodeInspector() {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId)
  const activeTab = useAppStore((s) => s.activeInspectorTab)
  const setActiveInspectorTab = useAppStore((s) => s.setActiveInspectorTab)
  const nodes = useNodes<Node<ServiceNodeData>>()
  const { patchNodeData, patchNodeConfig } = useNodeDataUpdater()

  const node = nodes.find((n) => n.id === selectedNodeId)

  if (!node) {
    return (
      <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
        Select a node on the canvas to inspect its configuration
      </div>
    )
  }

  const { data } = node
  const nodeType = (node.type ?? 'service') as GraphNodeType
  const Icon = serviceIcons[data.serviceType]
  const allowedServiceTypes =
    nodeType === 'db' ? dbServiceTypes : serviceTypes

  const updateNode = (patch: Partial<ServiceNodeData>) => {
    patchNodeData(node.id, patch)
  }

  const handleUtilizationChange = (value: number) => {
    const clamped = Math.min(100, Math.max(0, Number.isNaN(value) ? 0 : value))
    updateNode({ utilization: clamped })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={cn('h-5 w-5', serviceColors[data.serviceType])} />
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              {nodeType === 'db' ? 'DB Node' : 'Service Node'}
            </h3>
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {nodeType}
            </p>
          </div>
        </div>
        <StatusPill status={data.status} />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          setActiveInspectorTab(v as 'config' | 'runtime')
        }
      >
        <TabsList className="w-full">
          <TabsTrigger value="config" className="flex-1">
            Config
          </TabsTrigger>
          <TabsTrigger value="runtime" className="flex-1">
            Runtime
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="node-name">Name</Label>
            <Input
              id="node-name"
              value={data.label}
              onChange={(e) => updateNode({ label: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="node-description">Description</Label>
            <Textarea
              id="node-description"
              value={data.description}
              onChange={(e) => updateNode({ description: e.target.value })}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Service type</Label>
            <div className="flex flex-wrap gap-2">
              {allowedServiceTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => updateNode({ serviceType: type })}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-xs capitalize transition-colors',
                    data.serviceType === type
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-muted-foreground',
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Utilization (%)</Label>
            <Slider
              value={[data.utilization]}
              max={100}
              step={1}
              onValueChange={([value]) => handleUtilizationChange(value ?? 0)}
            />
            <Input
              type="number"
              min={0}
              max={100}
              value={data.utilization}
              onChange={(e) =>
                handleUtilizationChange(Number(e.target.value))
              }
              className="w-24"
            />
          </div>
          <div className="space-y-3">
            <Label>Resource config</Label>
            {(Object.keys(configTabMeta) as ConfigTab[]).map((tab) => {
              const meta = configTabMeta[tab]
              return (
                <div key={tab} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {meta.label}
                  </Label>
                  <Input
                    type="number"
                    min={meta.min}
                    max={meta.max}
                    step={meta.step}
                    value={data.config[tab]}
                    onChange={(e) =>
                      patchNodeConfig(node.id, tab, Number(e.target.value))
                    }
                  />
                </div>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="runtime" className="space-y-4">
          <div className="space-y-2">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {(['healthy', 'degraded', 'down'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateNode({ status })}
                  className={cn(
                    'rounded-md border px-3 py-1.5 text-xs capitalize transition-colors',
                    data.status === status
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:border-muted-foreground',
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
            <p className="text-muted-foreground">
              Price: <span className="text-foreground">{data.pricePerHour}</span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Type:{' '}
              <span className="capitalize text-foreground">
                {data.serviceType}
              </span>
            </p>
            <p className="mt-1 text-muted-foreground">
              Node kind:{' '}
              <span className="capitalize text-foreground">{nodeType}</span>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
