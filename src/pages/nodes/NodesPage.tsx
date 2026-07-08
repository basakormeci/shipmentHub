import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { getNodeUsage } from '../../lib/contracts'
import type { StockNode } from '../../data/seed'

function NodeCreateModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const t = useT()
  const addNode = useDataStore((s) => s.addNode)
  const [name, setName] = useState('')
  const [code, setCode] = useState('')

  if (!open) return null

  const canSave = name.trim() && code.trim()

  function save() {
    if (!canSave) return
    const node = addNode(name, code)
    toast(t('nodes.toast_created', { name: node.name }), 'success')
    setName('')
    setCode('')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-4">{t('nodes.create_title')}</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label">
              {t('nodes.field_name')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={name}
              placeholder={t('nodes.name_placeholder')}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label">
              {t('nodes.field_code')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={code}
              placeholder={t('nodes.code_placeholder')}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={save} disabled={!canSave}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t('common.create')}
          </button>
        </div>
      </div>
    </div>
  )
}

function NodeDeleteModal({
  node,
  onClose,
}: {
  node: StockNode | null
  onClose: () => void
}) {
  const t = useT()
  const removeNode = useDataStore((s) => s.removeNode)
  if (!node) return null

  function confirm() {
    const deleted = removeNode(node!.id)
    toast(
      deleted ? t('nodes.toast_deleted', { name: deleted.name }) : t('nodes.toast_deleted', { name: '' }),
      'info',
    )
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ffebec] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#fb3748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-950 mb-1">{t('nodes.delete_title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('nodes.delete_desc_before')}
              <strong className="text-neutral-700">{node.name}</strong>
              {t('nodes.delete_desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" style={{ background: '#fb3748' }} type="button" onClick={confirm}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            {t('nodes.delete_confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

function NodeRow({ node }: { node: StockNode }) {
  const t = useT()
  const contracts = useDataStore((s) => s.contracts)
  const expanded = useUiStore((s) => !!s.nodeListExpanded[node.id])
  const toggle = useUiStore((s) => s.toggleNodeExpanded)
  const [deleteTarget, setDeleteTarget] = useState(false)

  const usage = useMemo(() => getNodeUsage(node.id, contracts), [node.id, contracts])
  const companyCount = new Set(usage.map((u) => u.companyId)).size

  return (
    <>
      <div>
        <div
          className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-neutral-50/80 transition-colors"
          onClick={() => toggle(node.id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary-lighter flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="5" rx="1" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" />
                <line x1="10" y1="12" x2="14" y2="12" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-700">{node.name}</p>
              <p className="text-xs text-neutral-400 font-mono">{node.code}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {companyCount > 0 ? (
              <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
                {t('nodes.companies_count', { n: companyCount })}
              </span>
            ) : (
              <span className="text-xs font-medium text-neutral-400 bg-neutral-50 px-2.5 py-1 rounded-full">
                {t('nodes.not_linked')}
              </span>
            )}
            <button
              type="button"
              className="text-neutral-300 hover:text-[#fb3748] transition-colors p-1 rounded"
              title={t('nodes.delete_title')}
              onClick={(e) => {
                e.stopPropagation()
                setDeleteTarget(true)
              }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
            <svg
              className="w-4 h-4 text-neutral-400 transition-transform duration-150"
              style={{ transform: `rotate(${expanded ? 180 : 0}deg)` }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
        {expanded ? (
          <div className="px-5 pb-4 bg-neutral-50/50">
            {usage.length === 0 ? (
              <div className="text-center py-6 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-lg">
                {t('nodes.not_linked_desc')}
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-neutral-100">
                      <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('nodes.col_company')}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('nodes.col_credential')}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('nodes.col_contract')}</th>
                      <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">{t('nodes.col_status')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {usage.map((u) => (
                      <tr key={`${u.contractId}-${u.credentialName}`}>
                        <td className="px-4 py-2.5 font-medium text-neutral-700">{u.companyName}</td>
                        <td className="px-4 py-2.5 text-neutral-500">{u.credentialName}</td>
                        <td className="px-4 py-2.5">
                          <Link to={`/contracts/${u.contractId}/edit`} className="text-primary hover:text-primary-darker font-medium" onClick={(e) => e.stopPropagation()}>
                            {u.contractName}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5">
                          <span className={`badge ${u.contractStatus === 'active' ? 'badge-active' : 'badge-passive'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${u.contractStatus === 'active' ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
                            {u.contractStatus === 'active' ? t('common.active') : t('common.passive')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
      {deleteTarget ? <NodeDeleteModal node={node} onClose={() => setDeleteTarget(false)} /> : null}
    </>
  )
}

export function NodesPage() {
  const t = useT()
  const nodes = useDataStore((s) => s.nodes)
  const search = useUiStore((s) => s.nodeListSearch)
  const setSearch = useUiStore((s) => s.setNodeListSearch)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    if (!q) return nodes
    return nodes.filter((n) => n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q))
  }, [nodes, search])

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">{t('nodes.count', { n: nodes.length })}</p>
        <button className="primary-btn" type="button" onClick={() => setCreateOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {t('nodes.new')}
        </button>
      </div>

      <div className="relative mb-4">
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
          placeholder={t('nodes.search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden divide-y divide-neutral-100">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <svg className="w-10 h-10 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-neutral-400 text-sm">{t('nodes.not_found')}</p>
          </div>
        ) : (
          filtered.map((node) => <NodeRow key={node.id} node={node} />)
        )}
      </div>

      <NodeCreateModal open={createOpen} onClose={() => setCreateOpen(false)} />
    </div>
  )
}
