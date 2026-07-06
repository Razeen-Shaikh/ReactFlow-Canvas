import { NodeInspector } from '@/components/inspector/NodeInspector'
import { useAppStore } from '@/store/useAppStore'

export function RightPanelContent() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="border-b border-[#2a2a2a] px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Node Inspector</h2>
        <p className="text-[10px] text-muted-foreground">
          Press <kbd className="rounded border border-border px-1">P</kbd> to
          toggle
        </p>
      </div>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <NodeInspector />
      </div>
    </div>
  )
}

export function RightPanel() {
  const isPanelOpen = useAppStore((s) => s.isPanelOpen)

  if (!isPanelOpen) return null

  return (
    <aside className="hidden h-full w-80 shrink-0 flex-col border-l border-[#2a2a2a] bg-[#141414] lg:flex xl:w-96">
      <RightPanelContent />
    </aside>
  )
}
