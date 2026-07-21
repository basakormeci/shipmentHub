import { useEffect, useRef, useState, type CSSProperties } from 'react'

export interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  selected: Partial<Record<string, boolean>>
  onChange: (next: Partial<Record<string, boolean>>) => void
  options: MultiSelectOption[]
  placeholder?: string
  allLabel?: string
  noneLabel?: string
  className?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  disabled?: boolean
}

/** Checkbox-list dropdown with a "select all" row. Mirrors ColumnPanelModal's visibility-map
 * convention (key !== false means included) so "select all"/"clear all" are always explicit,
 * unambiguous states — unlike an empty-array-means-all scheme, where clearing everything from
 * an already-empty selection would be a silent no-op. */
export function MultiSelectDropdown({
  selected,
  onChange,
  options,
  placeholder = 'Tümü',
  allLabel = 'Tümünü Seç',
  noneLabel = 'Hiçbiri seçili değil',
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  disabled = false,
}: MultiSelectDropdownProps) {
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

  const selectedCount = options.filter((o) => selected[o.value] !== false).length
  const allOn = selectedCount === options.length
  const label = allOn
    ? placeholder
    : selectedCount === 0
      ? noneLabel
      : selectedCount === 1
        ? (options.find((o) => selected[o.value] !== false)?.label ?? placeholder)
        : `${selectedCount} seçili`

  function toggle(value: string, checked: boolean) {
    onChange({ ...selected, [value]: checked })
  }

  function toggleAll(checked: boolean) {
    const next: Partial<Record<string, boolean>> = {}
    options.forEach((o) => {
      next[o.value] = checked
    })
    onChange(next)
  }

  return (
    <div className={`relative ${wrapperClassName}`} style={wrapperStyle} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        className={`form-input flex items-center justify-between gap-2 text-left ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className={`truncate ${allOn ? 'text-neutral-400' : 'text-neutral-950'}`}>{label}</span>
        <svg
          className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <div
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-72 overflow-y-auto py-1"
          style={{ minWidth: 200 }}
        >
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-neutral-400">Seçenek yok</p>
          ) : (
            <>
              <label className="w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 transition-colors">
                <input type="checkbox" checked={allOn} onChange={(e) => toggleAll(e.target.checked)} />
                <span className="font-semibold text-neutral-950">{allLabel}</span>
              </label>
              <div className="border-t border-neutral-100 my-1" />
              {options.map((o) => (
                <label
                  key={o.value}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm cursor-pointer hover:bg-neutral-50 transition-colors"
                >
                  <input type="checkbox" checked={selected[o.value] !== false} onChange={(e) => toggle(o.value, e.target.checked)} />
                  <span className="text-neutral-700">{o.label}</span>
                </label>
              ))}
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
