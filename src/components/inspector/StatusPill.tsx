import { statusBadgeVariant, statusIcons, statusLabels } from '@/lib/service-meta'
import { cn } from '@/lib/utils'
import type { NodeStatus } from '@/types'

interface StatusPillProps {
  status: NodeStatus
}

export function StatusPill({ status }: StatusPillProps) {
  const Icon = statusIcons[status]
  const variant = statusBadgeVariant[status]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium',
        variant === 'success' &&
          'bg-emerald-600/90 text-white',
        variant === 'warning' &&
          'bg-amber-500/20 text-amber-400',
        variant === 'danger' &&
          'bg-red-900/80 text-red-300',
      )}
    >
      <Icon className="h-3 w-3" />
      {statusLabels[status]}
    </span>
  )
}
