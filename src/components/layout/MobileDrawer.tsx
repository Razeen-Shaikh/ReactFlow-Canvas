import { RightPanelContent } from '@/components/layout/RightPanel'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { useAppStore } from '@/store/useAppStore'

export function MobileDrawer() {
  const isOpen = useAppStore((s) => s.isPanelOpen)
  const setPanelOpen = useAppStore((s) => s.setPanelOpen)

  return (
    <Sheet open={isOpen} onOpenChange={setPanelOpen}>
      <SheetContent side="right" className="w-full max-w-sm p-0 lg:hidden">
        <RightPanelContent />
      </SheetContent>
    </Sheet>
  )
}
