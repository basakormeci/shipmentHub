import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export function RequireAuth({ children }: { children: ReactNode }) {
  const loggedIn = useAuthStore((s) => s.loggedIn)
  const location = useLocation()
  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  return children
}

export function PublicOnly({ children }: { children: ReactNode }) {
  const loggedIn = useAuthStore((s) => s.loggedIn)
  if (loggedIn) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
