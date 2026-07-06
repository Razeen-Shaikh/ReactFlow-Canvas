import { create } from 'zustand'
import type { InspectorTab } from '@/types'

interface AppState {
  selectedAppId: string | null
  selectedNodeId: string | null
  isPanelOpen: boolean
  activeInspectorTab: InspectorTab
  simulateError: boolean
  setSelectedAppId: (id: string) => void
  setSelectedNodeId: (id: string | null) => void
  setPanelOpen: (open: boolean) => void
  togglePanel: () => void
  setActiveInspectorTab: (tab: InspectorTab) => void
  setSimulateError: (value: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  selectedAppId: null,
  selectedNodeId: null,
  isPanelOpen: true,
  activeInspectorTab: 'config',
  simulateError: false,
  setSelectedAppId: (id) =>
    set({ selectedAppId: id, selectedNodeId: null }),
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setPanelOpen: (open) => set({ isPanelOpen: open }),
  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  setActiveInspectorTab: (tab) => set({ activeInspectorTab: tab }),
  setSimulateError: (value) => set({ simulateError: value }),
}))

export const selectSelectedAppId = (state: AppState) => state.selectedAppId
export const selectSelectedNodeId = (state: AppState) => state.selectedNodeId
export const selectIsPanelOpen = (state: AppState) => state.isPanelOpen
export const selectActiveInspectorTab = (state: AppState) =>
  state.activeInspectorTab
