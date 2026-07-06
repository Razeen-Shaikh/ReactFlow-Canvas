import { Skeleton } from '@/components/ui/skeleton'
import { serviceColors, serviceIcons } from '@/lib/service-meta'
import { cn } from '@/lib/utils'
import { useApps } from '@/hooks/useApps'
import { useAppStore } from '@/store/useAppStore'
import { ChevronRight, Plus, Search } from 'lucide-react'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function AppList() {
  const { data: apps, isLoading, isError, error } = useApps()
  const selectedAppId = useAppStore((s) => s.selectedAppId)
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (apps?.length && !selectedAppId) {
      setSelectedAppId(apps[0]!.id)
    }
  }, [apps, selectedAppId, setSelectedAppId])

  const filtered = apps?.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="flex flex-col border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Application</h2>
      </div>
      <div className="flex items-center gap-2 px-4 pb-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search apps..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
        <Button size="icon" className="h-8 w-8 shrink-0" variant="default">
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="max-h-48 overflow-y-auto px-2 pb-3">
        {isLoading && (
          <div className="space-y-2 px-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        )}
        {isError && (
          <p className="px-2 text-xs text-destructive">
            {error instanceof Error ? error.message : 'Failed to load apps'}
          </p>
        )}
        {filtered?.map((app) => {
          const Icon = serviceIcons[app.icon]
          const isActive = app.id === selectedAppId
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => setSelectedAppId(app.id)}
              className={cn(
                'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors',
                isActive
                  ? 'bg-primary/20 text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
              )}
            >
              <Icon className={cn('h-4 w-4', serviceColors[app.icon])} />
              <span className="flex-1 truncate">{app.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
            </button>
          )
        })}
      </div>
    </div>
  )
}
