import {
  getCompany,
  isDamagedFor,
  pickupTimeHoursFor,
  plannedDeliveryDate,
  actualDeliveryDate,
  shipmentDeliveryDays,
  plannedReturnDate,
  actualReturnDate,
  plannedTransferDate,
  actualTransferDate,
  type CarrierInvoice,
  type ReturnItem,
  type Shipment,
  type TransferItem,
} from '../data/catalog'
import { csvEscape } from './shipments'

export type ReportColumnKey =
  | 'volume'
  | 'volumeShare'
  | 'avgDeliveryDays'
  | 'avgPickupHours'
  | 'delivered'
  | 'successRate'
  | 'otdRate'
  | 'damagedRate'
  | 'returnCount'
  | 'returnRate'
  | 'expectedCost'
  | 'realCost'
  | 'costDiff'
  | 'costDiffPct'
  | 'avgCostPerShipment'

export const REPORT_COLUMNS: { key: ReportColumnKey }[] = [
  { key: 'volume' },
  { key: 'volumeShare' },
  { key: 'avgDeliveryDays' },
  { key: 'avgPickupHours' },
  { key: 'delivered' },
  { key: 'successRate' },
  { key: 'otdRate' },
  { key: 'damagedRate' },
  { key: 'returnCount' },
  { key: 'returnRate' },
  { key: 'expectedCost' },
  { key: 'realCost' },
  { key: 'costDiff' },
  { key: 'costDiffPct' },
  { key: 'avgCostPerShipment' },
]

export const REPORT_COLUMN_LABELS: Record<ReportColumnKey, string> = {
  volume: 'Gönderi Sayısı',
  volumeShare: 'Pay',
  avgDeliveryDays: 'Ort. Teslimat Süresi',
  avgPickupHours: 'Ort. Teslim Alma Süresi',
  delivered: 'Teslim Edilen',
  successRate: 'Başarı Oranı',
  otdRate: 'Zamanında Teslimat',
  damagedRate: 'Hasar Oranı',
  returnCount: 'İade Sayısı',
  returnRate: 'İade Oranı',
  expectedCost: 'Beklenen Maliyet',
  realCost: 'Gerçekleşen Maliyet',
  costDiff: 'Maliyet Farkı',
  costDiffPct: 'Maliyet Sapması',
  avgCostPerShipment: 'Gönderi Başı Ort. Maliyet',
}

export interface CarrierReportRow {
  companyId: number
  companyName: string
  volume: number
  volumeShare: number
  avgDeliveryDays: number | null
  avgPickupHours: number | null
  delivered: number
  successRate: number
  otdRate: number
  damagedRate: number
  returnCount: number
  returnRate: number
  expectedCost: number
  realCost: number
  costDiff: number
  costDiffPct: number
  avgCostPerShipment: number
}

/** Same synthetic "how many days delivery took" formula as shipmentDeliveryDays (catalog.ts),
 * generalized to any record id — returns/transfers have no dedicated equivalent since the
 * formula never actually depends on anything but the id. */
function genericDeliveryDays(id: number) {
  return 1 + (id % 4) * 0.5
}

interface RecordMetrics {
  companyId: number
  isFinal: boolean
  isSuccess: boolean
  days: number | null
  onTime: boolean | null
  damaged: boolean
  pickupHours: number
}

function orderMetrics(s: Shipment): RecordMetrics {
  const isFinal = s.status === 'DeliveredToCustomer' || s.status === 'DeliveredToStore' || s.status === 'ReturnToSender'
  const actual = actualDeliveryDate(s)
  return {
    companyId: s.companyId,
    isFinal,
    isSuccess: s.status === 'DeliveredToCustomer' || s.status === 'DeliveredToStore',
    days: isFinal ? shipmentDeliveryDays(s) : null,
    onTime: actual ? new Date(actual) <= new Date(plannedDeliveryDate(s)) : null,
    damaged: isFinal ? isDamagedFor(s.id) : false,
    pickupHours: pickupTimeHoursFor(s.id),
  }
}

function returnMetrics(r: ReturnItem): RecordMetrics {
  const isFinal = r.status === 'ReceivedByReturnCenter'
  const actual = actualReturnDate(r)
  return {
    companyId: r.companyId,
    isFinal,
    isSuccess: isFinal,
    days: isFinal ? genericDeliveryDays(r.id) : null,
    onTime: actual ? new Date(actual) <= new Date(plannedReturnDate(r)) : null,
    damaged: isFinal ? isDamagedFor(r.id) : false,
    pickupHours: pickupTimeHoursFor(r.id),
  }
}

function transferMetrics(x: TransferItem): RecordMetrics {
  const isFinal = x.status === 'DeliveredToStore'
  const actual = actualTransferDate(x)
  return {
    companyId: x.companyId,
    isFinal,
    isSuccess: isFinal,
    days: isFinal ? genericDeliveryDays(x.id) : null,
    onTime: actual ? new Date(actual) <= new Date(plannedTransferDate(x)) : null,
    damaged: isFinal ? isDamagedFor(x.id) : false,
    pickupHours: pickupTimeHoursFor(x.id),
  }
}

export function buildCarrierReportRows(
  shipments: Shipment[],
  returns: ReturnItem[],
  transfers: TransferItem[],
  carrierInvoices: CarrierInvoice[],
): CarrierReportRow[] {
  const records: RecordMetrics[] = [
    ...shipments.map(orderMetrics),
    ...returns.map(returnMetrics),
    ...transfers.map(transferMetrics),
  ]
  const total = records.length

  const byCompany = new Map<
    number,
    {
      volume: number
      delivered: number
      onTime: number
      onTimeCount: number
      damaged: number
      deliveryDaysSum: number
      deliveryDaysCount: number
      pickupHoursSum: number
      returnCount: number
    }
  >()

  function bucket(companyId: number) {
    if (!byCompany.has(companyId)) {
      byCompany.set(companyId, {
        volume: 0,
        delivered: 0,
        onTime: 0,
        onTimeCount: 0,
        damaged: 0,
        deliveryDaysSum: 0,
        deliveryDaysCount: 0,
        pickupHoursSum: 0,
        returnCount: 0,
      })
    }
    return byCompany.get(companyId)!
  }

  records.forEach((m) => {
    const b = bucket(m.companyId)
    b.volume++
    b.pickupHoursSum += m.pickupHours
    if (m.isFinal) {
      if (m.days != null) {
        b.deliveryDaysSum += m.days
        b.deliveryDaysCount++
      }
      if (m.damaged) b.damaged++
    }
    if (m.onTime != null) {
      b.onTimeCount++
      if (m.onTime) b.onTime++
    }
    if (m.isSuccess) b.delivered++
  })
  returns.forEach((r) => bucket(r.companyId).returnCount++)

  const costByCompany = new Map<number, { expected: number; real: number; count: number }>()
  carrierInvoices.forEach((i) => {
    if (!costByCompany.has(i.companyId)) costByCompany.set(i.companyId, { expected: 0, real: 0, count: 0 })
    const c = costByCompany.get(i.companyId)!
    c.expected += i.expectedCost
    c.real += i.realCost
    c.count++
  })

  const companyIds = new Set([...byCompany.keys(), ...costByCompany.keys()])

  return Array.from(companyIds)
    .map((cid) => {
      const b = byCompany.get(cid)
      const cost = costByCompany.get(cid)
      const volume = b?.volume ?? 0
      const returnCount = b?.returnCount ?? 0
      const expected = cost?.expected ?? 0
      const real = cost?.real ?? 0
      return {
        companyId: cid,
        companyName: getCompany(cid)?.name ?? 'Bilinmiyor',
        volume,
        volumeShare: total ? (volume / total) * 100 : 0,
        avgDeliveryDays: b && b.deliveryDaysCount ? b.deliveryDaysSum / b.deliveryDaysCount : null,
        avgPickupHours: b && b.volume ? b.pickupHoursSum / b.volume : null,
        delivered: b?.delivered ?? 0,
        successRate: volume ? ((b?.delivered ?? 0) / volume) * 100 : 0,
        otdRate: b && b.onTimeCount ? (b.onTime / b.onTimeCount) * 100 : 0,
        damagedRate: b && b.deliveryDaysCount ? (b.damaged / b.deliveryDaysCount) * 100 : 0,
        returnCount,
        returnRate: volume ? (returnCount / volume) * 100 : 0,
        expectedCost: expected,
        realCost: real,
        costDiff: real - expected,
        costDiffPct: expected ? ((real - expected) / expected) * 100 : 0,
        avgCostPerShipment: cost && cost.count ? real / cost.count : 0,
      }
    })
    .sort((a, b) => b.volume - a.volume)
}

function fmtCurrency(n: number): string {
  return `₺${Math.round(n).toLocaleString('tr-TR')}`
}

function fmtPct(n: number): string {
  return `%${n.toFixed(1)}`
}

export function reportCellValue(row: CarrierReportRow, key: ReportColumnKey): string {
  switch (key) {
    case 'volume':
      return String(row.volume)
    case 'volumeShare':
      return fmtPct(row.volumeShare)
    case 'avgDeliveryDays':
      return row.avgDeliveryDays != null ? `${row.avgDeliveryDays.toFixed(1)} gün` : '-'
    case 'avgPickupHours':
      return row.avgPickupHours != null ? `${row.avgPickupHours.toFixed(1)} sa` : '-'
    case 'delivered':
      return String(row.delivered)
    case 'successRate':
      return fmtPct(row.successRate)
    case 'otdRate':
      return fmtPct(row.otdRate)
    case 'damagedRate':
      return fmtPct(row.damagedRate)
    case 'returnCount':
      return String(row.returnCount)
    case 'returnRate':
      return fmtPct(row.returnRate)
    case 'expectedCost':
      return fmtCurrency(row.expectedCost)
    case 'realCost':
      return fmtCurrency(row.realCost)
    case 'costDiff':
      return `${row.costDiff >= 0 ? '+' : '−'}${fmtCurrency(Math.abs(row.costDiff))}`
    case 'costDiffPct':
      return `${row.costDiffPct >= 0 ? '+' : ''}${row.costDiffPct.toFixed(1)}%`
    case 'avgCostPerShipment':
      return fmtCurrency(row.avgCostPerShipment)
  }
}

export function exportCarrierReportCsv(
  rows: CarrierReportRow[],
  columns: { key: ReportColumnKey }[],
  dateFrom: string,
  dateTo: string,
) {
  const headers = ['Kargo Firması', ...columns.map((c) => REPORT_COLUMN_LABELS[c.key])]
  const dataRows = rows.map((r) => [r.companyName, ...columns.map((c) => reportCellValue(r, c.key))])
  const csv = [headers, ...dataRows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const range = dateFrom || dateTo ? `_${dateFrom || 'basi'}_${dateTo || 'sonu'}` : ''
  a.download = `kargo-gonderi-raporu${range}_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
