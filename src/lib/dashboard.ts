export function inRange(iso: string, from: string, to: string): boolean {
  const day = iso.slice(0, 10)
  if (from && day < from) return false
  if (to && day > to) return false
  return true
}

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export function lastNDaysRange(n: number): { from: string; to: string } {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - (n - 1))
  return { from: isoDate(from), to: isoDate(to) }
}

/** Equal-length window immediately preceding `from`, for period-over-period deltas. */
export function previousPeriod(from: string, to: string): { from: string; to: string } {
  const fromD = new Date(from)
  const toD = new Date(to)
  const days = Math.round((toD.getTime() - fromD.getTime()) / 86400000) + 1
  const prevTo = new Date(fromD)
  prevTo.setDate(prevTo.getDate() - 1)
  const prevFrom = new Date(prevTo)
  prevFrom.setDate(prevFrom.getDate() - (days - 1))
  return { from: isoDate(prevFrom), to: isoDate(prevTo) }
}

/** % change current vs previous, or null when there's no meaningful baseline. */
export function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? null : null
  return ((current - previous) / previous) * 100
}

export type DateWindow = { from: string; to: string }
