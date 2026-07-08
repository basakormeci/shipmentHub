import { TRANSFER_STATUS, type TransferItem, type TransferStatus } from '../data/catalog'
import { getCompany } from '../data/catalog'
import type { StockNode } from '../data/seed'

export function getTransferStatusTabs(): { key: TransferStatus | 'all' }[] {
  return [{ key: 'all' }, ...(Object.keys(TRANSFER_STATUS) as TransferStatus[]).map((key) => ({ key }))]
}

export function getNode(nodes: StockNode[], id: number) {
  return nodes.find((n) => n.id === id) ?? null
}

export function generateTransferTrackingNo(companyId: number) {
  const co = getCompany(companyId)
  const prefix = co ? co.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() : 'TRF'
  return `${prefix}-TR-${new Date().getFullYear()}-${Math.floor(Math.random() * 900000) + 100000}`
}

export const TRANSFER_SEARCH_FIELDS = [
  { key: 'transferNo' as const },
  { key: 'trackingNo' as const },
  { key: 'node' as const },
]
export type TransferSearchField = (typeof TRANSFER_SEARCH_FIELDS)[number]['key']

export type TransferColumnKey = 'transferNo' | 'from' | 'to' | 'carrier' | 'desi' | 'status' | 'date'

export const TRANSFER_COLUMNS: { key: TransferColumnKey }[] = [
  { key: 'transferNo' },
  { key: 'from' },
  { key: 'to' },
  { key: 'carrier' },
  { key: 'desi' },
  { key: 'status' },
  { key: 'date' },
]

export type TransferListFilters = {
  search: string
  searchField: TransferSearchField
  filterStatus: TransferStatus | 'all'
  filterCompanyId: string
  dateFrom: string
  dateTo: string
}

function searchValueFor(x: TransferItem, nodes: StockNode[], field: TransferSearchField): string {
  if (field === 'transferNo') return String(x.transferNo)
  if (field === 'trackingNo') return x.trackingNo
  if (field === 'node') {
    const from = getNode(nodes, x.fromNodeId)
    const to = getNode(nodes, x.toNodeId)
    return `${from ? from.name : ''} ${to ? to.name : ''}`
  }
  return ''
}

export function filterTransfers(transfers: TransferItem[], nodes: StockNode[], filters: TransferListFilters) {
  const q = filters.search.trim().toLowerCase()
  return transfers
    .filter((x) => {
      if (filters.filterStatus !== 'all' && x.status !== filters.filterStatus) return false
      if (filters.filterCompanyId && String(x.companyId) !== filters.filterCompanyId) return false
      if (filters.dateFrom && x.createdAt.slice(0, 10) < filters.dateFrom) return false
      if (filters.dateTo && x.createdAt.slice(0, 10) > filters.dateTo) return false
      if (q && !searchValueFor(x, nodes, filters.searchField).toLowerCase().includes(q)) return false
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
