import { useEffect, useRef, useState } from 'react'
import { lastNDaysRange } from '../../lib/dashboard'

const MONTHS_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

function fmt(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  return `${d} ${MONTHS_TR[m - 1]} ${y}`
}

interface Preset {
  key: string
  label: string
  from: string
  to: string
}

/** Professional popover date-range control: quick presets + custom range, one button. */
export function DateRangePicker({
  from,
  to,
  onQuickSelect,
  onCustomFrom,
  onCustomTo,
}: {
  from: string
  to: string
  onQuickSelect: (from: string, to: string) => void
  onCustomFrom: (v: string) => void
  onCustomTo: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDocMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onDocMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const presets: Preset[] = [
    { key: 'all', label: 'Tüm Zamanlar', from: '', to: '' },
    { key: '7', label: 'Son 7 Gün', ...lastNDaysRange(7) },
    { key: '30', label: 'Son 30 Gün', ...lastNDaysRange(30) },
    { key: '90', label: 'Son 90 Gün', ...lastNDaysRange(90) },
  ]
  const active = presets.find((p) => p.from === from && p.to === to)
  const label = active ? active.label : from && to ? `${fmt(from)} – ${fmt(to)}` : 'Tarih aralığı seçin'

  return (
    <div className="relative flex-shrink-0" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 bg-white border border-neutral-200 rounded-lg pl-3 pr-2.5 py-2 text-[13px] font-semibold text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50 transition-colors"
      >
        <svg className="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className="whitespace-nowrap">{label}</span>
        <svg
          className={`w-3.5 h-3.5 text-neutral-400 flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div className="absolute right-0 z-50 mt-1.5 bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden" style={{ width: 268 }}>
          <div className="py-1.5">
            {presets.map((p) => (
              <button
                key={p.key}
                type="button"
                className="w-full flex items-center justify-between gap-2 px-3.5 py-2 text-[13px] text-left hover:bg-neutral-50 transition-colors"
                onClick={() => {
                  onQuickSelect(p.from, p.to)
                  setOpen(false)
                }}
              >
                <span className={active?.key === p.key ? 'text-neutral-950 font-semibold' : 'text-neutral-600'}>{p.label}</span>
                {active?.key === p.key ? (
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </button>
            ))}
          </div>
          <div className="border-t border-neutral-100 p-3.5 flex flex-col gap-2.5 bg-neutral-50/60">
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-neutral-400">Özel Aralık</p>
            <div>
              <label className="form-label">Başlangıç</label>
              <input type="date" className="form-input" value={from} onChange={(e) => onCustomFrom(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Bitiş</label>
              <input type="date" className="form-input" value={to} onChange={(e) => onCustomTo(e.target.value)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
