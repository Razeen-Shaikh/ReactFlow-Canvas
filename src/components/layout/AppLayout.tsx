import { GraphCanvas } from '@/components/canvas/GraphCanvas'
import { KeyboardShortcuts } from '@/components/layout/KeyboardShortcuts'
import { LeftRail } from '@/components/layout/LeftRail'
import { MobileDrawer } from '@/components/layout/MobileDrawer'
import { RightPanel } from '@/components/layout/RightPanel'
import { TopBar } from '@/components/layout/TopBar'
import { ReactFlowProvider } from '@xyflow/react'

export function AppLayout() {
  return (
    <ReactFlowProvider>
      <KeyboardShortcuts />
      <div className="flex h-svh flex-col overflow-hidden bg-[#0b0b0b]">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <LeftRail />
          <main className="relative min-w-0 flex-1">
            <GraphCanvas />
          </main>
          <RightPanel />
        </div>
        <MobileDrawer />
      </div>
    </ReactFlowProvider>
  )
}
