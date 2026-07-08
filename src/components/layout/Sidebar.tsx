import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { USER_ROLES } from '../../data/seed'
import { useT } from '../../hooks/useT'
import { AppBrand } from '../BrandLogo'
import { NAV_SECTIONS } from './navConfig'

function navActive(pathname: string, to: string, end?: boolean) {
  if (end) return pathname === to || (to === '/dashboard' && pathname === '/')
  if (to.startsWith('/routing')) return pathname.startsWith('/routing')
  if (to.startsWith('/monitoring')) return pathname.startsWith('/monitoring')
  if (to.startsWith('/finance')) return pathname.startsWith('/finance')
  return pathname === to || pathname.startsWith(`${to}/`)
}

export function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const t = useT()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const logout = useAuthStore((s) => s.logout)
  const userId = useAuthStore((s) => s.userId)
  const users = useDataStore((s) => s.users)
  const user = users.find((u) => u.id === userId) ?? null
  const display = user ?? { name: '—', role: 'operation' as const }
  const initials = display.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const [profileExpanded, setProfileExpanded] = useState(false)
  const lang = useUiStore((s) => s.lang)
  const setLang = useUiStore((s) => s.setLang)

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 md:static md:translate-x-0 bg-[#f7f7f8] border-r border-line flex flex-col h-screen md:sticky top-0 overflow-hidden transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-5 py-5 flex items-center justify-between">
          <AppBrand />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-neutral-200 text-neutral-500 md:hidden transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx}>
              {section.labelKey ? <p className="nav-section-label">{t(section.labelKey)}</p> : null}
              {section.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={onClose}
                  className={() => `nav-link ${navActive(pathname, item.to, item.end) ? 'active' : ''}`}
                >
                {item.icon}
                <span className="flex-1">{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 pt-3 pb-4 border-t border-neutral-200 flex flex-col gap-1.5">
        <div
          onClick={() => setProfileExpanded(!profileExpanded)}
          className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer select-none"
        >
          <div className="w-8 h-8 rounded-full bg-primary-lighter text-primary-darker flex items-center justify-center text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[13px] font-semibold text-neutral-800 leading-tight truncate">{display.name}</p>
            <p className="text-[11.5px] text-neutral-400 leading-tight truncate">{USER_ROLES[display.role].label}</p>
          </div>
          <button
            type="button"
            className="w-7 h-7 rounded-md flex items-center justify-center text-neutral-300 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
            title={t('header.logout')}
            onClick={(e) => {
              e.stopPropagation()
              logout()
              navigate('/login', { replace: true })
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </div>

        {profileExpanded && (
          <div className="mx-2 p-3 bg-white border border-neutral-200 rounded-lg flex flex-col gap-3 shadow-sm">
            <button
              onClick={() => {
                navigate('/profile')
                setProfileExpanded(false)
                onClose()
              }}
              className="w-full text-left text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-2 hover:bg-neutral-50 px-2 py-1.5 rounded transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="8" r="4" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
              {t('profile.title')}
            </button>
            <div className="border-t border-neutral-100 my-0.5" />
            <div className="flex flex-col gap-1 px-2">
              <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{t('header.language')}</span>
              <div className="flex gap-1.5 mt-1">
                <button
                  type="button"
                  onClick={() => setLang('tr')}
                  className={`flex-1 py-1 rounded text-xs font-medium border text-center transition-colors ${
                    lang === 'tr'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  TR
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`flex-1 py-1 rounded text-xs font-medium border text-center transition-colors ${
                    lang === 'en'
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
    </>
  )
}
