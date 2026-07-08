import type { ReactNode } from 'react'

interface TopbarProps {
  title: string
  desc?: string
  icon?: ReactNode
  actions?: ReactNode
  onMenuClick?: () => void
}

export function Topbar({ title, desc, icon, actions, onMenuClick }: TopbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 bg-white border-b border-neutral-200 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        {onMenuClick && (
          <button
            type="button"
            onClick={onMenuClick}
            className="w-10 h-10 rounded-full hover:bg-neutral-100 text-neutral-500 flex items-center justify-center md:hidden flex-shrink-0 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div className="w-10 h-10 rounded-full bg-neutral-100 hidden md:flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {icon}
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-neutral-950 tracking-tight leading-tight truncate">{title}</h1>
          {desc ? <p className="text-xs text-neutral-500 mt-0.5 truncate">{desc}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex items-center gap-2 flex-shrink-0">{actions}</div> : null}
    </div>
  )
}
