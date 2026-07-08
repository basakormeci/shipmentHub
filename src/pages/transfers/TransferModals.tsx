import { COMPANIES, type TransferItem } from '../../data/catalog'
import { useT } from '../../hooks/useT'

export function CancelTransferModal({
  item,
  onClose,
  onConfirm,
}: {
  item: TransferItem | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

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
            <h3 className="font-semibold text-neutral-950 mb-1">{t('cancelTransferModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('cancelTransferModal.desc_before')}
              <strong className="text-neutral-700">{item.transferNo}</strong>
              {t('cancelTransferModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#fb3748' }} onClick={onConfirm}>
            {t('cancelTransferModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecallTransferModal({
  item,
  onClose,
  onConfirm,
}: {
  item: TransferItem | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#fff3eb] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" style={{ color: '#c2570e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-950 mb-1">{t('recallTransferModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('recallTransferModal.desc_before')}
              <strong className="text-neutral-700">{item.transferNo}</strong>
              {t('recallTransferModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#c2570e' }} onClick={onConfirm}>
            {t('recallTransferModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function TransferCarrierModal({
  item,
  companyId,
  onCompanyChange,
  onClose,
  onConfirm,
}: {
  item: TransferItem | null
  companyId: number | ''
  onCompanyChange: (id: number) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('transferCarrierModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('transferCarrierModal.desc_before')}
          <strong className="text-neutral-700">{item.transferNo}</strong>
          {t('transferCarrierModal.desc_after')}
        </p>
        <select className="form-input" value={companyId} onChange={(e) => onCompanyChange(+e.target.value)}>
          {COMPANIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={onConfirm}>
            {t('transferCarrierModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function TransferNodeModal({
  item,
  fromNodeId,
  toNodeId,
  nodes,
  onFromChange,
  onToChange,
  onClose,
  onConfirm,
}: {
  item: TransferItem | null
  fromNodeId: number | ''
  toNodeId: number | ''
  nodes: { id: number; name: string }[]
  onFromChange: (id: number) => void
  onToChange: (id: number) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

  const sameNode = fromNodeId !== '' && toNodeId !== '' && fromNodeId === toNodeId

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('transferNodeModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('transferNodeModal.desc_before')}
          <strong className="text-neutral-700">{item.transferNo}</strong>
          {t('transferNodeModal.desc_after')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{t('transferNodeModal.from')}</label>
            <select className="form-input" value={fromNodeId} onChange={(e) => onFromChange(+e.target.value)}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">{t('transferNodeModal.to')}</label>
            <select className="form-input" value={toNodeId} onChange={(e) => onToChange(+e.target.value)}>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        {sameNode ? <p className="form-error mt-2">{t('transferNodeModal.same_node_error')}</p> : null}
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" disabled={sameNode} onClick={onConfirm}>
            {t('transferNodeModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}
