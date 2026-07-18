import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SEED_USERS, type User } from '../data/seed'

// The account directory (who can log in) is intentionally NOT part of the per-user
// namespaced dataStore: it must be readable before any user is logged in (login itself
// looks a user up here), and it's shared/global by nature, not per-user business data.
interface UsersState {
  users: User[]
  upsertUser: (input: Omit<User, 'id' | 'lastLogin'> & { id?: number | null; lastLogin?: string }) => User
  toggleUserStatus: (id: number) => User | null
  removeUser: (id: number) => User | null
}

function nextId<T extends { id: number }>(rows: T[]) {
  return Math.max(0, ...rows.map((r) => r.id)) + 1
}

export const useUsersStore = create<UsersState>()(
  persist(
    (set, get) => ({
      users: SEED_USERS,

      upsertUser: (input) => {
        if (input.id == null) {
          const user: User = {
            id: nextId(get().users),
            name: input.name,
            email: input.email,
            role: input.role,
            status: input.status,
            lastLogin: input.lastLogin ?? '-',
          }
          set({ users: [...get().users, user] })
          return user
        }
        set({
          users: get().users.map((u) =>
            u.id === input.id ? { ...u, name: input.name, email: input.email, role: input.role, status: input.status } : u,
          ),
        })
        return get().users.find((u) => u.id === input.id)!
      },
      toggleUserStatus: (id) => {
        let updated: User | null = null
        set({
          users: get().users.map((u) => {
            if (u.id !== id) return u
            updated = { ...u, status: u.status === 'active' ? 'passive' : 'active' }
            return updated
          }),
        })
        return updated
      },
      removeUser: (id) => {
        const user = get().users.find((u) => u.id === id) ?? null
        set({ users: get().users.filter((u) => u.id !== id) })
        return user
      },
    }),
    {
      name: 'shipment-hub:users',
      storage: createJSONStorage(() => localStorage),
      version: 1,
    },
  ),
)
