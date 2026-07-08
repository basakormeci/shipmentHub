import { getCompany, TRANSFER_STATUS, type TransferItem, type TransferStatus } from '../data/catalog'
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

export function filterTransfers(
  transfers: TransferItem[],
  nodes: StockNode[],
  filters: { search: string; filterStatus: TransferStatus | 'all' },
) {
  const q = filters.search.trim().toLowerCase()
  return transfers
    .filter((x) => {
      if (filters.filterStatus !== 'all' && x.status !== filters.filterStatus) return false
      if (q) {
        const from = getNode(nodes, x.fromNodeId)
        const to = getNode(nodes, x.toNodeId)
        const hay = `${x.transferNo} ${x.trackingNo} ${from ? from.name : ''} ${to ? to.name : ''}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
