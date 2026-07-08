import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { RETURN_STATUS, getCompany, type ReturnStatus } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { filterReturns, getOriginalShipment, getReturnCompanyId, getReturnStatusTabs } from '../../lib/returns'
import { CancelReturnModal } from './ReturnModals'

export function ReturnsPage() {
  const t = useT()
  const navigate = useNavigate()
  const returns = useDataStore((s) => s.returns)
  const shipments = useDataStore((s) => s.shipments)
  const cancelReturn = useDataStore((s) => s.cancelReturn)

  const search = useUiStore((s) => s.returnsSearch)
  const filterStatus = useUiStore((s) => s.returnsFilterStatus)
  const setReturnsFilter = useUiStore((s) => s.setReturnsFilter)
  const resetReturnsFilters = useUiStore((s) => s.resetReturnsFilters)

  const [cancelId, setCancelId] = useState<number | null>(null)

  const statusLabel = (key: ReturnStatus) => t(`returnStatus.${key}`)
  const reasonLabel = (key: string) => t(`returnReason.${key}`)

  const list = useMemo(
    () => filterReturns(returns, shipments, { search, filterStatus }),
    [returns, shipments, search, filterStatus],
  )
  const cancelTarget = cancelId != null ? returns.find((r) => r.id === cancelId) ?? null : null
  const filtersActive = !!(search || filterStatus !== 'all')

  function confirmCancel() {
    if (cancelId == null) return
    const updated = cancelReturn(cancelId)
    if (updated) toast(t('toast.return_cancelled', { no: updated.returnNo }), 'info')
    setCancelId(null)
  }

  function handleBarcode() {
    toast(t('returns.barcode_soon'), 'info')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">{t('returns.count', { n: list.length })}</p>
        <button className="primary-btn" type="button" onClick={() => navigate('/returns/new')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('returns.create_btn')}
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-neutral-100 flex-wrap">
          {getReturnStatusTabs().map((tab) => {
            const count = tab.key === 'all' ? returns.length : returns.filter((x) => x.status === tab.key).length
            return (
              <button
                key={tab.key}
                type="button"
                className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
                onClick={() => setReturnsFilter({ returnsFilterStatus: tab.key })}
              >
                {tab.key === 'all' ? t('common.all') : statusLabel(tab.key)}
                <span className="ml-1 text-xs opacity-60">{count}</span>
              </button>
            )
          })}
        </div>

        <div className="flex items-center gap-3 px-5 py-3 border-b border-neutral-100">
          <div className="relative flex-1" style={{ maxWidth: 360 }}>
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="form-input pl-9"
              placeholder={t('returns.search_placeholder')}
              value={search}
              onChange={(e) => setReturnsFilter({ returnsSearch: e.target.value })}
            />
          </div>
          {filtersActive ? (
            <button className="text-xs text-primary hover:text-primary-darker font-medium" type="button" onClick={resetReturnsFilters}>
              {t('returns.clear_filters')}
            </button>
          ) : null}
        </div>

        {list.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            <p className="text-neutral-400 text-sm">{t('returns.not_found')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-100">
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_return_no')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_original')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_carrier')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_reason')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_request_date')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('returns.th_status')}</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">{t('returns.th_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {list.map((x, i) => {
                  const orig = getOriginalShipment(shipments, x.originalShipmentId)
                  const companyId = getReturnCompanyId(x, shipments)
                  const co = companyId != null ? getCompany(companyId) : null
                  const st = RETURN_STATUS[x.status]
                  const even = i % 2 === 0
                  return (
                    <tr key={x.id} className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
                      <td className="px-5 py-3.5">
                        <Link to={`/returns/${x.id}`} className="text-primary hover:text-primary-darker font-semibold">
                          {x.returnNo}
                        </Link>
                      </td>
                      <td className="px-5 py-3.5 text-neutral-600">{orig ? `#${orig.shipmentNo}` : '-'}</td>
                      <td className="px-5 py-3.5 text-neutral-600">{co ? co.name : t('common.unknown')}</td>
                      <td className="px-5 py-3.5 text-neutral-500">{reasonLabel(x.reason)}</td>
                      <td className="px-5 py-3.5 text-neutral-500 text-[13px]">{fmtDateTimeStr(x.requestDate)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${st.badge}`}>{statusLabel(x.status)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            className="action-btn"
                            type="button"
                            title={t('returns.detail_tooltip')}
                            onClick={() => navigate(`/returns/${x.id}`)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </button>
                          <button className="action-btn" type="button" title={t('returns.barcode_tooltip')} onClick={handleBarcode}>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" d="M4 5v14M8 5v14M11 5v14M15 5v14M18 5v14M21 5v14" />
                            </svg>
                          </button>
                          <button
                            className="action-btn hover:text-[#ad1f2b] hover:bg-[#ffebec] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                            type="button"
                            title={t('returns.cancel_tooltip')}
                            disabled={x.status === 'cancelled' || x.status === 'completed'}
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
        )}
      </div>

      {cancelId != null ? <CancelReturnModal item={cancelTarget} onClose={() => setCancelId(null)} onConfirm={confirmCancel} /> : null}
    </div>
  )
}
