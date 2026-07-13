import { RETURN_STATUS, getCompany, type ReturnItem, type ReturnStatus, type Shipment } from '../data/catalog'

export function getReturnStatusTabs(): { key: ReturnStatus | 'all' }[] {
  return [{ key: 'all' }, ...(Object.keys(RETURN_STATUS) as ReturnStatus[]).map((key) => ({ key }))]
}

export function getOriginalShipment(shipments: Shipment[], id: number) {
  return shipments.find((s) => s.id === id) ?? null
}

export function getReturnCompanyId(item: ReturnItem, shipments: Shipment[]) {
  if (item.companyId != null) return item.companyId
  const orig = getOriginalShipment(shipments, item.originalShipmentId)
  return orig?.companyId ?? null
}

export const RETURN_REASONS = ['begenmedim', 'yanlis_urun', 'kusurlu', 'degisim', 'diger'] as const
export type ReturnReasonKey = (typeof RETURN_REASONS)[number]

export const RETURN_SEARCH_FIELDS = [
  { key: 'returnNo' as const },
  { key: 'shipmentNo' as const },
  { key: 'customerName' as const },
]
export type ReturnSearchField = (typeof RETURN_SEARCH_FIELDS)[number]['key']

export type ReturnColumnKey = 'returnNo' | 'original' | 'carrier' | 'reason' | 'requestDate' | 'status'

export const RETURN_COLUMNS: { key: ReturnColumnKey }[] = [
  { key: 'returnNo' },
  { key: 'original' },
  { key: 'carrier' },
  { key: 'reason' },
  { key: 'requestDate' },
  { key: 'status' },
]

export type ReturnListFilters = {
  search: string
  searchField: ReturnSearchField
  filterStatus: ReturnStatus | 'all'
  filterCompanyId: string
  filterReason: string
  dateFrom: string
  dateTo: string
}

function searchValueFor(x: ReturnItem, shipments: Shipment[], field: ReturnSearchField): string {
  if (field === 'returnNo') return String(x.returnNo)
  const orig = getOriginalShipment(shipments, x.originalShipmentId)
  if (field === 'shipmentNo') return orig ? String(orig.shipmentNo) : ''
  if (field === 'customerName') return orig ? orig.customerName : ''
  return ''
}

export function filterReturns(returns: ReturnItem[], shipments: Shipment[], filters: ReturnListFilters) {
  const q = filters.search.trim().toLowerCase()
  return returns.filter((x) => {
    if (filters.filterStatus !== 'all' && x.status !== filters.filterStatus) return false
    if (filters.filterCompanyId) {
      const companyId = getReturnCompanyId(x, shipments)
      if (String(companyId ?? '') !== filters.filterCompanyId) return false
    }
    if (filters.filterReason && x.reason !== filters.filterReason) return false
    if (filters.dateFrom && x.requestDate.slice(0, 10) < filters.dateFrom) return false
    if (filters.dateTo && x.requestDate.slice(0, 10) > filters.dateTo) return false
    if (q && !searchValueFor(x, shipments, filters.searchField).toLowerCase().includes(q)) return false
    return true
  })
}

function csvEscape(val: unknown) {
  const s = String(val ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportReturnsCsv(
  list: ReturnItem[],
  shipments: Shipment[],
  statusLabel: (key: ReturnStatus) => string,
  reasonLabel: (key: string) => string,
  columnLabel: (key: ReturnColumnKey) => string,
  lang: 'tr' | 'en',
) {
  const headers = RETURN_COLUMNS.map((c) => columnLabel(c.key))
  const rows = list.map((x) => {
    const orig = getOriginalShipment(shipments, x.originalShipmentId)
    const companyId = getReturnCompanyId(x, shipments)
    const co = companyId != null ? getCompany(companyId) : null
    return [
      x.returnNo,
      orig ? `#${orig.shipmentNo}` : '',
      co ? co.name : '',
      reasonLabel(x.reason),
      x.requestDate,
      statusLabel(x.status),
    ]
  })
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
