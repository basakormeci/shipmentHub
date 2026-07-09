import { useEffect, useRef, useState, type CSSProperties } from 'react'

export interface DropdownOption {
  value: string
  label: string
}

interface DropdownProps {
  value: string
  onChange: (value: string) => void
  options: DropdownOption[]
  placeholder?: string
  className?: string
  wrapperClassName?: string
  wrapperStyle?: CSSProperties
  disabled?: boolean
  error?: boolean
}

/** Custom white-panel dropdown used in place of native <select> across the app. */
export function Dropdown({
  value,
  onChange,
  options,
  placeholder = 'Seçin...',
  className = '',
  wrapperClassName = '',
  wrapperStyle,
  disabled = false,
  error = false,
}: DropdownProps) {
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

  const selected = options.find((o) => o.value === value)

  return (
    <div className={`relative ${wrapperClassName}`} style={wrapperStyle} ref={ref}>
      <button
        type="button"
        disabled={disabled}
        className={`form-input ${error ? 'error' : ''} flex items-center justify-between gap-2 text-left ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } ${className}`}
        onClick={() => !disabled && setOpen((v) => !v)}
      >
        <span className={`truncate ${selected ? 'text-neutral-950' : 'text-neutral-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
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
        <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg max-h-60 overflow-y-auto py-1">
          {options.length === 0 ? (
            <p className="px-3 py-2 text-sm text-neutral-400">Seçenek yok</p>
          ) : (
            options.map((o) => (
              <button
                key={o.value}
                type="button"
                className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm text-left hover:bg-neutral-50 transition-colors"
                onClick={() => {
                  onChange(o.value)
                  setOpen(false)
                }}
              >
                <span className={o.value === value ? 'text-neutral-950 font-medium' : 'text-neutral-700'}>{o.label}</span>
                {o.value === value ? (
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
