import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { AUTH_PASSWORD, type User } from '../data/seed'
import { useDataStore } from './dataStore'

interface AuthState {
  loggedIn: boolean
  userId: number | null
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
  currentUser: () => User | null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      loggedIn: false,
      userId: null,
      login: (email, password) => {
        const trimmed = email.trim().toLowerCase()
        if (!trimmed || !password) {
          return { ok: false, error: 'login.error_required' }
        }
        const user = useDataStore.getState().users.find((u) => u.email.toLowerCase() === trimmed)
        if (!user) return { ok: false, error: 'login.error_user' }
        if (password !== AUTH_PASSWORD) return { ok: false, error: 'login.error_password' }
        if (user.status !== 'active') return { ok: false, error: 'login.error_passive' }
        set({ loggedIn: true, userId: user.id })
        return { ok: true }
      },
      logout: () => set({ loggedIn: false, userId: null }),
      currentUser: () => {
        const { userId } = get()
        if (!userId) return null
        return useDataStore.getState().users.find((u) => u.id === userId) ?? null
      },
    }),
    {
      name: 'shipment-hub:auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ loggedIn: s.loggedIn, userId: s.userId }),
      version: 1,
    },
  ),
)
