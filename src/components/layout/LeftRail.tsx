import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  Box,
  Code2,
  Database,
  Layers,
  Leaf,
  Rocket,
} from 'lucide-react'

const railItems = [
  { icon: Code2, label: 'GitHub', color: 'text-white' },
  { icon: Rocket, label: 'Deploy', color: 'text-blue-400' },
  { icon: Layers, label: 'Redis', color: 'text-red-400' },
  { icon: Leaf, label: 'MongoDB', color: 'text-green-400' },
  { icon: Box, label: 'Services', color: 'text-zinc-300' },
  { icon: Database, label: 'Database', color: 'text-amber-400' },
]

export function LeftRail() {
  const [activeIndex, setActiveIndex] = useState(5)

  return (
    <aside className="hidden w-12 shrink-0 flex-col items-center gap-1 border-r border-[#2a2a2a] bg-[#0b0b0b] py-3 md:flex">
      {railItems.map(({ icon: Icon, label, color }, index) => (
        <button
          key={label}
          type="button"
          title={label}
          onClick={() => setActiveIndex(index)}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
            activeIndex === index
              ? 'bg-white/10'
              : 'hover:bg-white/5',
          )}
        >
          <Icon className={cn('h-4 w-4', color)} />
        </button>
      ))}
    </aside>
  )
}
