import { useLayoutEffect, useMemo, useState } from 'react'
import { useDataStore } from '../stores/dataStore'
import { useUiStore } from '../stores/uiStore'
import { useHeaderSlotStore } from '../stores/headerSlotStore'
import { COMPANIES, PROVINCES } from '../data/catalog'
import { buildCarrierReportRows, reportCellValue, exportCarrierReportCsv, REPORT_COLUMNS, REPORT_COLUMN_LABELS, type ReportColumnKey } from '../lib/reports'
import { UNIFIED_KINDS, UNIFIED_KIND_LABELS, type UnifiedKind } from '../lib/allShipmentsReport'
import { SHIPMENT_CHANNELS } from '../lib/shipments'
import { MultiSelectDropdown } from '../components/ui/MultiSelectDropdown'
import { ColumnPanelModal } from '../components/ui/ColumnPanelModal'
import { DateRangePicker } from '../components/ui/DateRangePicker'

export function ReportsPage() {
  const shipments = useDataStore((s) => s.shipments)
  const returns = useDataStore((s) => s.returns)
  const transfers = useDataStore((s) => s.transfers)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const dateFrom = useUiStore((s) => s.reportsDateFrom)
  const dateTo = useUiStore((s) => s.reportsDateTo)
  const companySelection = useUiStore((s) => s.reportsCompanySelection)
  const provinceSelection = useUiStore((s) => s.reportsProvinceSelection)
  const kindSelection = useUiStore((s) => s.reportsKindSelection)
  const channelSelection = useUiStore((s) => s.reportsChannelSelection)
  const setReportsFilter = useUiStore((s) => s.setReportsFilter)
  const setReportsCompanySelection = useUiStore((s) => s.setReportsCompanySelection)
  const setReportsProvinceSelection = useUiStore((s) => s.setReportsProvinceSelection)
  const setReportsKindSelection = useUiStore((s) => s.setReportsKindSelection)
  const setReportsChannelSelection = useUiStore((s) => s.setReportsChannelSelection)
  const visibleColumns = useUiStore((s) => s.reportsVisibleColumns)
  const setReportsVisibleColumns = useUiStore((s) => s.setReportsVisibleColumns)
  const [showColumnPanel, setShowColumnPanel] = useState(false)

  const excludedCompanyIds = useMemo(
    () => new Set<number>(COMPANIES.filter((c) => companySelection[String(c.id)] === false).map((c) => c.id)),
    [companySelection],
  )
  const excludedProvinceNames = useMemo(
    () => new Set<string>(PROVINCES.filter((p) => provinceSelection[String(p.id)] === false).map((p) => p.name)),
    [provinceSelection],
  )
  const excludedKinds = useMemo(
    () => new Set<UnifiedKind>(UNIFIED_KINDS.filter((k) => kindSelection[k.key] === false).map((k) => k.key)),
    [kindSelection],
  )
  const excludedChannels = useMemo(
    () => new Set<string>(SHIPMENT_CHANNELS.filter((c) => channelSelection[c] === false)),
    [channelSelection],
  )

  const filtered = useMemo(() => {
    if (excludedKinds.has('order')) return []
    return shipments.filter((s) => {
      // Sipariş Gönderisi raporları — pre-dedicated-returns-module legacy kayıtlar hariç.
      if (s.cargoType !== 'order') return false
      const day = s.shipTime.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (excludedCompanyIds.has(s.companyId)) return false
      if (excludedProvinceNames.has(s.shipTo.province)) return false
      if (excludedChannels.has(s.channel)) return false
      return true
    })
  }, [shipments, dateFrom, dateTo, excludedCompanyIds, excludedProvinceNames, excludedChannels, excludedKinds])

  const filteredReturns = useMemo(() => {
    if (excludedKinds.has('return')) return []
    return returns.filter((x) => {
      const day = x.requestDate.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (excludedCompanyIds.has(x.companyId)) return false
      if (excludedProvinceNames.has(x.shipTo.province)) return false
      if (excludedChannels.has(x.channel)) return false
      return true
    })
  }, [returns, dateFrom, dateTo, excludedCompanyIds, excludedProvinceNames, excludedChannels, excludedKinds])

  const filteredTransfers = useMemo(() => {
    if (excludedKinds.has('transfer')) return []
    return transfers.filter((x) => {
      const day = x.createdAt.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (excludedCompanyIds.has(x.companyId)) return false
      return true
    })
  }, [transfers, dateFrom, dateTo, excludedCompanyIds, excludedKinds])

  const filteredInvoices = useMemo(() => {
    return carrierInvoices.filter((i) => {
      const day = i.invoiceDate.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (excludedCompanyIds.has(i.companyId)) return false
      if (i.shipmentNo != null && excludedKinds.has('order')) return false
      if (i.returnNo != null && excludedKinds.has('return')) return false
      if (i.transferNo != null && excludedKinds.has('transfer')) return false
      return true
    })
  }, [carrierInvoices, dateFrom, dateTo, excludedCompanyIds, excludedKinds])

  const rows = useMemo(
    () => buildCarrierReportRows(filtered, filteredReturns, filteredTransfers, filteredInvoices),
    [filtered, filteredReturns, filteredTransfers, filteredInvoices],
  )

  const activeCols = REPORT_COLUMNS.filter((c) => visibleColumns[c.key] !== false)

  function handleExportCsv() {
    exportCarrierReportCsv(rows, activeCols, dateFrom, dateTo)
  }

  const setHeaderSlot = useHeaderSlotStore((s) => s.setHeaderSlot)
  const clearHeaderSlot = useHeaderSlotStore((s) => s.clearHeaderSlot)

  useLayoutEffect(() => {
    setHeaderSlot({
      actions: (
        <button className="primary-btn" type="button" onClick={handleExportCsv} disabled={rows.length === 0}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
          </svg>
          CSV Olarak İndir
        </button>
      ),
    })
    return () => clearHeaderSlot()
  })

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100 flex-wrap">
          <DateRangePicker
            from={dateFrom}
            to={dateTo}
            onQuickSelect={(f, t) => {
              setReportsFilter('reportsDateFrom', f)
              setReportsFilter('reportsDateTo', t)
            }}
            onCustomFrom={(v) => setReportsFilter('reportsDateFrom', v)}
            onCustomTo={(v) => setReportsFilter('reportsDateTo', v)}
          />
          <div style={{ minWidth: 170 }}>
            <MultiSelectDropdown
              selected={kindSelection}
              onChange={setReportsKindSelection}
              placeholder="Tüm Gönderi Tipleri"
              allLabel="Tüm Gönderi Tipleri"
              options={UNIFIED_KINDS.map((k) => ({ value: k.key, label: UNIFIED_KIND_LABELS[k.key as UnifiedKind] }))}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <MultiSelectDropdown
              selected={companySelection}
              onChange={setReportsCompanySelection}
              placeholder="Tüm Kargo Firmaları"
              allLabel="Tüm Kargo Firmaları"
              options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <MultiSelectDropdown
              selected={provinceSelection}
              onChange={setReportsProvinceSelection}
              placeholder="Tüm Bölgeler"
              allLabel="Tüm Bölgeler"
              options={PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <MultiSelectDropdown
              selected={channelSelection}
              onChange={setReportsChannelSelection}
              placeholder="Tüm Kanallar"
              allLabel="Tüm Kanallar"
              options={SHIPMENT_CHANNELS.map((c) => ({ value: c, label: c }))}
            />
          </div>
          <div className="flex-1" />
          <button className="secondary-btn" type="button" onClick={() => setShowColumnPanel(true)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="7" height="16" rx="1.5" />
              <rect x="14" y="4" width="7" height="16" rx="1.5" />
            </svg>
            Tabloyu Düzenle
          </button>
        </div>

        {rows.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-sm">Seçili filtrelerde veri yok</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ minWidth: Math.max(700, activeCols.length * 140 + 200) }}>
              <thead>
                <tr className="text-left border-b border-neutral-100 bg-neutral-50">
                  <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                    Kargo Firması
                  </th>
                  {activeCols.map((c) => (
                    <th
                      key={c.key}
                      className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right whitespace-nowrap"
                    >
                      {REPORT_COLUMN_LABELS[c.key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {rows.map((row) => (
                  <tr key={row.companyId} className="hover:bg-neutral-50/80">
                    <td className="px-5 py-3 font-medium text-neutral-700 whitespace-nowrap">{row.companyName}</td>
                    {activeCols.map((c) => (
                      <td key={c.key} className="px-5 py-3 text-right text-neutral-600 whitespace-nowrap">
                        {reportCellValue(row, c.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showColumnPanel ? (
        <ColumnPanelModal
          visibleColumns={visibleColumns}
          columnKeys={REPORT_COLUMNS}
          columnLabel={(key) => REPORT_COLUMN_LABELS[key as ReportColumnKey]}
          onToggle={(key, checked) => setReportsVisibleColumns({ ...visibleColumns, [key]: checked })}
          onToggleAll={(checked) => {
            const next: Partial<Record<ReportColumnKey, boolean>> = {}
            REPORT_COLUMNS.forEach((c) => {
              next[c.key] = checked
            })
            setReportsVisibleColumns(next)
          }}
          onClose={() => setShowColumnPanel(false)}
        />
      ) : null}
    </div>
  )
}
