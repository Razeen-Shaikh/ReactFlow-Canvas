import { StatusPill } from '@/components/inspector/StatusPill'
import { useNodeDataUpdater } from '@/hooks/useNodeDataUpdater'
import { configTabMeta, serviceColors, serviceIcons } from '@/lib/service-meta'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/store/useAppStore'
import type { ConfigTab, GraphNodeType, ServiceNodeData } from '@/types'
import { Handle, Position, type Node, type NodeProps } from '@xyflow/react'
import {
  Cpu,
  Globe,
  HardDrive,
  MemoryStick,
  Settings,
} from 'lucide-react'
import { useState } from 'react'

const tabIcons: Record<ConfigTab, typeof Cpu> = {
  cpu: Cpu,
  memory: MemoryStick,
  disk: HardDrive,
  region: Globe,
}

const variantStyles: Record<
  GraphNodeType,
  {
    badge: string
    accent: string
    card: string
    selected: string
    settingsBtn: string
    typeLabel: string
  }
> = {
  db: {
    badge: 'border-blue-500/40 bg-blue-500/10 text-blue-400',
    accent: 'from-blue-600/20 to-transparent',
    card: 'bg-[#12151c]',
    selected: 'border-blue-500/60 ring-2 ring-blue-500/20',
    settingsBtn: 'border-blue-500/40 text-blue-400 hover:bg-blue-500/10',
    typeLabel: 'DB',
  },
  service: {
    badge: 'border-violet-500/40 bg-violet-500/10 text-violet-400',
    accent: 'from-violet-600/20 to-transparent',
    card: 'bg-[#151218]',
    selected: 'border-violet-500/60 ring-2 ring-violet-500/20',
    settingsBtn: 'border-violet-500/40 text-violet-400 hover:bg-violet-500/10',
    typeLabel: 'Service',
  },
}

function formatMetricValue(tab: ConfigTab, value: number) {
  if (tab === 'region') return String(Math.round(value))
  return value.toFixed(2)
}

function displayMetric(tab: ConfigTab, value: number) {
  return `${formatMetricValue(tab, value)}${tab === 'memory' || tab === 'disk' ? ' GB' : ''}`
}

interface BaseNodeCardProps extends NodeProps<Node<ServiceNodeData>> {
  variant: GraphNodeType
}

export function BaseNodeCard({
  id,
  data,
  selected,
  variant,
}: BaseNodeCardProps) {
  const { patchNodeConfig } = useNodeDataUpdater()
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId)
  const setPanelOpen = useAppStore((s) => s.setPanelOpen)
  const [activeTab, setActiveTab] = useState<ConfigTab>('cpu')
  const styles = variantStyles[variant]
  const Icon = serviceIcons[data.serviceType]
  const tabMeta = configTabMeta[activeTab]
  const currentValue = data.config[activeTab]
  const sliderPercent =
    ((currentValue - tabMeta.min) / (tabMeta.max - tabMeta.min)) * 100

  const openInspector = () => {
    setSelectedNodeId(id)
    setPanelOpen(true)
  }

  return (
    <div
      className={cn(
        'w-[272px] overflow-hidden rounded-xl border shadow-xl',
        styles.card,
        selected ? styles.selected : 'border-[#2a2a2a]',
      )}
    >
      <div
        className={cn(
          'h-1 bg-gradient-to-r',
          styles.accent,
          variant === 'db' ? 'from-blue-500' : 'from-violet-500',
        )}
      />

      <div className="p-3">
        <Handle
          type="target"
          position={Position.Top}
          className="!h-2 !w-2 !border-0 !bg-zinc-500"
        />

        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Icon className={cn('h-5 w-5', serviceColors[data.serviceType])} />
            <div>
              <span className="text-sm font-semibold text-white">
                {data.label}
              </span>
              <span
                className={cn(
                  'ml-2 rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide',
                  styles.badge,
                )}
              >
                {styles.typeLabel}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
              {data.pricePerHour}
            </span>
            <button
              type="button"
              onClick={openInspector}
              className={cn(
                'nodrag nopan flex h-6 w-6 items-center justify-center rounded-md border transition-colors',
                styles.settingsBtn,
              )}
              aria-label="Open inspector"
            >
              <Settings className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-4 gap-1 text-center text-[10px] text-zinc-500">
          {(Object.keys(configTabMeta) as ConfigTab[]).map((tab) => (
            <span key={tab}>{displayMetric(tab, data.config[tab])}</span>
          ))}
        </div>

        <div className="nodrag nopan mb-3 flex items-center gap-0.5 rounded-lg bg-[#1a1a2e] p-0.5">
          {(Object.keys(configTabMeta) as ConfigTab[]).map((tab) => {
            const TabIcon = tabIcons[tab]
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-1 rounded-md px-1 py-1.5 text-[10px] font-medium transition-all',
                  isActive
                    ? 'bg-white text-zinc-900 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200',
                )}
              >
                <TabIcon className="h-3 w-3" />
                {configTabMeta[tab].label}
              </button>
            )
          })}
        </div>

        <div className="nodrag nopan mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <div className="h-1.5 w-full rounded-full bg-gradient-to-r from-blue-500 via-emerald-400 to-orange-500" />
            <input
              type="range"
              min={tabMeta.min}
              max={tabMeta.max}
              step={tabMeta.step}
              value={currentValue}
              onChange={(e) =>
                patchNodeConfig(id, activeTab, Number(e.target.value))
              }
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              aria-label={`${tabMeta.label} slider`}
            />
            <div
              className="pointer-events-none absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-white shadow-md"
              style={{ left: `${sliderPercent}%` }}
            />
          </div>
          <input
            type="number"
            min={tabMeta.min}
            max={tabMeta.max}
            step={tabMeta.step}
            value={formatMetricValue(activeTab, currentValue)}
            onChange={(e) =>
              patchNodeConfig(id, activeTab, Number(e.target.value))
            }
            className="h-7 w-14 rounded-md border border-[#2a2a2a] bg-[#0b0b0b] px-1.5 text-center text-[11px] text-white outline-none focus:border-primary/50"
          />
        </div>

        <div className="flex items-center justify-between">
          <StatusPill status={data.status} />
          <span className="text-[11px] font-bold tracking-tight text-orange-400">
            aws
          </span>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!h-2 !w-2 !border-0 !bg-zinc-500"
        />
      </div>
    </div>
  )
}
