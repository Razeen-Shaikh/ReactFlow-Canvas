import { Button } from '@/components/ui/button'
import type { GraphNodeType } from '@/types'
import { Database, Plus, Server } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface CanvasToolbarProps {
  onAddNode: (type: GraphNodeType) => void
}

export function CanvasToolbar({ onAddNode }: CanvasToolbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current?.contains(event.target as HTMLElement)) return
      setMenuOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const handleAdd = (type: GraphNodeType) => {
    onAddNode(type)
    setMenuOpen(false)
  }

  return (
    <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
      <div className="relative" ref={menuRef}>
        <Button
          size="sm"
          onClick={() => setMenuOpen((open) => !open)}
          className="gap-2 bg-[#141414] text-white shadow-lg hover:bg-[#1f1f1f]"
        >
          <Plus className="h-4 w-4" />
          Add Node
        </Button>

        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-44 overflow-hidden rounded-lg border border-[#2a2a2a] bg-[#141414] shadow-xl">
            <button
              type="button"
              onClick={() => handleAdd('service')}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-white/5"
            >
              <Server className="h-4 w-4 text-violet-400" />
              Service Node
            </button>
            <button
              type="button"
              onClick={() => handleAdd('db')}
              className={cn(
                'flex w-full items-center gap-2 border-t border-[#2a2a2a] px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-white/5',
              )}
            >
              <Database className="h-4 w-4 text-blue-400" />
              DB Node
            </button>
          </div>
        )}
      </div>

      <p className="hidden text-[10px] text-zinc-500 sm:block">
        <kbd className="rounded border border-[#2a2a2a] px-1">F</kbd> fit ·{' '}
        <kbd className="rounded border border-[#2a2a2a] px-1">P</kbd> panel
      </p>
    </div>
  )
}
