import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES, SHIPMENT_STATUS, getCompany, type TransferItem, type ShipmentStatus } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { fmtDateTime } from '../../lib/format'
import { toast } from '../../lib/toast'
import {
  TRANSFER_COLUMNS,
  TRANSFER_SEARCH_FIELDS,
  exportTransfersCsv,
  filterTransfers,
  getNode,
  type TransferColumnKey,
  type TransferSearchField,
} from '../../lib/transfers'
import { buildPaginationNumbers, SHIPMENT_PAGE_SIZE } from '../../lib/shipments'
import { SearchInput } from '../../components/ui/SearchInput'
import { ColumnPanelModal } from '../../components/ui/ColumnPanelModal'
import { Dropdown } from '../../components/ui/Dropdown'
import { useHeaderSlotStore } from '../../stores/headerSlotStore'
import type { StockNode } from '../../data/seed'
import { CancelTransferModal, TransferBarcodePrintModal } from './TransferModals'

function TransferCell({
  colKey,
  item,
  nodes,
  statusLabel,
}: {
  colKey: TransferColumnKey
  item: TransferItem
  nodes: StockNode[]
  statusLabel: (s: ShipmentStatus) => string
}) {
  const t = useT()
  const from = getNode(nodes, item.fromNodeId)
  const to = getNode(nodes, item.toNodeId)
  const co = getCompany(item.companyId)
  const st = SHIPMENT_STATUS[item.status]
  const dt = fmtDateTime(item.createdAt)

  switch (colKey) {
    case 'transferNo':
      return (
        <Link to={`/transfers/${item.id}`} className="text-primary hover:text-primary-darker font-semibold">
          #{item.transferNo}
        </Link>
      )
    case 'dispatchNo':
      return <span className="text-neutral-600">{item.dispatchNo}</span>
    case 'companyId':
      return <span className="text-neutral-600">{co ? co.name : t('common.unknown')}</span>
    case 'trackingNo':
      return (
        <span className="text-neutral-500 font-mono text-xs" title={item.trackingNo}>
          {item.trackingNo}
        </span>
      )
    case 'from':
      return <span className="text-neutral-600">{from ? from.name : '-'}</span>
    case 'to':
      return <span className="text-neutral-600">{to ? to.name : '-'}</span>
    case 'createdAt':
      return (
        <div className="text-xs">
          <div className="font-medium text-neutral-700">{dt.time}</div>
          <div className="text-neutral-400">{dt.date}</div>
        </div>
      )
    case 'status':
      return <span className={`badge ${st.badge}`}>{statusLabel(item.status)}</span>
    case 'referenceId':
      return <span className="text-neutral-500 text-xs font-mono">{item.referenceId}</span>
    case 'packageNo':
      return <span className="text-neutral-500 text-xs font-mono">{item.packageNo}</span>
    case 'desi':
      return <span className="text-neutral-500">{item.desi}</span>
    case 'note':
      return <span className="text-neutral-500 text-xs">{item.note || '-'}</span>
    default:
      return null
  }
}

export function TransfersPage() {
  const t = useT()
  const navigate = useNavigate()
  const lang = useUiStore((s) => s.lang)
  const transfers = useDataStore((s) => s.transfers)
  const nodes = useDataStore((s) => s.nodes)
  const cancelTransfer = useDataStore((s) => s.cancelTransfer)

  const search = useUiStore((s) => s.transfersSearch)
  const searchField = useUiStore((s) => s.transfersSearchField)
  const filterStatus = useUiStore((s) => s.transfersFilterStatus)
  const filterCompanyId = useUiStore((s) => s.transfersFilterCompanyId)
  const dateFrom = useUiStore((s) => s.transfersDateFrom)
  const dateTo = useUiStore((s) => s.transfersDateTo)
  const page = useUiStore((s) => s.transfersPage)
  const visibleColumns = useUiStore((s) => s.transfersVisibleColumns)
  const setTransfersFilter = useUiStore((s) => s.setTransfersFilter)
  const resetTransfersFilters = useUiStore((s) => s.resetTransfersFilters)

  const [showFilters, setShowFilters] = useState(false)
  const [showColumnPanel, setShowColumnPanel] = useState(false)
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [cancelId, setCancelId] = useState<number | null>(null)
  const [barcodeTransfers, setBarcodeTransfers] = useState<TransferItem[]>([])

  const statusLabel = (key: ShipmentStatus) => t(`status.${key}`)
  const columnLabel = (key: TransferColumnKey) => t(`transferColumn.${key}`)

  const filters = useMemo(
    () => ({ search, searchField, filterStatus, filterCompanyId, dateFrom, dateTo, page, visibleColumns }),
    [search, searchField, filterStatus, filterCompanyId, dateFrom, dateTo, page, visibleColumns],
  )

  const list = useMemo(() => filterTransfers(transfers, nodes, filters), [transfers, nodes, filters])
  const totalPages = Math.max(1, Math.ceil(list.length / SHIPMENT_PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pageStart = (safePage - 1) * SHIPMENT_PAGE_SIZE
  const pageList = list.slice(pageStart, pageStart + SHIPMENT_PAGE_SIZE)
  const activeCols = TRANSFER_COLUMNS.filter((c) => visibleColumns[c.key] !== false)
  const extraFiltersActive = !!(filterCompanyId || dateFrom || dateTo)
  const filtersActive = !!(search || filterStatus !== 'all' || extraFiltersActive)
  const allVisibleSelected = pageList.length > 0 && pageList.every((x) => selectedIds.includes(x.id))
  const cancelTarget = cancelId != null ? transfers.find((tr) => tr.id === cancelId) ?? null : null

  function setPage(p: number) {
    setTransfersFilter({ transfersPage: Math.min(Math.max(1, p), totalPages) })
  }

  function toggleSelect(id: number, checked: boolean) {
    setSelectedIds((prev) => (checked ? (prev.includes(id) ? prev : [...prev, id]) : prev.filter((x) => x !== id)))
  }

  function toggleSelectAll(checked: boolean) {
    const visibleIds = pageList.map((x) => x.id)
    if (checked) {
      setSelectedIds((prev) => [...new Set([...prev, ...visibleIds])])
    } else {
      setSelectedIds((prev) => prev.filter((id) => !visibleIds.includes(id)))
    }
  }

  function handleExportCsv() {
    if (list.length === 0) {
      toast(t('toast.transfers_csv_none'), 'info')
      return
    }
    exportTransfersCsv(list, nodes, statusLabel, columnLabel, lang)
    toast(t('toast.transfers_csv_done', { n: list.length }), 'success')
  }

  function openBarcodeModal(targets: TransferItem[]) {
    if (targets.length === 0) return
    setBarcodeTransfers(targets)
  }

  function handleBulkBarcode() {
    const targets = selectedIds
      .map((id) => transfers.find((tr) => tr.id === id))
      .filter((tr): tr is TransferItem => tr != null)
    openBarcodeModal(targets)
  }

  function confirmCancel() {
    if (cancelId == null) return
    const updated = cancelTransfer(cancelId)
    if (updated) toast(t('toast.transfer_cancelled', { no: updated.transferNo }), 'info')
    setCancelId(null)
  }

  const setHeaderSlot = useHeaderSlotStore((s) => s.setHeaderSlot)
  const clearHeaderSlot = useHeaderSlotStore((s) => s.clearHeaderSlot)

  useLayoutEffect(() => {
    setHeaderSlot({
      subtitle: t('transfers.count', { n: list.length }),
      actions: (
        <>
          <button className="secondary-btn" type="button" onClick={() => navigate('/transfers/new')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('transfers.create_btn')}
          </button>
          <button className="secondary-btn" type="button" onClick={handleExportCsv}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            {t('transfers.export_csv')}
          </button>
          <button className="primary-btn" type="button" disabled={selectedIds.length === 0} onClick={handleBulkBarcode}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M4 5v14M8 5v14M11 5v14M15 5v14M18 5v14M21 5v14" />
            </svg>
            {t('shipments.barcode_bulk')}
            {selectedIds.length > 0 ? ` (${selectedIds.length})` : ''}
          </button>
        </>
      ),
    })
    return () => clearHeaderSlot()
  })

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100 flex-wrap">
          <Dropdown
            wrapperStyle={{ width: 190 }}
            value={searchField}
            onChange={(v) => setTransfersFilter({ transfersSearchField: v as TransferSearchField, transfersPage: 1 })}
            options={TRANSFER_SEARCH_FIELDS.map((f) => ({ value: f.key, label: t(`search.${f.key}`) }))}
          />
          <SearchInput
            wrapperClassName="flex-1"
            wrapperStyle={{ minWidth: 220 }}
            placeholder={t('transfers.search_placeholder')}
            value={search}
            onChange={(e) => setTransfersFilter({ transfersSearch: e.target.value, transfersPage: 1 })}
          />
          <button className="secondary-btn" type="button" onClick={() => setShowFilters((v) => !v)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
            </svg>
            {t('transfers.filters')}
            {extraFiltersActive ? (
              <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">●</span>
            ) : null}
          </button>
          <button className="secondary-btn" type="button" onClick={() => setShowColumnPanel(true)}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="7" height="16" rx="1.5" />
              <rect x="14" y="4" width="7" height="16" rx="1.5" />
            </svg>
            {t('transfers.edit_table')}
          </button>
          {filtersActive ? (
            <button className="text-xs text-primary hover:text-primary-darker font-medium" type="button" onClick={resetTransfersFilters}>
              {t('transfers.clear_filters')}
            </button>
          ) : null}
        </div>

        {showFilters ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-5 py-4 border-b border-neutral-100 bg-neutral-50/50">
            <div>
              <label className="form-label">{t('transfers.th_carrier')}</label>
              <Dropdown
                value={filterCompanyId}
                onChange={(v) => setTransfersFilter({ transfersFilterCompanyId: v, transfersPage: 1 })}
                placeholder={t('common.all')}
                options={[{ value: '', label: t('common.all') }, ...COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))]}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">{t('shipments.date_from')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateFrom}
                  onChange={(e) => setTransfersFilter({ transfersDateFrom: e.target.value, transfersPage: 1 })}
                />
              </div>
              <div>
                <label className="form-label">{t('shipments.date_to')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateTo}
                  onChange={(e) => setTransfersFilter({ transfersDateTo: e.target.value, transfersPage: 1 })}
                />
              </div>
            </div>
          </div>
        ) : null}

        {list.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />
            </svg>
            <p className="text-neutral-400 text-sm">{t('transfers.not_found')}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ minWidth: Math.max(700, activeCols.length * 130 + 260) }}>
                <thead>
                  <tr className="text-left border-b border-neutral-100">
                    <th className="px-4 py-3 w-10">
                      <input type="checkbox" checked={allVisibleSelected} onChange={(e) => toggleSelectAll(e.target.checked)} />
                    </th>
                    {activeCols.map((c) => (
                      <th key={c.key} className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">
                        {columnLabel(c.key)}
                      </th>
                    ))}
                    <th
                      className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right whitespace-nowrap sticky right-0 bg-white"
                      style={{ boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.06)' }}
                    >
                      {t('transfers.th_actions')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageList.map((x, i) => {
                    const even = i % 2 === 0
                    const stickyBg = even ? '#ffffff' : '#fafbfc'
                    return (
                      <tr key={x.id} className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={selectedIds.includes(x.id)} onChange={(e) => toggleSelect(x.id, e.target.checked)} />
                        </td>
                        {activeCols.map((c) => (
                          <td key={c.key} className="px-4 py-3 whitespace-nowrap">
                            <TransferCell colKey={c.key} item={x} nodes={nodes} statusLabel={statusLabel} />
                          </td>
                        ))}
                        <td
                          className="px-4 py-3 sticky right-0"
                          style={{ background: stickyBg, boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.06)' }}
                        >
                          <div className="flex justify-end gap-1">
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                              type="button"
                              title={t('transfers.detail_tooltip')}
                              onClick={() => navigate(`/transfers/${x.id}`)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                              </svg>
                            </button>
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                              type="button"
                              title={t('transfers.barcode_tooltip')}
                              onClick={() => openBarcodeModal([x])}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" d="M4 5v14M8 5v14M11 5v14M15 5v14M18 5v14M21 5v14" />
                              </svg>
                            </button>
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                              type="button"
                              title={t('transfers.cancel_tooltip')}
                              disabled={x.status === 'ShipmentCanceled' || x.status === 'DeliveredToStore'}
                              onClick={() => setCancelId(x.id)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 flex-wrap gap-3">
              <p className="text-xs text-neutral-400">
                {t('shipments.pagination_summary', {
                  from: pageStart + 1,
                  to: Math.min(pageStart + SHIPMENT_PAGE_SIZE, list.length),
                  total: list.length,
                })}
              </p>
              <div className="flex items-center gap-1">
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {buildPaginationNumbers(safePage, totalPages).map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-neutral-300 text-xs">
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${p === safePage ? 'bg-primary text-white' : 'text-neutral-500 hover:bg-neutral-100'}`}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </button>
                  ),
                )}
                <button
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed"
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {showColumnPanel ? (
        <ColumnPanelModal
          visibleColumns={visibleColumns}
          columnKeys={TRANSFER_COLUMNS}
          columnLabel={(key) => columnLabel(key as TransferColumnKey)}
          onToggle={(key, checked) => {
            setTransfersFilter({ transfersVisibleColumns: { ...visibleColumns, [key]: checked } })
          }}
          onToggleAll={(checked) => {
            const next: Partial<Record<TransferColumnKey, boolean>> = {}
            TRANSFER_COLUMNS.forEach((c) => {
              next[c.key] = checked
            })
            setTransfersFilter({ transfersVisibleColumns: next })
          }}
          onClose={() => setShowColumnPanel(false)}
        />
      ) : null}

      {cancelId != null ? <CancelTransferModal item={cancelTarget} onClose={() => setCancelId(null)} onConfirm={confirmCancel} /> : null}

      {barcodeTransfers.length > 0 ? (
        <TransferBarcodePrintModal transfers={barcodeTransfers} onClose={() => setBarcodeTransfers([])} />
      ) : null}
    </div>
  )
}
