import { AppSelectorDropdown } from '@/components/apps/AppSelectorDropdown'
import { Button } from '@/components/ui/button'
import { useApps } from '@/hooks/useApps'
import { useAppStore } from '@/store/useAppStore'
import { useQueryClient } from '@tanstack/react-query'
import { setSimulateError } from '@/mocks/handlers'
import { ChevronDown, LayoutGrid, Moon, PanelRight, Share2, Sun } from 'lucide-react'
import { serviceIcons } from '@/lib/service-meta'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

export function TopBar() {
  const selectedAppId = useAppStore((s) => s.selectedAppId)
  const simulateError = useAppStore((s) => s.simulateError)
  const setSimulateErrorStore = useAppStore((s) => s.setSimulateError)
  const isPanelOpen = useAppStore((s) => s.isPanelOpen)
  const togglePanel = useAppStore((s) => s.togglePanel)
  const { data: apps } = useApps()
  const queryClient = useQueryClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const selectorRef = useRef<HTMLDivElement>(null)

  const selectedApp = apps?.find((a) => a.id === selectedAppId)
  const AppIcon = selectedApp ? serviceIcons[selectedApp.icon] : LayoutGrid

  const toggleErrorSimulation = () => {
    const next = !simulateError
    setSimulateError(next)
    setSimulateErrorStore(next)
    void queryClient.invalidateQueries()
  }

  return (
    <header className="relative z-40 flex h-12 shrink-0 items-center justify-between border-b border-[#2a2a2a] bg-[#0b0b0b] px-3 md:px-4">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-zinc-900">
          <LayoutGrid className="h-4 w-4" />
        </div>

        <div ref={selectorRef} className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen((o) => !o)}
            className={cn(
              'flex items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#141414] px-3 py-1.5 transition-colors hover:border-zinc-600',
              dropdownOpen && 'border-zinc-500',
            )}
          >
            <AppIcon className="h-3.5 w-3.5 text-blue-400" />
            <span className="max-w-[160px] truncate text-xs font-medium text-white">
              {selectedApp?.name ?? 'Select app'}
            </span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 text-zinc-500 transition-transform',
                dropdownOpen && 'rotate-180',
              )}
            />
          </button>
          <AppSelectorDropdown
            open={dropdownOpen}
            onClose={() => setDropdownOpen(false)}
            anchorRef={selectorRef}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'hidden h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white lg:inline-flex',
            isPanelOpen && 'bg-white/10 text-white',
          )}
          onClick={togglePanel}
          aria-label="Toggle inspector panel"
          title="Toggle panel (P)"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden"
          onClick={togglePanel}
          aria-label="Toggle inspector panel"
        >
          <PanelRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white"
          aria-label="Share"
        >
          <Share2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white"
          onClick={() => setDarkMode((d) => !d)}
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
        <button
          type="button"
          onClick={toggleErrorSimulation}
          className="hidden rounded-md border border-[#2a2a2a] px-2 py-1 text-[10px] text-zinc-500 transition-colors hover:border-zinc-600 hover:text-zinc-300 sm:inline-flex"
          title="Toggle API error simulation"
        >
          {simulateError ? 'Errors on' : 'Errors off'}
        </button>
        <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 text-xs font-semibold text-white transition-opacity hover:opacity-90">
          U
        </div>
      </div>
    </header>
  )
}
