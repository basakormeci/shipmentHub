import type { StateStorage } from 'zustand/middleware'
import { storageService } from './storageService'
import { getActiveUserEmail } from './activeUser'
import { createInitialDataForUser, LEGACY_SEEDED_EMAILS, type UserDataBlob } from './initialDataFactory'
import { migrateDataState } from './dataMigrations'

// The single shared key every user used to read/write before per-user isolation.
const LEGACY_SHARED_KEY = 'shipment-hub:v1'
const LEGACY_SHARED_VERSION = 7

const KEY_PREFIX = 'shipment-hub:data:'

// Bumped alongside dataStore.ts's own `persist` `version` option — both must agree so a
// synthesized envelope returned by getItem below is never mistaken for a stale version
// and routed through zustand's migrate branch.
export const CURRENT_DATA_VERSION = 9

export function keyFor(email: string): string {
  return `${KEY_PREFIX}${email.toLowerCase()}`
}

interface LegacyEnvelope {
  state?: Record<string, unknown>
  version?: number
}

// Original demo accounts get a one-time, lazily-taken copy of whatever the shared blob
// looked like at the moment of their own first login under the new scheme (each account
// migrates independently; the legacy key itself is never mutated further afterwards).
// Everyone else (kemal, or any future account) gets a genuinely blank workspace.
export function resolveInitialData(email: string): UserDataBlob {
  const normalized = email.toLowerCase()
  if (LEGACY_SEEDED_EMAILS.has(normalized)) {
    const legacy = storageService.read<LegacyEnvelope>(LEGACY_SHARED_KEY)
    if (legacy?.state) {
      const migrated =
        typeof legacy.version === 'number' && legacy.version < LEGACY_SHARED_VERSION
          ? migrateDataState(legacy.state, legacy.version)
          : legacy.state
      const { users: _users, ...rest } = migrated as Record<string, unknown> & { users?: unknown }
      return rest as unknown as UserDataBlob
    }
  }
  return createInitialDataForUser(email)
}

export function saveUserData(email: string, data: UserDataBlob): void {
  storageService.write(keyFor(email), { state: data, version: CURRENT_DATA_VERSION })
}

export function clearUserData(email: string): void {
  storageService.remove(keyFor(email))
}

// Raw Storage-shaped adapter (matches localStorage's plain string get/set/remove), meant
// to be wrapped with `createJSONStorage(() => userScopedRawStorage)` exactly like the
// app's previous `createJSONStorage(() => localStorage)`. The `key` argument zustand
// passes in (the fixed `name` from the persist config) is intentionally ignored — the
// real key is always resolved from the currently active user instead.
//
// getItem never returns null for a resolved user: zustand's persist `merge` collapses to
// a no-op (silently keeps whatever is already in memory) whenever getItem resolves to
// null, which would leak the previous user's data into a brand-new user's first load. By
// synthesizing + persisting + returning a real envelope on first access, every load is
// guaranteed to go through `merge` with that user's real initial data.
export const userScopedRawStorage: StateStorage = {
  getItem: (_key) => {
    const email = getActiveUserEmail()
    if (!email) return null
    const storageKey = keyFor(email)
    const existing = storageService.readRaw(storageKey)
    if (existing != null) return existing
    const initial = resolveInitialData(email)
    const envelope = JSON.stringify({ state: initial, version: CURRENT_DATA_VERSION })
    storageService.writeRaw(storageKey, envelope)
    return envelope
  },
  setItem: (_key, value) => {
    const email = getActiveUserEmail()
    if (!email) return
    storageService.writeRaw(keyFor(email), value)
  },
  removeItem: (_key) => {
    const email = getActiveUserEmail()
    if (!email) return
    storageService.remove(keyFor(email))
  },
}
