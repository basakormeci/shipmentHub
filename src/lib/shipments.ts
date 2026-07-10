import {
  SHIPMENT_STATUS,
  getCompany,
  type Shipment,
  type ShipmentStatus,
} from '../data/catalog'

export const SHIPMENT_PAGE_SIZE = 8

export const SHIPMENT_CHANNELS = ['Trendyol', 'Hepsiburada', 'N11', 'Kendi Web Sitesi'] as const

export const SHIPMENT_SEARCH_FIELDS = [
  { key: 'shipmentNo' as const },
  { key: 'orderNo' as const },
  { key: 'trackingNo' as const },
  { key: 'referenceId' as const },
  { key: 'customerName' as const },
]

export type ShipmentColumnKey =
  | 'shipmentNo'
  | 'orderNo'
  | 'companyId'
  | 'trackingNo'
  | 'shipFrom'
  | 'shipTo'
  | 'shipTime'
  | 'status'
  | 'cargoType'
  | 'referenceId'
  | 'packageNo'
  | 'customerName'
  | 'channel'
  | 'addressLine'
  | 'recipientPhone'
  | 'recipientEmail'
  | 'deliveryNote'

export const SHIPMENT_COLUMNS: { key: ShipmentColumnKey }[] = [
  { key: 'shipmentNo' },
  { key: 'orderNo' },
  { key: 'companyId' },
  { key: 'trackingNo' },
  { key: 'shipFrom' },
  { key: 'shipTo' },
  { key: 'shipTime' },
  { key: 'status' },
  { key: 'cargoType' },
  { key: 'referenceId' },
  { key: 'packageNo' },
  { key: 'customerName' },
  { key: 'channel' },
  { key: 'addressLine' },
  { key: 'recipientPhone' },
  { key: 'recipientEmail' },
  { key: 'deliveryNote' },
]

export type ShipmentSearchField = (typeof SHIPMENT_SEARCH_FIELDS)[number]['key']

export type ShipmentListFilters = {
  search: string
  searchField: ShipmentSearchField
  filterStatus: ShipmentStatus | 'all'
  filterSupplierId: string
  filterCargoType: '' | 'order' | 'return'
  dateFrom: string
  dateTo: string
  page: number
  visibleColumns: Partial<Record<ShipmentColumnKey, boolean>>
}

const PRODUCT_POOL = [
  { name: 'Adela Elbise', variant: 'Yeşil - 36', sku: 'GLOND3005212952186', barcode: 'GLOND3005212952186', originalPrice: 650, price: 450, color: '#7d9a6f' },
  { name: 'Milano Gömlek', variant: 'Beyaz - M', sku: 'MLNGML2231458821', barcode: 'MLNGML2231458821', originalPrice: 380, price: 380, color: '#c9c3b8' },
  { name: 'Vera Ceket', variant: 'Lacivert - 40', sku: 'VRCKT7743210098', barcode: 'VRCKT7743210098', originalPrice: 1200, price: 899, color: '#3b4a6b' },
  { name: 'Luna Pantolon', variant: 'Siyah - 38', sku: 'LNPNT9012345671', barcode: 'LNPNT9012345671', originalPrice: 540, price: 540, color: '#2b2b2b' },
  { name: 'Nova Kazak', variant: 'Gri - L', sku: 'NVKZK5566778812', barcode: 'NVKZK5566778812', originalPrice: 420, price: 299, color: '#9a9a9a' },
  { name: 'Aria Etek', variant: 'Bordo - 34', sku: 'ARETK3344556677', barcode: 'ARETK3344556677', originalPrice: 350, price: 350, color: '#7a2b3a' },
]

export function packageItemsFor(shipmentId: number) {
  const primary = { ...PRODUCT_POOL[shipmentId % PRODUCT_POOL.length], qty: 1 + (shipmentId % 2) }
  const items = [primary]
  if (shipmentId % 3 === 0) {
    items.push({ ...PRODUCT_POOL[(shipmentId + 2) % PRODUCT_POOL.length], qty: 1 })
  }
  return items
}

export function desiKgFor(shipmentId: number) {
  const desi = 3 + ((shipmentId * 7) % 25)
  const weight = (1.5 + (shipmentId % 9) * 0.8).toFixed(1)
  return { desi, weight }
}

export function emailFor(name: string) {
  const ascii = name
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/i̇/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
  return `${ascii.trim().split(/\s+/).join('.')}@example.com`
}

export function phoneFor(shipmentId: number) {
  return `+90 5${String(30000000 + shipmentId * 777).padStart(8, '0')}`
}

const STREET_POOL = ['Atatürk', 'Cumhuriyet', 'İstiklal', 'Barış', 'Gül', 'Menekşe', 'Çınar', 'Papatya']

export function addressLineFor(shipmentId: number, district: string) {
  const street = STREET_POOL[shipmentId % STREET_POOL.length]
  const no = 1 + (shipmentId % 60)
  const daire = 1 + (shipmentId % 8)
  return `${district} Mahallesi, ${street} Sokak No: ${no} Daire: ${daire}`
}

export function recipientAddressLine(shipment: Shipment) {
  return shipment.shipTo.addressLine || addressLineFor(shipment.id, shipment.shipTo.district)
}

export function recipientPhone(shipment: Shipment) {
  return shipment.shipTo.phone || phoneFor(shipment.id)
}

export function recipientEmail(shipment: Shipment) {
  return shipment.shipTo.email || emailFor(shipment.customerName)
}

export function generateTrackingNo(companyId: number) {
  const co = getCompany(companyId)
  const prefix = co ? co.name.replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase() : 'TRK'
  return `${prefix}-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000000) + 1000000}`
}

export function filterShipments(shipments: Shipment[], filters: ShipmentListFilters) {
  const q = filters.search.trim().toLowerCase()
  return shipments.filter((s) => {
    if (filters.filterStatus !== 'all' && s.status !== filters.filterStatus) return false
    if (filters.filterSupplierId && s.companyId !== +filters.filterSupplierId) return false
    if (filters.filterCargoType && s.cargoType !== filters.filterCargoType) return false
    if (filters.dateFrom && s.shipTime.slice(0, 10) < filters.dateFrom) return false
    if (filters.dateTo && s.shipTime.slice(0, 10) > filters.dateTo) return false
    if (q && !String(s[filters.searchField] ?? '').toLowerCase().includes(q)) return false
    return true
  })
}

export function buildPaginationNumbers(current: number, total: number): (number | '...')[] {
  const pages: (number | '...')[] = []
  if (total <= 7) {
    for (let p = 1; p <= total; p++) pages.push(p)
    return pages
  }
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export function getStatusTabs() {
  return [
    { key: 'all' as const },
    ...(Object.keys(SHIPMENT_STATUS) as ShipmentStatus[]).map((key) => ({ key })),
  ]
}

export function csvEscape(val: unknown) {
  const s = String(val ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportShipmentsCsv(
  list: Shipment[],
  statusLabel: (key: ShipmentStatus) => string,
  cargoTypeLabel: (type: 'order' | 'return') => string,
  columnLabel: (key: ShipmentColumnKey) => string,
  lang: 'tr' | 'en',
) {
  const headers = SHIPMENT_COLUMNS.map((c) => columnLabel(c.key))
  const rows = list.map((s) => [
    s.shipmentNo,
    s.orderNo,
    getCompany(s.companyId)?.name || '',
    s.trackingNo,
    s.shipFrom,
    `${s.shipTo.district} / ${s.shipTo.province}`,
    s.shipTime,
    statusLabel(s.status),
    cargoTypeLabel(s.cargoType),
    s.referenceId,
    s.packageNo,
    s.customerName,
    s.channel,
    recipientAddressLine(s),
    recipientPhone(s),
    recipientEmail(s),
    s.deliveryNote || '',
  ])
  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${lang === 'tr' ? 'gonderiler' : 'shipments'}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
