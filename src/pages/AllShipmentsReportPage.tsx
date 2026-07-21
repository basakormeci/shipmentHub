import { useLayoutEffect, useMemo, useState } from 'react'
import { useDataStore } from '../stores/dataStore'
import { useUiStore } from '../stores/uiStore'
import { useHeaderSlotStore } from '../stores/headerSlotStore'
import { COMPANIES, PROVINCES } from '../data/catalog'
import { useT } from '../hooks/useT'
import {
  ALL_SHIPMENTS_REPORT_PAGE_SIZE,
  UNIFIED_COLUMNS,
  UNIFIED_COLUMN_LABELS,
  UNIFIED_KINDS,
  UNIFIED_KIND_LABELS,
  buildUnifiedRows,
  exportUnifiedShipmentsCsv,
  unifiedCellValue,
  unifiedStatusLabel,
  type UnifiedColumnKey,
  type UnifiedKind,
} from '../lib/allShipmentsReport'
import { buildPaginationNumbers } from '../lib/shipments'
import { MultiSelectDropdown } from '../components/ui/MultiSelectDropdown'
import { ColumnPanelModal } from '../components/ui/ColumnPanelModal'
import { DateRangePicker } from '../components/ui/DateRangePicker'

export function AllShipmentsReportPage() {
  const t = useT()
  const shipments = useDataStore((s) => s.shipments)
  const returns = useDataStore((s) => s.returns)
  const transfers = useDataStore((s) => s.transfers)
  const nodes = useDataStore((s) => s.nodes)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)

  const dateFrom = useUiStore((s) => s.allShipmentsReportDateFrom)
  const dateTo = useUiStore((s) => s.allShipmentsReportDateTo)
  const companySelection = useUiStore((s) => s.allShipmentsReportCompanySelection)
  const kindSelection = useUiStore((s) => s.allShipmentsReportKindSelection)
  const provinceSelection = useUiStore((s) => s.allShipmentsReportProvinceSelection)
  const visibleColumns = useUiStore((s) => s.allShipmentsReportVisibleColumns)
  const page = useUiStore((s) => s.allShipmentsReportPage)
  const setFilter = useUiStore((s) => s.setAllShipmentsReportFilter)
  const setCompanySelection = useUiStore((s) => s.setAllShipmentsReportCompanySelection)
  const setKindSelection = useUiStore((s) => s.setAllShipmentsReportKindSelection)
  const setProvinceSelection = useUiStore((s) => s.setAllShipmentsReportProvinceSelection)
  const setVisibleColumns = useUiStore((s) => s.setAllShipmentsReportVisibleColumns)
  const setPage = useUiStore((s) => s.setAllShipmentsReportPage)

  const [showColumnPanel, setShowColumnPanel] = useState(false)

  const allRows = useMemo(
    () => buildUnifiedRows(shipments, returns, transfers, nodes, carrierInvoices),
    [shipments, returns, transfers, nodes, carrierInvoices],
  )

  const excludedCompanyIds = useMemo(
    () => new Set<number>(COMPANIES.filter((c) => companySelection[String(c.id)] === false).map((c) => c.id)),
    [companySelection],
  )
  const excludedKinds = useMemo(
    () => new Set(UNIFIED_KINDS.filter((k) => kindSelection[k.key] === false).map((k) => k.key)),
    [kindSelection],
  )
  const excludedProvinceNames = useMemo(
    () => new Set<string>(PROVINCES.filter((p) => provinceSelection[String(p.id)] === false).map((p) => p.name)),
    [provinceSelection],
  )

  const rows = useMemo(() => {
    return allRows.filter((r) => {
      const day = r.date.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (excludedCompanyIds.has(r.companyId)) return false
      if (excludedKinds.has(r.kind)) return false
      if (r.province && excludedProvinceNames.has(r.province)) return false
      return true
    })
  }, [allRows, dateFrom, dateTo, excludedCompanyIds, excludedKinds, excludedProvinceNames])

  const activeCols = UNIFIED_COLUMNS.filter((c) => visibleColumns[c.key] !== false)
  const statusLabel = (row: (typeof rows)[number]) => unifiedStatusLabel(row, t)

  const totalPages = Math.max(1, Math.ceil(rows.length / ALL_SHIPMENTS_REPORT_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * ALL_SHIPMENTS_REPORT_PAGE_SIZE
  const pageRows = rows.slice(pageStart, pageStart + ALL_SHIPMENTS_REPORT_PAGE_SIZE)

  function handleExportCsv() {
    exportUnifiedShipmentsCsv(rows, activeCols, statusLabel)
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
            onQuickSelect={(f, t2) => {
              setFilter('allShipmentsReportDateFrom', f)
              setFilter('allShipmentsReportDateTo', t2)
            }}
            onCustomFrom={(v) => setFilter('allShipmentsReportDateFrom', v)}
            onCustomTo={(v) => setFilter('allShipmentsReportDateTo', v)}
          />
          <div style={{ minWidth: 170 }}>
            <MultiSelectDropdown
              selected={kindSelection}
              onChange={setKindSelection}
              placeholder="Tüm Gönderi Tipleri"
              allLabel="Tüm Gönderi Tipleri"
              options={UNIFIED_KINDS.map((k) => ({ value: k.key, label: UNIFIED_KIND_LABELS[k.key as UnifiedKind] }))}
            />
          </div>
          <div style={{ minWidth: 180 }}>
            <MultiSelectDropdown
              selected={companySelection}
              onChange={setCompanySelection}
              placeholder="Tüm Kargo Firmaları"
              allLabel="Tüm Kargo Firmaları"
              options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>
          <div style={{ minWidth: 160 }}>
            <MultiSelectDropdown
              selected={provinceSelection}
              onChange={setProvinceSelection}
              placeholder="Tüm Bölgeler"
              allLabel="Tüm Bölgeler"
              options={PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))}
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
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: Math.max(700, activeCols.length * 140 + 100) }}>
                <thead>
                  <tr className="text-left border-b border-neutral-100 bg-neutral-50">
                    {activeCols.map((c) => (
                      <th key={c.key} className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                        {UNIFIED_COLUMN_LABELS[c.key]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {pageRows.map((row) => (
                    <tr key={row.key} className="hover:bg-neutral-50/80">
                      {activeCols.map((c, ci) => (
                        <td key={c.key} className={`px-5 py-3 whitespace-nowrap ${ci === 0 ? 'font-medium text-neutral-700' : 'text-neutral-600'}`}>
                          {unifiedCellValue(row, c.key, statusLabel)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 ? (
              <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100">
                <p className="text-xs text-neutral-400">
                  {rows.length} kayıttan {pageStart + 1}–{Math.min(pageStart + ALL_SHIPMENTS_REPORT_PAGE_SIZE, rows.length)} arası gösteriliyor
                </p>
                <div className="flex items-center gap-1">
                  <button
                    className="secondary-btn px-2.5 py-1.5"
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setPage(safePage - 1)}
                  >
                    ‹
                  </button>
                  {buildPaginationNumbers(safePage, totalPages).map((p, i) =>
                    p === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-xs text-neutral-400">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium ${p === safePage ? 'bg-primary text-white' : 'text-neutral-600 hover:bg-neutral-100'}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    className="secondary-btn px-2.5 py-1.5"
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setPage(safePage + 1)}
                  >
                    ›
                  </button>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {showColumnPanel ? (
        <ColumnPanelModal
          visibleColumns={visibleColumns}
          columnKeys={UNIFIED_COLUMNS}
          columnLabel={(key) => UNIFIED_COLUMN_LABELS[key as UnifiedColumnKey]}
          onToggle={(key, checked) => setVisibleColumns({ ...visibleColumns, [key]: checked })}
          onToggleAll={(checked) => {
            const next: Partial<Record<UnifiedColumnKey, boolean>> = {}
            UNIFIED_COLUMNS.forEach((c) => {
              next[c.key] = checked
            })
            setVisibleColumns(next)
          }}
          onClose={() => setShowColumnPanel(false)}
        />
      ) : null}
    </div>
  )
}
