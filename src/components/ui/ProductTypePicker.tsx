import type { ReactNode } from 'react'
import { PRODUCT_TYPES } from '../../data/catalog'

export const PRODUCT_TYPE_ICONS: Record<string, ReactNode> = {
  gida: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v4.5m3.75-4.5v4.5m-7.5 0h11.25M6 7.5v13.5a1 1 0 001 1h10a1 1 0 001-1V7.5M9.75 12v6m4.5-6v6" />
    </svg>
  ),
  elektronik: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
    </svg>
  ),
  tekstil: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2l4 2 4-2 3 4-3 2v14H5V8L2 6l3-4h3zm4 2v18" />
    </svg>
  ),
}

/** Single-select product-type card row — click the active card again to clear it. */
export function ProductTypePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3" style={{ maxWidth: 480 }}>
      {Object.entries(PRODUCT_TYPES).map(([key, label]) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(active ? '' : key)}
            className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-lg border text-center transition-colors ${
              active ? 'border-primary bg-primary-lighter/30' : 'border-neutral-200 hover:bg-neutral-50'
            }`}
          >
            {active ? (
              <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            ) : null}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center ${
                active ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500'
              }`}
            >
              {PRODUCT_TYPE_ICONS[key]}
            </div>
            <p className={`text-xs font-semibold ${active ? 'text-primary-darker' : 'text-neutral-700'}`}>{label}</p>
          </button>
        )
      })}
    </div>
  )
}
