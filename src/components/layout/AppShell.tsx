import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { PAGE_META } from './navConfig'
import { useT } from '../../hooks/useT'

function resolveMetaKey(pathname: string): string {
  if (pathname === '/' || pathname.startsWith('/dashboard')) return 'dashboard'
  if (pathname === '/shipments/new') return 'shipments/new'
  if (pathname.match(/^\/shipments\/[^/]+$/)) return 'shipments/detail'
  if (pathname.startsWith('/shipments')) return 'shipments'
  if (pathname === '/returns/new') return 'returns/new'
  if (pathname.match(/^\/returns\/[^/]+$/)) return 'returns/detail'
  if (pathname.startsWith('/returns')) return 'returns'
  if (pathname === '/contracts/new') return 'contracts/new'
  if (pathname.match(/^\/contracts\/[^/]+\/edit$/)) return 'contracts/edit'
  if (pathname.startsWith('/contracts')) return 'contracts'
  if (pathname.startsWith('/nodes')) return 'nodes'
  if (pathname === '/transfers/new') return 'transfers/new'
  if (pathname.match(/^\/transfers\/[^/]+$/)) return 'transfers/detail'
  if (pathname.startsWith('/transfers')) return 'transfers'
  if (pathname.startsWith('/routing')) return 'routing'
  if (pathname.startsWith('/monitoring')) return 'monitoring'
  if (pathname.startsWith('/finance')) return 'finance'
  if (pathname.startsWith('/performance')) return 'performance'
  if (pathname.startsWith('/reports')) return 'reports'
  if (pathname.startsWith('/users')) return 'users'
  if (pathname.startsWith('/permissions')) return 'permissions'
  if (pathname.startsWith('/templates')) return 'templates'
  if (pathname.startsWith('/barcode-templates')) return 'barcode-templates'
  return 'not-found'
}

export function AppShell() {
  const t = useT()
  const { pathname } = useLocation()
  const meta = PAGE_META[resolveMetaKey(pathname)] ?? PAGE_META['not-found']

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <Topbar title={t(meta.titleKey)} desc={meta.descKey ? t(meta.descKey) : undefined} icon={meta.icon} />
        <div className="flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
