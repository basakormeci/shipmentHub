import { useLayoutEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES, TRANSFER_STATUS, getCompany, type TransferItem, type TransferStatus } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { fmtDateTimeStr } from '../../lib/format'
import {
  TRANSFER_COLUMNS,
  TRANSFER_SEARCH_FIELDS,
  filterTransfers,
  getNode,
  getTransferStatusTabs,
  type TransferColumnKey,
  type TransferSearchField,
} from '../../lib/transfers'
import { SearchInput } from '../../components/ui/SearchInput'
import { ColumnPanelModal } from '../../components/ui/ColumnPanelModal'
import { useHeaderSlotStore } from '../../stores/headerSlotStore'
import type { StockNode } from '../../data/seed'

function TransferCell({
  colKey,
  item,
  nodes,
  statusLabel,
}: {
  colKey: TransferColumnKey
  item: TransferItem
  nodes: StockNode[]
  statusLabel: (s: TransferStatus) => string
}) {
  const t = useT()
  const from = getNode(nodes, item.fromNodeId)
  const to = getNode(nodes, item.toNodeId)
  const co = getCompany(item.companyId)
  const st = TRANSFER_STATUS[item.status]

  switch (colKey) {
    case 'transferNo':
      return (
        <Link to={`/transfers/${item.id}`} className="text-primary hover:text-primary-darker font-semibold">
          #{item.transferNo}
        </Link>
      )
    case 'from':
      return <span className="text-neutral-600">{from ? from.name : '-'}</span>
    case 'to':
      return <span className="text-neutral-600">{to ? to.name : '-'}</span>
    case 'carrier':
      return <span className="text-neutral-500">{co ? co.name : t('common.unknown')}</span>
    case 'desi':
      return <span className="text-neutral-500">{item.desi}</span>
    case 'status':
      return <span className={`badge ${st.badge}`}>{statusLabel(item.status)}</span>
    case 'date':
      return <span className="text-neutral-400 text-xs">{fmtDateTimeStr(item.createdAt)}</span>
    default:
      return null
  }
}

export function TransfersPage() {
  const t = useT()
  const navigate = useNavigate()
  const transfers = useDataStore((s) => s.transfers)
  const nodes = useDataStore((s) => s.nodes)

  const search = useUiStore((s) => s.transfersSearch)
  const searchField = useUiStore((s) => s.transfersSearchField)
  const filterStatus = useUiStore((s) => s.transfersFilterStatus)
  const filterCompanyId = useUiStore((s) => s.transfersFilterCompanyId)
  const dateFrom = useUiStore((s) => s.transfersDateFrom)
  const dateTo = useUiStore((s) => s.transfersDateTo)
  const visibleColumns = useUiStore((s) => s.transfersVisibleColumns)
  const setTransfersFilter = useUiStore((s) => s.setTransfersFilter)
  const resetTransfersFilters = useUiStore((s) => s.resetTransfersFilters)

  const [showFilters, setShowFilters] = useState(false)
  const [showColumnPanel, setShowColumnPanel] = useState(false)

  const statusLabel = (key: TransferStatus) => t(`transferStatus.${key}`)
  const columnLabel = (key: TransferColumnKey) => {
    switch (key) {
      case 'transferNo':
        return t('transfers.th_transfer_no')
      case 'from':
        return t('transfers.th_from')
      case 'to':
        return t('transfers.th_to')
      case 'carrier':
        return t('transfers.th_carrier')
      case 'desi':
        return t('transfers.th_desi')
      case 'status':
        return t('transfers.th_status')
      case 'date':
        return t('transfers.th_date')
      default:
        return ''
    }
  }

  const filters = useMemo(
    () => ({ search, searchField, filterStatus, filterCompanyId, dateFrom, dateTo }),
    [search, searchField, filterStatus, filterCompanyId, dateFrom, dateTo],
  )

  const list = useMemo(() => filterTransfers(transfers, nodes, filters), [transfers, nodes, filters])
  const activeCols = TRANSFER_COLUMNS.filter((c) => visibleColumns[c.key] !== false)
  const extraFiltersActive = !!(filterCompanyId || dateFrom || dateTo)
  const filtersActive = !!(search || filterStatus !== 'all' || extraFiltersActive)

  const setHeaderSlot = useHeaderSlotStore((s) => s.setHeaderSlot)
  const clearHeaderSlot = useHeaderSlotStore((s) => s.clearHeaderSlot)

  useLayoutEffect(() => {
    setHeaderSlot({
      subtitle: t('transfers.count', { n: list.length }),
      actions: (
        <button className="secondary-btn" type="button" onClick={() => navigate('/transfers/new')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('transfers.create_btn')}
        </button>
      ),
    })
    return () => clearHeaderSlot()
  })

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-neutral-100 flex-wrap">
          {getTransferStatusTabs().map((tab) => {
            const count = tab.key === 'all' ? transfers.length : transfers.filter((x) => x.status === tab.key).length
            return (
              <button
                key={tab.key}
                type="button"
                className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
                onClick={() => setTransfersFilter({ transfersFilterStatus: tab.key })}
              >
                {tab.key === 'all' ? t('common.all') : statusLabel(tab.key)}
                <span className="ml-1 text-xs opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100 flex-wrap">
          <select
            className="form-input"
            style={{ width: 190 }}
            value={searchField}
            onChange={(e) => setTransfersFilter({ transfersSearchField: e.target.value as TransferSearchField })}
          >
            {TRANSFER_SEARCH_FIELDS.map((f) => (
              <option key={f.key} value={f.key}>
                {t(`search.${f.key}`)}
              </option>
            ))}
          </select>
          <SearchInput
            wrapperClassName="flex-1"
            wrapperStyle={{ minWidth: 220 }}
            placeholder={t('transfers.search_placeholder')}
            value={search}
            onChange={(e) => setTransfersFilter({ transfersSearch: e.target.value })}
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
              <select
                className="form-input"
                value={filterCompanyId}
                onChange={(e) => setTransfersFilter({ transfersFilterCompanyId: e.target.value })}
              >
                <option value="">{t('common.all')}</option>
                {COMPANIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="form-label">{t('shipments.date_from')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateFrom}
                  onChange={(e) => setTransfersFilter({ transfersDateFrom: e.target.value })}
                />
              </div>
              <div>
                <label className="form-label">{t('shipments.date_to')}</label>
                <input
                  type="date"
                  className="form-input"
                  value={dateTo}
                  onChange={(e) => setTransfersFilter({ transfersDateTo: e.target.value })}
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-100">
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
                {list.map((x, i) => {
                  const even = i % 2 === 0
                  const stickyBg = even ? '#ffffff' : '#fafbfc'
                  return (
                    <tr key={x.id} className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
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
                            className="action-btn"
                            type="button"
                            title={t('transfers.detail_tooltip')}
                            onClick={() => navigate(`/transfers/${x.id}`)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
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
    </div>
  )
}
