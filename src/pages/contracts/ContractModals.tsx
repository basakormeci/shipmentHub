import { useMemo, useState } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import type { ContractCredential, ContractForm } from '../../data/catalog'

export function ContractDeleteModal({ contractId, onClose }: { contractId: number; onClose: () => void }) {
  const t = useT()
  const contract = useDataStore((s) => s.contracts.find((c) => c.id === contractId))
  const removeContract = useDataStore((s) => s.removeContract)

  if (!contract) return null

  function confirm() {
    const deleted = removeContract(contractId)
    toast(t('toast.contract_deleted', { name: deleted?.name ?? '' }), 'info')
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-950 mb-1">{t('deleteContractModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('deleteContractModal.desc_before')}
              <strong className="text-neutral-700">{contract.name}</strong>
              {t('deleteContractModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" style={{ background: '#fb3748' }} type="button" onClick={confirm}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            {t('deleteContractModal.confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ContractNodeModal({
  credId,
  f,
  onUpdate,
  onClose,
}: {
  credId: number
  f: ContractForm
  onUpdate: (credentials: ContractCredential[]) => void
  onClose: () => void
}) {
  const t = useT()
  const nodes = useDataStore((s) => s.nodes)
  const cred = f.credentials.find((c) => c.id === credId)
  const [search, setSearch] = useState('')
  const [selectedNodeIds, setSelectedNodeIds] = useState<number[]>([])

  const filtered = useMemo(() => {
    if (!cred) return []
    const addedIds = new Set(cred.nodes.map((n) => n.id))
    const q = search.toLowerCase()
    return nodes.filter(
      (n) =>
        !addedIds.has(n.id) &&
        (q === '' || n.name.toLowerCase().includes(q) || n.code.toLowerCase().includes(q)),
    )
  }, [cred, nodes, search])

  if (!cred) return null

  function removeNode(nodeId: number) {
    onUpdate(
      f.credentials.map((c) =>
        c.id === credId ? { ...c, nodes: c.nodes.filter((n) => n.id !== nodeId) } : c,
      ),
    )
  }

  function toggleSelection(nodeId: number, checked: boolean) {
    setSelectedNodeIds((prev) => (checked ? [...prev, nodeId] : prev.filter((id) => id !== nodeId)))
  }

  function toggleAll() {
    if (selectedNodeIds.length === filtered.length) {
      setSelectedNodeIds([])
    } else {
      setSelectedNodeIds(filtered.map((n) => n.id))
    }
  }

  function addSelected() {
    const toAdd = nodes.filter((n) => selectedNodeIds.includes(n.id))
    if (!toAdd.length) {
      toast(t('toast.node_selection_required'), 'info')
      return
    }
    onUpdate(
      f.credentials.map((c) =>
        c.id === credId
          ? { ...c, nodes: [...c.nodes, ...toAdd.map((n) => ({ id: n.id, name: n.name, code: n.code }))] }
          : c,
      ),
    )
    setSelectedNodeIds([])
    toast(t('toast.nodes_added', { n: toAdd.length }), 'success')
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-xl flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-neutral-950">{t('nodeModal.title')}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{cred.name}</p>
          </div>
          <button type="button" className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('nodeModal.added_nodes')}</p>
              <span className="text-xs text-neutral-400">{t('nodeModal.node_count', { n: cred.nodes.length })}</span>
            </div>
            {cred.nodes.length === 0 ? (
              <div className="text-center py-5 border border-dashed border-neutral-200 rounded-lg text-neutral-400 text-sm">
                {t('nodeModal.no_nodes_added')}
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100">
                {cred.nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between px-4 py-3 hover:bg-neutral-50/80 group">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#e3f7ec] flex items-center justify-center flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-[#1fc16b]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">{node.name}</p>
                        <p className="text-xs text-neutral-400 font-mono">{node.code}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="opacity-0 group-hover:opacity-100 text-neutral-300 hover:text-[#fb3748] transition-all p-1 rounded"
                      onClick={() => removeNode(node.id)}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{t('nodeModal.add_node_header')}</p>
              {filtered.length > 0 ? (
                <button type="button" className="text-xs text-primary hover:text-primary-darker font-medium" onClick={toggleAll}>
                  {selectedNodeIds.length === filtered.length ? t('nodeModal.deselect_all') : t('nodeModal.select_all')}
                </button>
              ) : null}
            </div>

            <div className="relative mb-3">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                className="form-input pl-9 text-sm"
                placeholder={t('nodeModal.search_placeholder')}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setSelectedNodeIds([])
                }}
              />
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-sm border border-dashed border-neutral-200 rounded-lg">
                {search ? t('nodeModal.no_results_search') : t('nodeModal.all_added')}
              </div>
            ) : (
              <div className="border border-neutral-200 rounded-lg overflow-hidden divide-y divide-neutral-100" style={{ maxHeight: 220, overflowY: 'auto' }}>
                {filtered.map((node) => {
                  const sel = selectedNodeIds.includes(node.id)
                  return (
                    <label
                      key={node.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-primary-lighter/50 transition-colors ${sel ? 'bg-primary-lighter/30' : ''}`}
                    >
                      <input
                        type="checkbox"
                        className="flex-shrink-0"
                        checked={sel}
                        onChange={(e) => toggleSelection(node.id, e.target.checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-700">{node.name}</p>
                        <p className="text-xs text-neutral-400 font-mono">{node.code}</p>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <span className="text-sm text-neutral-500">
            {selectedNodeIds.length > 0 ? t('nodeModal.selected_count', { n: selectedNodeIds.length }) : t('nodeModal.none_selected')}
          </span>
          <div className="flex items-center gap-2">
            <button className="secondary-btn py-2" type="button" onClick={onClose}>
              {t('common.close')}
            </button>
            <button className="primary-btn py-2" type="button" onClick={addSelected} disabled={selectedNodeIds.length === 0}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              {selectedNodeIds.length > 0 ? t('nodeModal.add_btn', { n: selectedNodeIds.length }) : t('nodeModal.add_btn_empty')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
