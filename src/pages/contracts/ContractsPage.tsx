import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getCompany, type Contract } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { fmtDate } from '../../lib/format'
import { exportContractsCsv, type ContractFilterStatus } from '../../lib/contracts'
import { toast } from '../../lib/toast'
import { ContractDeleteModal } from './ContractModals'

function ContractRow({
  contract,
  index,
  onToggle,
  onDelete,
}: {
  contract: Contract
  index: number
  onToggle: (id: number) => void
  onDelete: (id: number) => void
}) {
  const t = useT()
  const co = getCompany(contract.companyId)
  const even = index % 2 === 0
  const toggleLabel = contract.status === 'active' ? t('contracts.row_deactivate') : t('contracts.row_activate')

  return (
    <tr className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-lighter flex items-center justify-center text-primary-darker font-bold text-xs flex-shrink-0">
            {co ? co.name.slice(0, 1) : '?'}
          </div>
          <span className="font-medium text-neutral-700">{co ? co.name : t('common.unknown')}</span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-neutral-600">
        <div className="flex items-center gap-1.5">
          {contract.name}
          {contract.isDefault ? (
            <svg className="w-3.5 h-3.5 text-[#f0b429] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-label="Varsayılan">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ) : null}
        </div>
      </td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs ${contract.orderShipping ? 'text-primary' : 'text-neutral-300'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            {t('contracts.shipping_order')}
          </span>
          <span className={`flex items-center gap-1 text-xs ${contract.returnShipping ? 'text-[#7d52f4]' : 'text-neutral-300'}`}>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            {t('contracts.shipping_return')}
          </span>
        </div>
      </td>
      <td className="px-5 py-3.5 text-neutral-500 text-xs font-medium">
        {contract.minDesi}–{contract.maxDesi} desi
      </td>
      <td className="px-5 py-3.5">
        <span className={`badge ${contract.status === 'active' ? 'badge-active' : 'badge-passive'}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${contract.status === 'active' ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
          {contract.status === 'active' ? t('common.active') : t('common.passive')}
        </span>
      </td>
      <td className="px-5 py-3.5 text-neutral-500 text-[13px]">{fmtDate(contract.createdAt)}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-1 justify-end">
          <Link
            to={`/contracts/${contract.id}/edit`}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
            title={t('contracts.row_edit')}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
            title={toggleLabel}
            onClick={() => onToggle(contract.id)}
          >
            {contract.status === 'active' ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
            title={t('contracts.row_delete')}
            onClick={() => onDelete(contract.id)}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export function ContractsPage() {
  const t = useT()
  const navigate = useNavigate()
  const lang = useUiStore((s) => s.lang)
  const contracts = useDataStore((s) => s.contracts)
  const toggleContractStatus = useDataStore((s) => s.toggleContractStatus)
  const filterStatus = useUiStore((s) => s.contractsFilterStatus)
  const setContractsFilterStatus = useUiStore((s) => s.setContractsFilterStatus)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = useMemo(
    () => contracts.filter((c) => (filterStatus === 'all' ? true : c.status === filterStatus)),
    [contracts, filterStatus],
  )

  const tabs: { key: ContractFilterStatus; label: string; count: number }[] = [
    { key: 'all', label: t('common.all'), count: contracts.length },
    { key: 'active', label: t('common.active'), count: contracts.filter((c) => c.status === 'active').length },
    { key: 'passive', label: t('common.passive'), count: contracts.filter((c) => c.status === 'passive').length },
  ]

  function handleToggle(id: number) {
    const updated = toggleContractStatus(id)
    if (!updated) return
    toast(
      updated.status === 'active'
        ? t('toast.contract_activated', { name: updated.name })
        : t('toast.contract_deactivated', { name: updated.name }),
      updated.status === 'active' ? 'success' : 'info',
    )
  }

  function handleExport() {
    if (!exportContractsCsv(contracts, lang)) {
      toast(t('toast.contracts_csv_none'), 'info')
      return
    }
    toast(t('toast.contracts_csv_done', { n: contracts.length }), 'success')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">{t('contracts.count', { n: contracts.length })}</p>
        <div className="flex items-center gap-2">
          <button className="secondary-btn" type="button" onClick={handleExport}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
            </svg>
            {t('contracts.csv_export')}
          </button>
          <button className="primary-btn" type="button" onClick={() => navigate('/contracts/new')}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            {t('contracts.new')}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-neutral-100">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`filter-tab ${filterStatus === tab.key ? 'active' : ''}`}
              onClick={() => setContractsFilterStatus(tab.key)}
            >
              {tab.label}
              <span className="ml-1 text-xs opacity-60">{tab.count}</span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-neutral-400 text-sm">{t('contracts.not_found')}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-100">
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_company')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_name')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_shipping')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_desi')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_status')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('contracts.col_date')}</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">{t('contracts.col_actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <ContractRow key={c.id} contract={c} index={i} onToggle={handleToggle} onDelete={setDeleteId} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {deleteId != null ? <ContractDeleteModal contractId={deleteId} onClose={() => setDeleteId(null)} /> : null}
    </div>
  )
}
