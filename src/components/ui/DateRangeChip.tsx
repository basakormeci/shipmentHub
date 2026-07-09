import { useEffect, useRef, useState } from 'react'
import type { DateWindow } from '../../lib/dashboard'

/**
 * Per-widget date-range override. Shows the inherited (global) range by default;
 * clicking opens a small popover to pin this one widget to its own range.
 */
export function DateRangeChip({
  value,
  onChange,
  onClear,
  inheritedLabel,
}: {
  value: DateWindow | null
  onChange: (v: DateWindow) => void
  onClear: () => void
  inheritedLabel: string
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    return () => document.removeEventListener('mousedown', onDocMouseDown)
  }, [open])

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`inline-flex items-center gap-1.5 text-[11px] font-semibold rounded-lg px-2 py-1.5 border transition-colors ${
          value ? 'bg-primary-lighter border-primary-light text-primary-darker' : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:bg-neutral-100'
        }`}
      >
        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        {value ? `${value.from || '…'} – ${value.to || '…'}` : inheritedLabel}
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-lg p-3 flex flex-col gap-2.5" style={{ width: 220 }}>
          <div>
            <label className="form-label">Başlangıç</label>
            <input
              type="date"
              className="form-input"
              value={value?.from ?? ''}
              onChange={(e) => onChange({ from: e.target.value, to: value?.to ?? '' })}
            />
          </div>
          <div>
            <label className="form-label">Bitiş</label>
            <input
              type="date"
              className="form-input"
              value={value?.to ?? ''}
              onChange={(e) => onChange({ from: value?.from ?? '', to: e.target.value })}
            />
          </div>
          {value ? (
            <button
              type="button"
              className="text-[11px] font-semibold text-primary hover:text-primary-darker text-left"
              onClick={() => {
                onClear()
                setOpen(false)
              }}
            >
              Genel filtreye dön
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
