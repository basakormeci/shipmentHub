import type { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'

const TAB_DEFAULTS = {
  routing: ['rules', 'weights', 'scoring', 'history'] as const,
  monitoring: ['health', 'errors', 'webhooks'] as const,
  finance: ['setup', 'invoices', 'quotas'] as const,
}

type TabGroup = keyof typeof TAB_DEFAULTS

/** Redirects illegal `:tab` path params to the group's default tab. */
export function TabGuard({ group, children }: { group: TabGroup; children: ReactNode }) {
  const { tab } = useParams<{ tab: string }>()
  const allowed = TAB_DEFAULTS[group]
  const fallback = allowed[0]

  if (!tab || !(allowed as readonly string[]).includes(tab)) {
    return <Navigate to={`/${group}/${fallback}`} replace />
  }

  return children
}

export { TAB_DEFAULTS }
