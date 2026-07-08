import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TRANSFER_STATUS, getCompany, type TransferStatus } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { fmtDateTimeStr } from '../../lib/format'
import { filterTransfers, getNode, getTransferStatusTabs } from '../../lib/transfers'

export function TransfersPage() {
  const t = useT()
  const navigate = useNavigate()
  const transfers = useDataStore((s) => s.transfers)
  const nodes = useDataStore((s) => s.nodes)

  const search = useUiStore((s) => s.transfersSearch)
  const filterStatus = useUiStore((s) => s.transfersFilterStatus)
  const setTransfersFilter = useUiStore((s) => s.setTransfersFilter)
  const resetTransfersFilters = useUiStore((s) => s.resetTransfersFilters)

  const statusLabel = (key: TransferStatus) => t(`transferStatus.${key}`)

  const list = useMemo(
    () => filterTransfers(transfers, nodes, { search, filterStatus }),
    [transfers, nodes, search, filterStatus],
  )
  const filtersActive = !!(search || filterStatus !== 'all')

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">{t('transfers.count', { n: list.length })}</p>
        <button className="primary-btn" type="button" onClick={() => navigate('/transfers/new')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('transfers.create_btn')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-4 flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px]">
          <svg
            className="w-4 h-4 text-neutral-300 absolute left-3 top-1/2 -translate-y-1/2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            className="form-input pl-9"
            placeholder={t('transfers.search_placeholder')}
            value={search}
            onChange={(e) => setTransfersFilter({ transfersSearch: e.target.value })}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {getTransferStatusTabs().map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setTransfersFilter({ transfersFilterStatus: tab.key })}
            >
              {tab.key === 'all' ? t('common.all') : statusLabel(tab.key)}
            </button>
          ))}
        </div>
        {filtersActive ? (
          <button className="text-xs text-primary hover:text-primary-darker font-medium" type="button" onClick={resetTransfersFilters}>
            {t('transfers.clear_filters')}
          </button>
        ) : null}
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-100">
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_transfer_no')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_from')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_to')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_carrier')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_desi')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_status')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('transfers.th_date')}</th>
              </tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-neutral-400 text-sm">
                    {t('transfers.not_found')}
                  </td>
                </tr>
              ) : (
                list.map((x, i) => {
                  const from = getNode(nodes, x.fromNodeId)
                  const to = getNode(nodes, x.toNodeId)
                  const co = getCompany(x.companyId)
                  const st = TRANSFER_STATUS[x.status]
                  const even = i % 2 === 0
                  return (
                    <tr
                      key={x.id}
                      className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors cursor-pointer`}
                      onClick={() => navigate(`/transfers/${x.id}`)}
                    >
                      <td className="px-5 py-3.5 text-primary font-semibold">#{x.transferNo}</td>
                      <td className="px-5 py-3.5 text-neutral-600">{from ? from.name : '-'}</td>
                      <td className="px-5 py-3.5 text-neutral-600">{to ? to.name : '-'}</td>
                      <td className="px-5 py-3.5 text-neutral-500">{co ? co.name : t('common.unknown')}</td>
                      <td className="px-5 py-3.5 text-neutral-500">{x.desi}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${st.badge}`}>{statusLabel(x.status)}</span>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-400 text-xs">{fmtDateTimeStr(x.createdAt)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
