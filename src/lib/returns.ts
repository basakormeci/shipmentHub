import { RETURN_STATUS, type ReturnItem, type ReturnStatus, type Shipment } from '../data/catalog'

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

export function filterReturns(
  returns: ReturnItem[],
  shipments: Shipment[],
  filters: { search: string; filterStatus: ReturnStatus | 'all' },
) {
  const q = filters.search.trim().toLowerCase()
  return returns.filter((x) => {
    if (filters.filterStatus !== 'all' && x.status !== filters.filterStatus) return false
    if (q) {
      const orig = getOriginalShipment(shipments, x.originalShipmentId)
      const hay = `${x.returnNo} ${orig ? orig.shipmentNo : ''} ${orig ? orig.orderNo : ''} ${orig ? orig.customerName : ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}
