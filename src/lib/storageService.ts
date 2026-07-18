// Single centralized point of raw localStorage access. Every other storage-related
// module (userDataRepository, usersStore, etc.) goes through this instead of touching
// `localStorage` directly, so storage-availability failures (private browsing, quota,
// SSR) are handled in one place.
export const storageService = {
  readRaw(key: string): string | null {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  writeRaw(key: string, value: string): void {
    try {
      localStorage.setItem(key, value)
    } catch {
      // storage unavailable/full — fail silently, matches the app's existing no-crash posture
    }
  },

  read<T>(key: string): T | null {
    const raw = storageService.readRaw(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      return null
    }
  },

  write(key: string, value: unknown): void {
    storageService.writeRaw(key, JSON.stringify(value))
  },

  remove(key: string): void {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  },
}
