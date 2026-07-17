import { RETURN_STATUS, getCompany, type ReturnItem, type ReturnStatus } from '../data/catalog'
import { recipientAddressLine, recipientEmail, recipientPhone } from './shipments'

export function getReturnStatusTabs(): { key: ReturnStatus | 'all' }[] {
  return [{ key: 'all' }, ...(Object.keys(RETURN_STATUS) as ReturnStatus[]).map((key) => ({ key }))]
}

export const RETURN_REASONS = ['begenmedim', 'yanlis_urun', 'kusurlu', 'degisim', 'diger'] as const
export type ReturnReasonKey = (typeof RETURN_REASONS)[number]

export interface PickupSlot {
  key: string
  label: string
}

export interface PickupDay {
  date: string
  label: string
  slots: PickupSlot[]
}

const PICKUP_SLOT_POOL: PickupSlot[] = [
  { key: 'morning', label: '09:00 - 12:00' },
  { key: 'noon', label: '12:00 - 15:00' },
  { key: 'afternoon', label: '15:00 - 18:00' },
]

/**
 * Dummy courier-pickup availability for a carrier: starts the day after "today"
 * (a pickup can never be booked for today or earlier), skips Sundays, and varies
 * which time slots are open per day/carrier so the picker looks like real data.
 */
export function getPickupAvailability(companyId: number, count = 6): PickupDay[] {
  const days: PickupDay[] = []
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  cursor.setDate(cursor.getDate() + 1)
  let i = 0
  while (days.length < count) {
    if (cursor.getDay() !== 0) {
      const seed = (companyId * 31 + i * 7) % 3
      const slots = seed === 0 ? PICKUP_SLOT_POOL : seed === 1 ? PICKUP_SLOT_POOL.slice(0, 2) : PICKUP_SLOT_POOL.slice(1)
      days.push({
        date: cursor.toISOString().slice(0, 10),
        label: cursor.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'short' }),
        slots,
      })
    }
    cursor.setDate(cursor.getDate() + 1)
    i++
  }
  return days
}

export const RETURN_SEARCH_FIELDS = [
  { key: 'returnNo' as const },
  { key: 'orderNo' as const },
  { key: 'trackingNo' as const },
  { key: 'referenceId' as const },
  { key: 'customerName' as const },
]
export type ReturnSearchField = (typeof RETURN_SEARCH_FIELDS)[number]['key']

export type ReturnColumnKey =
  | 'returnNo'
  | 'orderNo'
  | 'companyId'
  | 'trackingNo'
  | 'shipFrom'
  | 'shipTo'
  | 'requestDate'
  | 'status'
  | 'reason'
  | 'referenceId'
  | 'packageNo'
  | 'customerName'
  | 'channel'
  | 'addressLine'
  | 'recipientPhone'
  | 'recipientEmail'

export const RETURN_COLUMNS: { key: ReturnColumnKey }[] = [
  { key: 'returnNo' },
  { key: 'orderNo' },
  { key: 'companyId' },
  { key: 'trackingNo' },
  { key: 'shipFrom' },
  { key: 'shipTo' },
  { key: 'requestDate' },
  { key: 'status' },
  { key: 'reason' },
  { key: 'referenceId' },
  { key: 'packageNo' },
  { key: 'customerName' },
  { key: 'channel' },
  { key: 'addressLine' },
  { key: 'recipientPhone' },
  { key: 'recipientEmail' },
]

export type ReturnListFilters = {
  search: string
  searchField: ReturnSearchField
  filterStatus: ReturnStatus | 'all'
  filterCompanyId: string
  filterReason: string
  dateFrom: string
  dateTo: string
  page: number
  visibleColumns: Partial<Record<ReturnColumnKey, boolean>>
}

function searchValueFor(x: ReturnItem, field: ReturnSearchField): string {
  if (field === 'returnNo') return String(x.returnNo)
  if (field === 'orderNo') return String(x.orderNo)
  if (field === 'trackingNo') return x.trackingNo
  if (field === 'referenceId') return x.referenceId
  if (field === 'customerName') return x.customerName
  return ''
}

export function filterReturns(returns: ReturnItem[], filters: ReturnListFilters) {
  const q = filters.search.trim().toLowerCase()
  return returns.filter((x) => {
    if (filters.filterStatus !== 'all' && x.status !== filters.filterStatus) return false
    if (filters.filterCompanyId && String(x.companyId) !== filters.filterCompanyId) return false
    if (filters.filterReason && x.reason !== filters.filterReason) return false
    if (filters.dateFrom && x.requestDate.slice(0, 10) < filters.dateFrom) return false
    if (filters.dateTo && x.requestDate.slice(0, 10) > filters.dateTo) return false
    if (q && !searchValueFor(x, filters.searchField).toLowerCase().includes(q)) return false
    return true
  })
}

function csvEscape(val: unknown) {
  const s = String(val ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportReturnsCsv(
  list: ReturnItem[],
  statusLabel: (key: ReturnStatus) => string,
  reasonLabel: (key: string) => string,
  columnLabel: (key: ReturnColumnKey) => string,
  lang: 'tr' | 'en',
) {
  const headers = RETURN_COLUMNS.map((c) => columnLabel(c.key))
  const rows = list.map((x) => [
    x.returnNo,
    x.orderNo,
    getCompany(x.companyId)?.name || '',
    x.trackingNo,
    x.shipFrom,
    `${x.shipTo.district} / ${x.shipTo.province}`,
    x.requestDate,
    statusLabel(x.status),
    reasonLabel(x.reason),
    x.referenceId,
    x.packageNo,
    x.customerName,
    x.channel,
    recipientAddressLine(x),
    recipientPhone(x),
    recipientEmail(x),
  ])
  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${lang === 'tr' ? 'iadeler' : 'returns'}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
