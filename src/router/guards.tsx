import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useUsersStore } from '../stores/usersStore'
import { useDataStore } from '../stores/dataStore'
import { setActiveUserEmail } from '../lib/activeUser'

export function RequireAuth({ children }: { children: ReactNode }) {
  const loggedIn = useAuthStore((s) => s.loggedIn)
  const userId = useAuthStore((s) => s.userId)
  const users = useUsersStore((s) => s.users)
  const location = useLocation()
  const [readyForUserId, setReadyForUserId] = useState<number | null>(null)

  useEffect(() => {
    if (!loggedIn || userId == null) return
    const user = users.find((u) => u.id === userId)
    if (!user) return
    let cancelled = false
    setActiveUserEmail(user.email)
    Promise.resolve(useDataStore.persist.rehydrate()).then(() => {
      if (!cancelled) setReadyForUserId(userId)
    })
    return () => {
      cancelled = true
    }
  }, [loggedIn, userId, users])

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }
  if (readyForUserId !== userId) {
    return null
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
