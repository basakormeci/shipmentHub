import { create } from 'zustand'

export type ToastKind = 'success' | 'info' | 'error'

export interface ToastItem {
  id: number
  message: string
  kind: ToastKind
}

interface ToastState {
  items: ToastItem[]
  push: (message: string, kind?: ToastKind) => void
  dismiss: (id: number) => void
}

let seq = 1

export const useToastStore = create<ToastState>((set, get) => ({
  items: [],
  push: (message, kind = 'success') => {
    const id = seq++
    set({ items: [...get().items, { id, message, kind }] })
    window.setTimeout(() => get().dismiss(id), 3500)
  },
  dismiss: (id) => set({ items: get().items.filter((t) => t.id !== id) }),
}))

export function toast(message: string, kind: ToastKind = 'success') {
  useToastStore.getState().push(message, kind)
}
