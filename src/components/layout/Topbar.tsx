import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import type { ReactNode } from 'react'

interface TopbarProps {
  title: string
  desc?: string
  icon?: ReactNode
}

export function Topbar({ title, desc, icon }: TopbarProps) {
  const t = useT()
  const lang = useUiStore((s) => s.lang)
  const langMenuOpen = useUiStore((s) => s.langMenuOpen)
  const toggleLangMenu = useUiStore((s) => s.toggleLangMenu)
  const closeLangMenu = useUiStore((s) => s.closeLangMenu)
  const setLang = useUiStore((s) => s.setLang)

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-neutral-200 flex-shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {icon}
          </svg>
        </div>
        <div className="min-w-0">
          <h1 className="text-[17px] font-semibold text-neutral-950 tracking-tight leading-tight truncate">{title}</h1>
          {desc ? <p className="text-xs text-neutral-500 mt-0.5 truncate">{desc}</p> : null}
        </div>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button className="relative p-2 rounded-lg hover:bg-neutral-100 text-neutral-500 transition-colors" title={t('header.notifications')} type="button">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#fb3748] rounded-full" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleLangMenu()
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-neutral-100 text-neutral-600 text-[13px] font-medium transition-colors"
            title={t('header.language')}
          >
            <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M3 12h18M12 3a14 14 0 010 18 14 14 0 010-18z" />
            </svg>
            {lang.toUpperCase()}
            <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
          {langMenuOpen ? (
            <>
              <div className="fixed inset-0 z-10" onClick={closeLangMenu} />
              <div
                className="absolute right-0 mt-1.5 w-40 bg-white border border-neutral-200 rounded-lg shadow-lg py-1.5 z-20"
                style={{ boxShadow: '0 16px 32px -12px #0e121b1a' }}
              >
                {(['tr', 'en'] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setLang(code)}
                    className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center justify-between hover:bg-neutral-50 transition-colors ${
                      lang === code ? 'text-primary font-semibold' : 'text-neutral-600'
                    }`}
                  >
                    {t(code === 'tr' ? 'header.turkish' : 'header.english')}
                    {lang === code ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : null}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}
