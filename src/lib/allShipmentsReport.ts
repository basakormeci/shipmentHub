import {
  actualDeliveryDate,
  actualReturnDate,
  actualTransferDate,
  getCompany,
  plannedDeliveryDate,
  plannedReturnDate,
  plannedTransferDate,
  type CarrierInvoice,
  type ReturnItem,
  type ReturnStatus,
  type Shipment,
  type ShipmentStatus,
  type TransferItem,
} from '../data/catalog'
import { csvEscape } from './shipments'
import { fmtDateTimeStr } from './format'
import type { StockNode } from '../data/seed'

export const ALL_SHIPMENTS_REPORT_PAGE_SIZE = 20

export type UnifiedKind = 'order' | 'return' | 'transfer'

export const UNIFIED_KINDS: { key: UnifiedKind }[] = [{ key: 'order' }, { key: 'return' }, { key: 'transfer' }]

export const UNIFIED_KIND_LABELS: Record<UnifiedKind, string> = {
  order: 'Sipariş Gönderisi',
  return: 'İade Gönderisi',
  transfer: 'Transfer Gönderisi',
}

export interface UnifiedShipmentRow {
  key: string
  kind: UnifiedKind
  no: number
  companyId: number
  companyName: string
  trackingNo: string
  referenceId: string
  packageNo: string
  date: string
  status: ShipmentStatus | ReturnStatus
  customerName: string
  origin: string
  destination: string
  province: string | null
  expectedCost: number | null
  realCost: number | null
  expectedDeliveryDays: number | null
  actualDeliveryDays: number | null
}

function daysBetween(fromIso: string, toIso: string): number {
  return (new Date(toIso).getTime() - new Date(fromIso).getTime()) / 86400000
}

function findInvoice(invoices: CarrierInvoice[], kind: UnifiedKind, no: number): CarrierInvoice | undefined {
  return invoices.find(
    (i) => (kind === 'order' && i.shipmentNo === no) || (kind === 'return' && i.returnNo === no) || (kind === 'transfer' && i.transferNo === no),
  )
}

export function buildUnifiedRows(
  shipments: Shipment[],
  returns: ReturnItem[],
  transfers: TransferItem[],
  nodes: StockNode[],
  carrierInvoices: CarrierInvoice[],
): UnifiedShipmentRow[] {
  const orderRows: UnifiedShipmentRow[] = shipments
    .filter((s) => s.cargoType === 'order')
    .map((s) => {
      const invoice = findInvoice(carrierInvoices, 'order', s.shipmentNo)
      const actual = actualDeliveryDate(s)
      return {
        key: `order-${s.id}`,
        kind: 'order',
        no: s.shipmentNo,
        companyId: s.companyId,
        companyName: getCompany(s.companyId)?.name ?? 'Bilinmiyor',
        trackingNo: s.trackingNo,
        referenceId: s.referenceId,
        packageNo: s.packageNo,
        date: s.shipTime,
        status: s.status,
        customerName: s.customerName,
        origin: s.shipFrom,
        destination: `${s.shipTo.district} / ${s.shipTo.province}`,
        province: s.shipTo.province,
        expectedCost: invoice?.expectedCost ?? null,
        realCost: invoice?.realCost ?? null,
        expectedDeliveryDays: daysBetween(s.shipTime, plannedDeliveryDate(s)),
        actualDeliveryDays: actual ? daysBetween(s.shipTime, actual) : null,
      }
    })

  const returnRows: UnifiedShipmentRow[] = returns.map((r) => {
    const invoice = findInvoice(carrierInvoices, 'return', r.returnNo)
    const actual = actualReturnDate(r)
    return {
      key: `return-${r.id}`,
      kind: 'return',
      no: r.returnNo,
      companyId: r.companyId,
      companyName: getCompany(r.companyId)?.name ?? 'Bilinmiyor',
      trackingNo: r.trackingNo,
      referenceId: r.referenceId,
      packageNo: r.packageNo,
      date: r.requestDate,
      status: r.status,
      customerName: r.customerName,
      origin: r.shipFrom,
      destination: `${r.shipTo.district} / ${r.shipTo.province}`,
      province: r.shipTo.province,
      expectedCost: invoice?.expectedCost ?? null,
      realCost: invoice?.realCost ?? null,
      expectedDeliveryDays: daysBetween(r.requestDate, plannedReturnDate(r)),
      actualDeliveryDays: actual ? daysBetween(r.requestDate, actual) : null,
    }
  })

  const transferRows: UnifiedShipmentRow[] = transfers.map((x) => {
    const from = nodes.find((n) => n.id === x.fromNodeId)
    const to = nodes.find((n) => n.id === x.toNodeId)
    const invoice = findInvoice(carrierInvoices, 'transfer', x.transferNo)
    const actual = actualTransferDate(x)
    return {
      key: `transfer-${x.id}`,
      kind: 'transfer',
      no: x.transferNo,
      companyId: x.companyId,
      companyName: getCompany(x.companyId)?.name ?? 'Bilinmiyor',
      trackingNo: x.trackingNo,
      referenceId: x.referenceId,
      packageNo: x.packageNo,
      date: x.createdAt,
      status: x.status,
      customerName: '',
      origin: from?.name ?? '',
      destination: to?.name ?? '',
      province: null,
      expectedCost: invoice?.expectedCost ?? null,
      realCost: invoice?.realCost ?? null,
      expectedDeliveryDays: daysBetween(x.createdAt, plannedTransferDate(x)),
      actualDeliveryDays: actual ? daysBetween(x.createdAt, actual) : null,
    }
  })

  return [...orderRows, ...returnRows, ...transferRows].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export type UnifiedColumnKey =
  | 'kind'
  | 'no'
  | 'companyId'
  | 'trackingNo'
  | 'referenceId'
  | 'packageNo'
  | 'date'
  | 'status'
  | 'customerName'
  | 'origin'
  | 'destination'
  | 'expectedDeliveryDays'
  | 'actualDeliveryDays'
  | 'expectedCost'
  | 'realCost'

export const UNIFIED_COLUMNS: { key: UnifiedColumnKey }[] = [
  { key: 'kind' },
  { key: 'no' },
  { key: 'companyId' },
  { key: 'trackingNo' },
  { key: 'referenceId' },
  { key: 'packageNo' },
  { key: 'date' },
  { key: 'status' },
  { key: 'customerName' },
  { key: 'origin' },
  { key: 'destination' },
  { key: 'expectedDeliveryDays' },
  { key: 'actualDeliveryDays' },
  { key: 'expectedCost' },
  { key: 'realCost' },
]

export const UNIFIED_COLUMN_LABELS: Record<UnifiedColumnKey, string> = {
  kind: 'Tip',
  no: 'No',
  companyId: 'Kargo Firması',
  trackingNo: 'Takip No',
  referenceId: 'Referans',
  packageNo: 'Paket No',
  date: 'Tarih',
  status: 'Durum',
  customerName: 'Müşteri',
  origin: 'Nereden',
  destination: 'Nereye',
  expectedDeliveryDays: 'Beklenen Teslimat Süresi',
  actualDeliveryDays: 'Gerçekleşen Teslimat Süresi',
  expectedCost: 'Beklenen Maliyet',
  realCost: 'Gerçekleşen Maliyet',
}

export function unifiedStatusLabel(row: UnifiedShipmentRow, t: (key: string) => string): string {
  return row.kind === 'return' ? t(`returnStatus.${row.status}`) : t(`status.${row.status}`)
}

function fmtCurrency(n: number): string {
  return `₺${Math.round(n).toLocaleString('tr-TR')}`
}

export function unifiedCellValue(row: UnifiedShipmentRow, key: UnifiedColumnKey, statusLabel: (row: UnifiedShipmentRow) => string): string {
  switch (key) {
    case 'kind':
      return UNIFIED_KIND_LABELS[row.kind]
    case 'no':
      return String(row.no)
    case 'companyId':
      return row.companyName
    case 'trackingNo':
      return row.trackingNo
    case 'referenceId':
      return row.referenceId
    case 'packageNo':
      return row.packageNo
    case 'date':
      return fmtDateTimeStr(row.date)
    case 'status':
      return statusLabel(row)
    case 'customerName':
      return row.customerName || '-'
    case 'origin':
      return row.origin
    case 'destination':
      return row.destination
    case 'expectedDeliveryDays':
      return row.expectedDeliveryDays != null ? `${row.expectedDeliveryDays.toFixed(1)} gün` : '-'
    case 'actualDeliveryDays':
      return row.actualDeliveryDays != null ? `${row.actualDeliveryDays.toFixed(1)} gün` : '-'
    case 'expectedCost':
      return row.expectedCost != null ? fmtCurrency(row.expectedCost) : '-'
    case 'realCost':
      return row.realCost != null ? fmtCurrency(row.realCost) : '-'
  }
}

export function exportUnifiedShipmentsCsv(
  rows: UnifiedShipmentRow[],
  columns: { key: UnifiedColumnKey }[],
  statusLabel: (row: UnifiedShipmentRow) => string,
) {
  const headers = columns.map((c) => UNIFIED_COLUMN_LABELS[c.key])
  const dataRows = rows.map((r) => columns.map((c) => unifiedCellValue(r, c.key, statusLabel)))
  const csv = [headers, ...dataRows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `tum-gonderiler_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
