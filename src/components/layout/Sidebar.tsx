import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useDataStore } from '../../stores/dataStore'
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

export function Sidebar() {
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

  return (
    <aside className="w-64 flex-shrink-0 bg-[#f7f7f8] border-r border-line flex flex-col h-screen sticky top-0 overflow-hidden">
      <div className="px-5 py-5">
        <AppBrand />
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
                className={() => `nav-link ${navActive(pathname, item.to, item.end) ? 'active' : ''}`}
              >
                {item.icon}
                <span className="flex-1">{t(item.labelKey)}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="px-4 pb-2">
        <div className="nav-link">
          <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
            />
          </svg>
          <span className="flex-1">{t('sidebar.settings')}</span>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4 border-t border-neutral-200">
        <div className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-neutral-100 transition-colors">
          <button
            type="button"
            className="w-8 h-8 rounded-full bg-primary-lighter text-primary-darker flex items-center justify-center text-xs font-bold flex-shrink-0"
            onClick={() => navigate('/users')}
          >
            {initials}
          </button>
          <button type="button" className="min-w-0 flex-1 text-left" onClick={() => navigate('/users')}>
            <p className="text-[13px] font-semibold text-neutral-800 leading-tight truncate">{display.name}</p>
            <p className="text-[11.5px] text-neutral-400 leading-tight truncate">{USER_ROLES[display.role].label}</p>
          </button>
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
      </div>
    </aside>
  )
}
