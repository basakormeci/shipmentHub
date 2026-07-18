// Synchronous, non-reactive holder for the currently active user's email. Read by the
// per-user storage adapter (userDataRepository) at getItem/setItem time, which happens
// outside React's render cycle — a plain module variable, not a Zustand store, is what
// gives that adapter zero-latency synchronous access to "who is logged in right now".
let activeEmail: string | null = null

export function getActiveUserEmail(): string | null {
  return activeEmail
}

export function setActiveUserEmail(email: string | null): void {
  activeEmail = email ? email.toLowerCase() : null
}
