import { useLayoutEffect, useMemo, useState } from 'react'
import { useDataStore } from '../stores/dataStore'
import { useUiStore } from '../stores/uiStore'
import {
  getCompany,
  SHIPMENT_STATUS,
  STATUS_CHART_COLORS,
  RETURN_STATUS,
  RETURN_STATUS_CHART_COLORS,
  TRANSFER_STATUS,
  TRANSFER_STATUS_CHART_COLORS,
  type Shipment,
  type ShipmentStatus,
  type ReturnStatus,
  type TransferStatus,
} from '../data/catalog'
import { getReturnCompanyId } from '../lib/returns'
import { computeCarrierPerformance } from './PerformancePage'
import { inRange, lastNDaysRange, previousPeriod, pctDelta, type DateWindow } from '../lib/dashboard'
import { Donut, type DonutSegment } from '../components/ui/Donut'
import { StackedBarList, type StackedBarRow } from '../components/ui/StackedBarList'
import { KpiTile } from '../components/ui/KpiTile'
import { DateRangeChip } from '../components/ui/DateRangeChip'
import { DateRangePicker } from '../components/ui/DateRangePicker'
import { useHeaderSlotStore } from '../stores/headerSlotStore'
import { useT } from '../hooks/useT'

type WidgetId = 'shipStatus' | 'shipCarrier' | 'returnStatus' | 'returnCarrier' | 'transferStatus' | 'transferCarrier' | 'cost'

const SHIPMENT_STATUS_KEYS = Object.keys(SHIPMENT_STATUS) as ShipmentStatus[]
const RETURN_STATUS_KEYS = Object.keys(RETURN_STATUS) as ReturnStatus[]
const TRANSFER_STATUS_KEYS = Object.keys(TRANSFER_STATUS) as TransferStatus[]

/** Groups by carrier, ranks by volume, folds anything past the top 5 into "Diğer". */
function carrierRows<T>(
  items: T[],
  companyIdOf: (item: T) => number | null,
  statusOf: (item: T) => string,
  statusKeys: string[],
  colorOf: (key: string) => string,
  unknownLabel: string,
): StackedBarRow[] {
  const byCompany = new Map<number, T[]>()
  items.forEach((item) => {
    const cid = companyIdOf(item)
    if (cid == null) return
    if (!byCompany.has(cid)) byCompany.set(cid, [])
    byCompany.get(cid)!.push(item)
  })
  const rows = Array.from(byCompany.entries()).map(([companyId, list]) => ({
    key: String(companyId),
    name: getCompany(companyId)?.name ?? unknownLabel,
    total: list.length,
    segments: statusKeys.map((k) => ({ key: k, value: list.filter((i) => statusOf(i) === k).length, color: colorOf(k) })),
  }))
  rows.sort((a, b) => b.total - a.total)
  const top = rows.slice(0, 5)
  const rest = rows.slice(5)
  if (rest.length > 0) {
    const restTotal = rest.reduce((sum, r) => sum + r.total, 0)
    const restSegments = statusKeys.map((k, i) => ({
      key: k,
      value: rest.reduce((sum, r) => sum + (r.segments[i]?.value ?? 0), 0),
      color: colorOf(k),
    }))
    top.push({ key: 'other', name: `Diğer (${rest.length})`, total: restTotal, segments: restSegments })
  }
  return top
}

function fmtCurrency(n: number): string {
  return `₺${Math.round(n).toLocaleString('tr-TR')}`
}

function fmtDelta(pct: number): string {
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(1).replace('.', ',')}`
}

export function DashboardPage() {
  const t = useT()
  const shipments = useDataStore((s) => s.shipments)
  const returns = useDataStore((s) => s.returns)
  const transfers = useDataStore((s) => s.transfers)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const carrierQuotas = useDataStore((s) => s.carrierQuotas)
  const carrierHealth = useDataStore((s) => s.carrierHealth)

  const dateFrom = useUiStore((s) => s.dashboardDateFrom)
  const dateTo = useUiStore((s) => s.dashboardDateTo)
  const setFrom = useUiStore((s) => s.setDashboardDateFrom)
  const setTo = useUiStore((s) => s.setDashboardDateTo)

  const [overrides, setOverrides] = useState<Partial<Record<WidgetId, DateWindow>>>({})
  function rangeFor(id: WidgetId): DateWindow {
    return overrides[id] ?? { from: dateFrom, to: dateTo }
  }
  function setOverride(id: WidgetId, v: DateWindow) {
    setOverrides((o) => ({ ...o, [id]: v }))
  }
  function clearOverride(id: WidgetId) {
    setOverrides((o) => {
      const next = { ...o }
      delete next[id]
      return next
    })
  }

  const r7 = lastNDaysRange(7)
  const r30 = lastNDaysRange(30)
  const r90 = lastNDaysRange(90)
  const isAll = !dateFrom && !dateTo
  const is7 = dateFrom === r7.from && dateTo === r7.to
  const is30 = dateFrom === r30.from && dateTo === r30.to
  const is90 = dateFrom === r90.from && dateTo === r90.to
  const hasBoundedRange = !!(dateFrom && dateTo)
  const prevRange = hasBoundedRange ? previousPeriod(dateFrom, dateTo) : null

  // ---------- KPI strip (always uses the global range) ----------
  const shipmentsGlobal = useMemo(() => shipments.filter((s) => inRange(s.shipTime, dateFrom, dateTo)), [shipments, dateFrom, dateTo])
  const shipmentsPrev = useMemo(
    () => (prevRange ? shipments.filter((s) => inRange(s.shipTime, prevRange.from, prevRange.to)) : []),
    [shipments, prevRange],
  )
  const returnsGlobal = useMemo(() => returns.filter((r) => inRange(r.requestDate, dateFrom, dateTo)), [returns, dateFrom, dateTo])
  const returnsPrev = useMemo(
    () => (prevRange ? returns.filter((r) => inRange(r.requestDate, prevRange.from, prevRange.to)) : []),
    [returns, prevRange],
  )
  const transfersGlobal = useMemo(() => transfers.filter((x) => inRange(x.createdAt, dateFrom, dateTo)), [transfers, dateFrom, dateTo])
  const transfersPrev = useMemo(
    () => (prevRange ? transfers.filter((x) => inRange(x.createdAt, prevRange.from, prevRange.to)) : []),
    [transfers, prevRange],
  )
  const invoicesGlobal = useMemo(
    () => carrierInvoices.filter((i) => inRange(i.invoiceDate, dateFrom, dateTo)),
    [carrierInvoices, dateFrom, dateTo],
  )
  const invoicesPrev = useMemo(
    () => (prevRange ? carrierInvoices.filter((i) => inRange(i.invoiceDate, prevRange.from, prevRange.to)) : []),
    [carrierInvoices, prevRange],
  )

  const shipDelta = hasBoundedRange ? pctDelta(shipmentsGlobal.length, shipmentsPrev.length) : null
  const returnDelta = hasBoundedRange ? pctDelta(returnsGlobal.length, returnsPrev.length) : null
  const transferDelta = hasBoundedRange ? pctDelta(transfersGlobal.length, transfersPrev.length) : null
  const returnRate = shipmentsGlobal.length > 0 ? (returnsGlobal.length / shipmentsGlobal.length) * 100 : 0

  const perfNow = useMemo(() => computeCarrierPerformance(shipmentsGlobal, invoicesGlobal), [shipmentsGlobal, invoicesGlobal])
  const perfPrev = useMemo(() => computeCarrierPerformance(shipmentsPrev, invoicesPrev), [shipmentsPrev, invoicesPrev])
  function weightedOtd(perf: ReturnType<typeof computeCarrierPerformance>) {
    let delivered = 0
    let onTime = 0
    perf.forEach((p) => {
      const d = p.successRate * p.total
      delivered += d
      onTime += p.otdRate * d
    })
    return delivered > 0 ? (onTime / delivered) * 100 : 0
  }
  const otdNow = weightedOtd(perfNow)
  const otdPrev = weightedOtd(perfPrev)
  const otdDeltaPp = hasBoundedRange && perfPrev.length > 0 ? otdNow - otdPrev : null

  const expectedSum = invoicesGlobal.reduce((s, i) => s + i.expectedCost, 0)
  const realSum = invoicesGlobal.reduce((s, i) => s + i.realCost, 0)
  const costDeltaPct = expectedSum > 0 ? ((realSum - expectedSum) / expectedSum) * 100 : 0
  const expectedSumPrev = invoicesPrev.reduce((s, i) => s + i.expectedCost, 0)
  const realSumPrev = invoicesPrev.reduce((s, i) => s + i.realCost, 0)
  const costDeltaPctPrev = expectedSumPrev > 0 ? ((realSumPrev - expectedSumPrev) / expectedSumPrev) * 100 : 0
  const costTrendPp = hasBoundedRange && invoicesPrev.length > 0 ? costDeltaPct - costDeltaPctPrev : null

  const quotaRisk = carrierQuotas.filter((q) => q.monthlyLimit > 0 && q.usedThisMonth / q.monthlyLimit >= 0.9).length
  const healthUp = carrierHealth.filter((h) => h.status === 'up').length

  // ---------- Zone: Gönderiler ----------
  const shipStatusRange = rangeFor('shipStatus')
  const shipStatusData = useMemo(
    () => shipments.filter((s) => inRange(s.shipTime, shipStatusRange.from, shipStatusRange.to)),
    [shipments, shipStatusRange.from, shipStatusRange.to],
  )
  const shipStatusSegments: DonutSegment[] = SHIPMENT_STATUS_KEYS.map((k) => ({
    key: k,
    label: t(`status.${k}`),
    value: shipStatusData.filter((s) => s.status === k).length,
    color: STATUS_CHART_COLORS[k],
  }))

  const shipCarrierRange = rangeFor('shipCarrier')
  const shipCarrierData = useMemo(
    () => shipments.filter((s) => inRange(s.shipTime, shipCarrierRange.from, shipCarrierRange.to)),
    [shipments, shipCarrierRange.from, shipCarrierRange.to],
  )
  const shipCarrierRowsData = useMemo(
    () =>
      carrierRows<Shipment>(
        shipCarrierData,
        (s) => s.companyId,
        (s) => s.status,
        SHIPMENT_STATUS_KEYS,
        (k) => STATUS_CHART_COLORS[k as ShipmentStatus],
        t('common.unknown'),
      ),
    [shipCarrierData, t],
  )

  // ---------- Zone: İadeler ----------
  const returnStatusRange = rangeFor('returnStatus')
  const returnStatusData = useMemo(
    () => returns.filter((r) => inRange(r.requestDate, returnStatusRange.from, returnStatusRange.to)),
    [returns, returnStatusRange.from, returnStatusRange.to],
  )
  const returnStatusSegments: DonutSegment[] = RETURN_STATUS_KEYS.map((k) => ({
    key: k,
    label: t(`returnStatus.${k}`),
    value: returnStatusData.filter((r) => r.status === k).length,
    color: RETURN_STATUS_CHART_COLORS[k],
  }))

  const returnCarrierRange = rangeFor('returnCarrier')
  const returnCarrierData = useMemo(
    () => returns.filter((r) => inRange(r.requestDate, returnCarrierRange.from, returnCarrierRange.to)),
    [returns, returnCarrierRange.from, returnCarrierRange.to],
  )
  const returnCarrierRowsData = useMemo(
    () =>
      carrierRows(
        returnCarrierData,
        (r) => getReturnCompanyId(r, shipments),
        (r) => r.status,
        RETURN_STATUS_KEYS,
        (k) => RETURN_STATUS_CHART_COLORS[k as ReturnStatus],
        t('common.unknown'),
      ),
    [returnCarrierData, shipments, t],
  )

  // ---------- Zone: Transferler ----------
  const transferStatusRange = rangeFor('transferStatus')
  const transferStatusData = useMemo(
    () => transfers.filter((x) => inRange(x.createdAt, transferStatusRange.from, transferStatusRange.to)),
    [transfers, transferStatusRange.from, transferStatusRange.to],
  )
  const transferStatusSegments: DonutSegment[] = TRANSFER_STATUS_KEYS.map((k) => ({
    key: k,
    label: t(`transferStatus.${k}`),
    value: transferStatusData.filter((x) => x.status === k).length,
    color: TRANSFER_STATUS_CHART_COLORS[k],
  }))

  const transferCarrierRange = rangeFor('transferCarrier')
  const transferCarrierData = useMemo(
    () => transfers.filter((x) => inRange(x.createdAt, transferCarrierRange.from, transferCarrierRange.to)),
    [transfers, transferCarrierRange.from, transferCarrierRange.to],
  )
  const transferCarrierRowsData = useMemo(
    () =>
      carrierRows(
        transferCarrierData,
        (x) => x.companyId,
        (x) => x.status,
        TRANSFER_STATUS_KEYS,
        (k) => TRANSFER_STATUS_CHART_COLORS[k as TransferStatus],
        t('common.unknown'),
      ),
    [transferCarrierData, t],
  )

  // ---------- Zone: Maliyet ----------
  const costRange = rangeFor('cost')
  const costData = useMemo(
    () => carrierInvoices.filter((i) => inRange(i.invoiceDate, costRange.from, costRange.to)),
    [carrierInvoices, costRange.from, costRange.to],
  )
  const costByCarrier = useMemo(() => {
    const byCompany = new Map<number, { expected: number; real: number }>()
    costData.forEach((i) => {
      const cur = byCompany.get(i.companyId) ?? { expected: 0, real: 0 }
      cur.expected += i.expectedCost
      cur.real += i.realCost
      byCompany.set(i.companyId, cur)
    })
    return Array.from(byCompany.entries())
      .map(([companyId, v]) => ({
        companyId,
        name: getCompany(companyId)?.name ?? t('common.unknown'),
        delta: v.real - v.expected,
      }))
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
  }, [costData, t])
  const wfExpectedTotal = costData.reduce((s, i) => s + i.expectedCost, 0)
  const wfRealTotal = costData.reduce((s, i) => s + i.realCost, 0)
  const wfDeltaPct = wfExpectedTotal > 0 ? ((wfRealTotal - wfExpectedTotal) / wfExpectedTotal) * 100 : 0
  const worstCarrier = costByCarrier[0]

  let cum = wfExpectedTotal
  const cumPoints = [wfExpectedTotal]
  costByCarrier.forEach((r) => {
    cum += r.delta
    cumPoints.push(cum)
  })
  const wfMaxScale = Math.max(...cumPoints, wfExpectedTotal, wfRealTotal, 1) * 1.05
  function wfPct(v: number) {
    return (v / wfMaxScale) * 100
  }

  // ---------- Kalan Taşıyıcı Kotası (live snapshot, not date-filtered) ----------
  const quotaRows = useMemo(
    () =>
      [...carrierQuotas]
        .map((q) => ({
          ...q,
          name: getCompany(q.companyId)?.name ?? t('common.unknown'),
          usedPct: q.monthlyLimit > 0 ? (q.usedThisMonth / q.monthlyLimit) * 100 : 0,
        }))
        .sort((a, b) => b.usedPct - a.usedPct),
    [carrierQuotas, t],
  )
  function quotaColor(pct: number) {
    if (pct >= 90) return '#eda3ab'
    if (pct >= 70) return '#f0bf8a'
    return '#8fd4ab'
  }

  const periodLabel = isAll ? 'Tüm Zamanlar' : `${dateFrom || '…'} – ${dateTo || '…'}`

  const setHeaderSlot = useHeaderSlotStore((s) => s.setHeaderSlot)
  const clearHeaderSlot = useHeaderSlotStore((s) => s.clearHeaderSlot)

  useLayoutEffect(() => {
    setHeaderSlot({
      actions: (
        <DateRangePicker
          from={dateFrom}
          to={dateTo}
          onQuickSelect={(f, t) => {
            setFrom(f)
            setTo(t)
          }}
          onCustomFrom={setFrom}
          onCustomTo={setTo}
        />
      ),
    })
    return () => clearHeaderSlot()
  })

  return (
    <div className="page-container">
      {/* ---------- KPI strip ---------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3 mb-7">
        <KpiTile
          label="Toplam Gönderi"
          value={shipmentsGlobal.length.toLocaleString('tr-TR')}
          delta={shipDelta != null ? { text: `%${fmtDelta(shipDelta).replace('+', '')} · önceki dönem`, tone: shipDelta >= 0 ? 'good' : 'bad', direction: shipDelta >= 0 ? 'up' : 'down' } : undefined}
          note={shipDelta == null ? periodLabel : undefined}
        />
        <KpiTile
          label="Toplam İade"
          value={returnsGlobal.length.toLocaleString('tr-TR')}
          unit={`· %${returnRate.toFixed(1).replace('.', ',')} oran`}
          delta={returnDelta != null ? { text: `%${Math.abs(returnDelta).toFixed(1).replace('.', ',')} · önceki dönem`, tone: returnDelta <= 0 ? 'good' : 'bad', direction: returnDelta >= 0 ? 'up' : 'down' } : undefined}
          note={returnDelta == null ? periodLabel : undefined}
        />
        <KpiTile
          label="Toplam Transfer"
          value={transfersGlobal.length.toLocaleString('tr-TR')}
          delta={transferDelta != null ? { text: `%${Math.abs(transferDelta).toFixed(1).replace('.', ',')} · önceki dönem`, tone: transferDelta >= 0 ? 'good' : 'bad', direction: transferDelta >= 0 ? 'up' : 'down' } : undefined}
          note={transferDelta == null ? periodLabel : undefined}
        />
        <KpiTile
          label="Genel OTD Oranı"
          value={otdNow.toFixed(1).replace('.', ',')}
          unit="%"
          delta={otdDeltaPp != null ? { text: `${fmtDelta(otdDeltaPp).replace(',', '.').replace('.', ',')}pp`, tone: otdDeltaPp >= 0 ? 'good' : 'bad', direction: otdDeltaPp >= 0 ? 'up' : 'down' } : undefined}
          note={otdDeltaPp == null ? 'Teslim edilen gönderiler üzerinden' : undefined}
        />
        <KpiTile
          label="Ort. Maliyet Sapması"
          value={fmtDelta(costDeltaPct)}
          unit="%"
          valueColor={costDeltaPct > 0 ? '#c2626d' : undefined}
          delta={costTrendPp != null ? { text: `${fmtDelta(costTrendPp)}pp`, tone: costTrendPp <= 0 ? 'good' : 'bad', direction: costTrendPp >= 0 ? 'up' : 'down' } : undefined}
          note={costTrendPp == null ? 'Beklenen vs gerçekleşen' : undefined}
        />
        <KpiTile
          label="Kota Riski"
          value={String(quotaRisk)}
          unit="taşıyıcı"
          valueColor={quotaRisk > 0 ? '#c17d3f' : undefined}
          note="%90 üzeri kullanım"
        />
        <KpiTile label="Taşıyıcı Sağlığı" value={`${healthUp}`} unit={`/ ${carrierHealth.length}`} note="canlı bağlantı" />
      </div>

      {/* ---------- Zone: Gönderiler ---------- */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6.5 h-6.5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#eef1fb', color: '#6b84dd', width: 26, height: 26 }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-neutral-700">Gönderiler</h2>
          <span className="text-[11.5px] text-neutral-400">Oluşturulma tarihine göre</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Gönderi Durum Dağılımı</p>
                <p className="text-[11.5px] text-neutral-400">Seçili dönemde, statü bazında</p>
              </div>
              <DateRangeChip
                value={overrides.shipStatus ?? null}
                onChange={(v) => setOverride('shipStatus', v)}
                onClear={() => clearOverride('shipStatus')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <Donut segments={shipStatusSegments} centerLabel={shipStatusData.length.toLocaleString('tr-TR')} centerSub="TOPLAM GÖNDERİ" />
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Kargo Firması Bazlı Dağılım</p>
                <p className="text-[11.5px] text-neutral-400">Hacim sıralı, statü kırılımlı</p>
              </div>
              <DateRangeChip
                value={overrides.shipCarrier ?? null}
                onChange={(v) => setOverride('shipCarrier', v)}
                onClear={() => clearOverride('shipCarrier')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <StackedBarList rows={shipCarrierRowsData} />
          </div>
        </div>
      </div>

      {/* ---------- Zone: İadeler ---------- */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f5f0fb', color: '#a688f0', width: 26, height: 26 }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-neutral-700">İadeler</h2>
          <span className="text-[11.5px] text-neutral-400">Talep oluşturulma tarihine göre</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">İade Durum Dağılımı</p>
                <p className="text-[11.5px] text-neutral-400">Seçili dönemde, statü bazında</p>
              </div>
              <DateRangeChip
                value={overrides.returnStatus ?? null}
                onChange={(v) => setOverride('returnStatus', v)}
                onClear={() => clearOverride('returnStatus')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <Donut segments={returnStatusSegments} centerLabel={returnStatusData.length.toLocaleString('tr-TR')} centerSub="TOPLAM İADE" />
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Kargo Firması Bazlı İade Dağılımı</p>
                <p className="text-[11.5px] text-neutral-400">Hacim sıralı, statü kırılımlı</p>
              </div>
              <DateRangeChip
                value={overrides.returnCarrier ?? null}
                onChange={(v) => setOverride('returnCarrier', v)}
                onClear={() => clearOverride('returnCarrier')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <StackedBarList rows={returnCarrierRowsData} />
          </div>
        </div>
      </div>

      {/* ---------- Zone: Transferler ---------- */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#fdf3ea', color: '#d99456', width: 26, height: 26 }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-neutral-700">Transferler</h2>
          <span className="text-[11.5px] text-neutral-400">Depolar arası stok transferi, oluşturulma tarihine göre</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Transfer Durum Dağılımı</p>
                <p className="text-[11.5px] text-neutral-400">Seçili dönemde, statü bazında</p>
              </div>
              <DateRangeChip
                value={overrides.transferStatus ?? null}
                onChange={(v) => setOverride('transferStatus', v)}
                onClear={() => clearOverride('transferStatus')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <Donut segments={transferStatusSegments} centerLabel={transferStatusData.length.toLocaleString('tr-TR')} centerSub="TOPLAM TRANSFER" />
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Kargo Firması Bazlı Transfer Dağılımı</p>
                <p className="text-[11.5px] text-neutral-400">Hacim sıralı, statü kırılımlı</p>
              </div>
              <DateRangeChip
                value={overrides.transferCarrier ?? null}
                onChange={(v) => setOverride('transferCarrier', v)}
                onClear={() => clearOverride('transferCarrier')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            <StackedBarList rows={transferCarrierRowsData} />
          </div>
        </div>
      </div>

      {/* ---------- Zone: Maliyet ---------- */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#e8f5ee', color: '#4fa87b', width: 26, height: 26 }}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path strokeLinecap="round" d="M2 10h20M6 15h4" />
            </svg>
          </div>
          <h2 className="text-[13px] font-bold uppercase tracking-wider text-neutral-700">Maliyet</h2>
          <span className="text-[11.5px] text-neutral-400">Beklenen vs gerçekleşen taşıma bedeli</span>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-[1.7fr_1fr] gap-3.5">
          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[13.5px] font-bold text-neutral-950">Beklenen → Gerçekleşen Maliyet Köprüsü</p>
                <p className="text-[11.5px] text-neutral-400">Taşıyıcı bazlı sapma katkısı, ₺</p>
              </div>
              <DateRangeChip
                value={overrides.cost ?? null}
                onChange={(v) => setOverride('cost', v)}
                onClear={() => clearOverride('cost')}
                inheritedLabel={isAll ? 'Tümü' : is30 ? '30G' : is7 ? '7G' : is90 ? '90G' : 'Genel'}
              />
            </div>
            {costData.length === 0 ? (
              <p className="text-xs text-neutral-400 text-center py-8">Seçili dönemde fatura verisi yok</p>
            ) : (
              <div className="flex flex-col gap-1">
                <div className="grid items-center gap-2.5" style={{ gridTemplateColumns: '120px 1fr 90px', height: 30 }}>
                  <span className="text-[11.5px] font-semibold text-neutral-600 truncate">Beklenen Toplam</span>
                  <div className="relative rounded" style={{ height: 16, background: '#f2f5f8' }}>
                    <div className="absolute top-0 rounded" style={{ left: 0, width: `${wfPct(wfExpectedTotal)}%`, height: 16, background: '#b7bfcb' }} />
                  </div>
                  <span className="text-[11.5px] font-bold text-right text-neutral-950" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {fmtCurrency(wfExpectedTotal)}
                  </span>
                </div>
                {(() => {
                  let running = wfExpectedTotal
                  return costByCarrier.map((row) => {
                    const before = running
                    running += row.delta
                    const geomLeft = wfPct(Math.min(before, running))
                    const geomWidth = wfPct(Math.abs(row.delta))
                    const isPos = row.delta > 0
                    const isZero = row.delta === 0
                    const fillTone = isZero ? '#c3cad4' : isPos ? '#eda3ab' : '#8fd4ab'
                    const textTone = isZero ? '#a3abb8' : isPos ? '#c2626d' : '#3f9d6e'
                    return (
                      <div key={row.companyId} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '120px 1fr 90px', height: 30 }}>
                        <span className="text-[11.5px] font-semibold text-neutral-600 truncate">{row.name}</span>
                        <div className="relative rounded" style={{ height: 16, background: '#f2f5f8' }}>
                          <div className="absolute" style={{ left: `${wfPct(before)}%`, top: -7, width: 1, height: 7, background: '#cacfd8' }} />
                          <div className="absolute top-0 rounded" style={{ left: `${geomLeft}%`, width: `${geomWidth}%`, height: 16, background: fillTone }} />
                        </div>
                        <span className="text-[11.5px] font-bold text-right" style={{ fontVariantNumeric: 'tabular-nums', color: textTone }}>
                          {isZero ? '' : isPos ? '+' : '−'}
                          {fmtCurrency(Math.abs(row.delta))}
                        </span>
                      </div>
                    )
                  })
                })()}
                <div
                  className="grid items-center gap-2.5"
                  style={{ gridTemplateColumns: '120px 1fr 90px', height: 30, borderTop: '1px dashed #eaecf0', marginTop: 4, paddingTop: 8 }}
                >
                  <span className="text-[11.5px] font-bold text-neutral-950">Gerçekleşen Toplam</span>
                  <div className="relative rounded" style={{ height: 16, background: '#f2f5f8' }}>
                    <div className="absolute top-0 rounded" style={{ left: 0, width: `${wfPct(wfRealTotal)}%`, height: 16, background: '#4b5566' }} />
                  </div>
                  <span className="text-[11.5px] font-extrabold text-right text-neutral-950" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {fmtCurrency(wfRealTotal)}
                  </span>
                </div>
                <p className="text-[11px] mt-2.5 font-semibold" style={{ color: wfDeltaPct > 0 ? '#c2626d' : '#3f9d6e' }}>
                  Toplamda beklenenin {wfDeltaPct >= 0 ? '' : '−'}%{Math.abs(wfDeltaPct).toFixed(1).replace('.', ',')}{' '}
                  {wfDeltaPct >= 0 ? 'üzerinde' : 'altında'} gerçekleşti
                  {worstCarrier ? ` — en büyük sapma ${worstCarrier.name}'dan geliyor (${worstCarrier.delta >= 0 ? '+' : '−'}${fmtCurrency(Math.abs(worstCarrier.delta))})` : ''}
                </p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-4">
            <p className="text-[13.5px] font-bold text-neutral-950 mb-0.5">Kalan Taşıyıcı Kotası</p>
            <p className="text-[11.5px] text-neutral-400 mb-3.5">Aylık kontenjan kullanımı</p>
            <div className="flex flex-col gap-3">
              {quotaRows.map((q) => (
                <div key={q.companyId}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs font-semibold text-neutral-700">{q.name}</span>
                    <span className="text-[11px] text-neutral-500" style={{ fontVariantNumeric: 'tabular-nums' }}>
                      <b className="text-neutral-800 font-bold">{q.usedThisMonth.toLocaleString('tr-TR')}</b> / {q.monthlyLimit.toLocaleString('tr-TR')}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${Math.min(100, q.usedPct)}%`, background: quotaColor(q.usedPct) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
