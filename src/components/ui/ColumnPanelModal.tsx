import { useT } from '../../hooks/useT'

export function ColumnPanelModal({
  visibleColumns,
  columnKeys,
  columnLabel,
  onToggle,
  onToggleAll,
  onClose,
}: {
  visibleColumns: Partial<Record<string, boolean>>
  columnKeys: { key: string }[]
  columnLabel: (key: string) => string
  onToggle: (key: string, checked: boolean) => void
  onToggleAll: (checked: boolean) => void
  onClose: () => void
}) {
  const t = useT()
  const allOn = columnKeys.every((c) => visibleColumns[c.key] !== false)

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <div>
            <h3 className="font-semibold text-neutral-950">{t('columnPanel.title')}</h3>
            <p className="text-xs text-neutral-400 mt-0.5">{t('columnPanel.desc')}</p>
          </div>
          <button className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors" type="button" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5">
          <label className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer mb-1">
            <input type="checkbox" checked={allOn} onChange={(e) => onToggleAll(e.target.checked)} />
            <span className="text-sm font-semibold text-neutral-950">{t('columnPanel.select_all')}</span>
          </label>
          <div className="border-t border-neutral-100 my-2" />
          {columnKeys.map((c) => (
            <label key={c.key} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-neutral-50 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns[c.key] !== false}
                onChange={(e) => onToggle(c.key, e.target.checked)}
              />
              <span className="text-sm text-neutral-700">{columnLabel(c.key)}</span>
            </label>
          ))}
          <div className="border-t border-neutral-100 my-2" />
          <div className="flex items-center gap-3 px-3 py-2.5 opacity-60">
            <input type="checkbox" checked disabled readOnly />
            <span className="text-sm text-neutral-500">
              {t('columnPanel.actions_always_visible')} <span className="text-xs">{t('columnPanel.always_visible_hint')}</span>
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <button className="primary-btn py-2" type="button" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  )
}
