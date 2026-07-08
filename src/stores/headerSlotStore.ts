import type { ReactNode } from 'react'
import { create } from 'zustand'

interface HeaderSlotState {
  subtitle: string | null
  actions: ReactNode | null
  setHeaderSlot: (slot: { subtitle?: string | null; actions?: ReactNode | null }) => void
  clearHeaderSlot: () => void
}

/**
 * Lets a routed page inject a dynamic Topbar subtitle/actions from inside its
 * own component tree (AppShell renders Topbar as a sibling of <Outlet/>, so
 * pages can't reach it via props). Not persisted — resets on navigation via
 * each page's effect cleanup.
 */
export const useHeaderSlotStore = create<HeaderSlotState>((set) => ({
  subtitle: null,
  actions: null,
  setHeaderSlot: (slot) =>
    set({
      subtitle: slot.subtitle ?? null,
      actions: slot.actions ?? null,
    }),
  clearHeaderSlot: () => set({ subtitle: null, actions: null }),
}))
