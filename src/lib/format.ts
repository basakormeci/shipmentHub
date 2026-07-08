/** Date/time helpers ported from the monolith. */

export function fmtDate(d?: string | null): string {
  return d ? new Date(d).toLocaleDateString('tr-TR') : '-'
}

export function fmtDateTime(iso: string): { time: string; date: string } {
  const d = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return {
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    date: `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`,
  }
}

export function fmtDateTimeStr(iso: string): string {
  const { time, date } = fmtDateTime(iso)
  return `${time} · ${date}`
}

export function relativeTimeTr(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'az önce'
  if (mins < 60) return `${mins} dk önce`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} sa önce`
  const days = Math.floor(hours / 24)
  return `${days} gün önce`
}
