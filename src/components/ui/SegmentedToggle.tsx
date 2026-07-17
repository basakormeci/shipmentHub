import type { ReactNode } from 'react'

export interface SegmentedToggleOption<T extends string> {
  value: T
  label: string
  icon?: ReactNode
}

/** Compact pill-style segmented control — replaces the old two-big-card selector pattern. */
export function SegmentedToggle<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T
  onChange: (v: T) => void
  options: SegmentedToggleOption<T>[]
}) {
  return (
    <div className="inline-flex items-center p-1 rounded-lg bg-neutral-100 gap-1 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
            value === opt.value ? 'bg-white text-primary shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          {opt.icon}
          {opt.label}
        </button>
      ))}
    </div>
  )
}
