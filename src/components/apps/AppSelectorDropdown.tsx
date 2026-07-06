import { Skeleton } from '@/components/ui/skeleton'
import { serviceColors, serviceIcons } from '@/lib/service-meta'
import { cn } from '@/lib/utils'
import { useApps } from '@/hooks/useApps'
import { useAppStore } from '@/store/useAppStore'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useEffect, useRef, useState, type RefObject } from 'react'

interface AppSelectorDropdownProps {
  open: boolean
  onClose: () => void
  anchorRef?: RefObject<HTMLElement | null>
}

export function AppSelectorDropdown({
  open,
  onClose,
  anchorRef,
}: AppSelectorDropdownProps) {
  const { data: apps, isLoading, isError, error } = useApps()
  const selectedAppId = useAppStore((s) => s.selectedAppId)
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (apps?.length && !selectedAppId) {
      setSelectedAppId(apps[0]!.id)
    }
  }, [apps, selectedAppId, setSelectedAppId])

  useEffect(() => {
    if (!open) return

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (panelRef.current?.contains(target)) return
      if (anchorRef?.current?.contains(target)) return
      onClose()
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open, onClose, anchorRef])

  if (!open) return null

  const filtered = apps?.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-[#2a2a2a] bg-[#141414] shadow-2xl"
    >
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold text-white">Application</h2>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-full rounded-lg border border-[#2a2a2a] bg-[#0b0b0b] pl-8 pr-3 text-xs text-white outline-none placeholder:text-zinc-500 focus:border-primary/50"
            autoFocus
          />
        </div>
        <button
          type="button"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white transition-colors hover:bg-blue-500"
          aria-label="Add application"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="max-h-56 overflow-y-auto px-2 pb-3">
        {isLoading && (
          <div className="space-y-2 px-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}
        {isError && (
          <p className="px-2 text-xs text-red-400">
            {error instanceof Error ? error.message : 'Failed to load apps'}
          </p>
        )}
        {filtered?.map((app) => {
          const AppIcon = serviceIcons[app.icon]
          const isActive = app.id === selectedAppId
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => {
                setSelectedAppId(app.id)
                onClose()
              }}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors',
                isActive
                  ? 'bg-white/10 text-white'
                  : 'text-zinc-400 hover:bg-white/5 hover:text-white',
              )}
            >
              <AppIcon className={cn('h-4 w-4', serviceColors[app.icon])} />
              <span className="flex-1 truncate">{app.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-40" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
