import { useAppStore } from '@/store/useAppStore'
import { useReactFlow } from '@xyflow/react'
import { useEffect } from 'react'

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false
  const tag = target.tagName
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  )
}

export function useKeyboardShortcuts() {
  const { fitView } = useReactFlow()
  const togglePanel = useAppStore((s) => s.togglePanel)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) return

      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        void fitView({ padding: 0.2, duration: 300 })
        return
      }

      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        togglePanel()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [fitView, togglePanel])
}
