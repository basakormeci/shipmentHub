import type { ReactNode } from 'react'

export type NavItem = {
  to: string
  labelKey: string
  icon: ReactNode
  end?: boolean
}

export type NavSection = {
  labelKey?: string
  items: NavItem[]
}

const icon = (d: ReactNode) => (
  <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    {d}
  </svg>
)

export const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      {
        to: '/dashboard',
        labelKey: 'sidebar.nav_dashboard',
        end: true,
        icon: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-5 3 3 5-6" />),
      },
    ],
  },
  {
    labelKey: 'sidebar.section_ops',
    items: [
      {
        to: '/shipments',
        labelKey: 'sidebar.nav_shipments',
        icon: icon(
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
          </>,
        ),
      },
      {
        to: '/returns',
        labelKey: 'sidebar.nav_returns',
        icon: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />),
      },
      {
        to: '/transfers',
        labelKey: 'sidebar.nav_transfers',
        icon: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />),
      },
    ],
  },
  {
    labelKey: 'sidebar.section_auto',
    items: [
      {
        to: '/routing/rules',
        labelKey: 'sidebar.nav_routing',
        icon: icon(
          <>
            <polyline points="16 3 21 3 21 8" />
            <line x1="4" y1="20" x2="21" y2="3" />
            <polyline points="21 16 21 21 16 21" />
            <line x1="15" y1="15" x2="21" y2="21" />
            <line x1="4" y1="4" x2="9" y2="9" />
          </>
        ),
      },
    ],
  },
  {
    labelKey: 'sidebar.section_finance',
    items: [
      {
        to: '/finance/setup',
        labelKey: 'sidebar.nav_finance',
        icon: icon(
          <>
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="15" x2="10" y2="15" strokeLinecap="round" />
          </>
        ),
      },
    ],
  },
  {
    labelKey: 'sidebar.section_reports',
    items: [
      {
        to: '/performance',
        labelKey: 'sidebar.nav_performance',
        icon: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />),
      },
      {
        to: '/reports',
        labelKey: 'sidebar.nav_reports',
        icon: icon(<path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V10m5 7V6m5 11v-4" />),
      },
    ],
  },
  {
    labelKey: 'sidebar.section_settings',
    items: [
      {
        to: '/contracts',
        labelKey: 'sidebar.nav_contracts',
        icon: icon(
          <>
            <rect x="1" y="7" width="14" height="10" rx="1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4l3 3v4h-7z" />
            <circle cx="6" cy="19" r="1.6" />
            <circle cx="18" cy="19" r="1.6" />
          </>
        ),
      },
      {
        to: '/nodes',
        labelKey: 'sidebar.nav_nodes',
        icon: icon(
          <>
            <rect x="2" y="3" width="20" height="5" rx="1" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" />
            <line x1="10" y1="12" x2="14" y2="12" strokeLinecap="round" />
          </>
        ),
      },
      {
        to: '/templates',
        labelKey: 'sidebar.nav_templates',
        icon: icon(
          <>
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
          </>
        ),
      },
      {
        to: '/barcode-templates',
        labelKey: 'sidebar.nav_barcode_templates',
        icon: icon(
          <>
            <rect x="3" y="5" width="18" height="14" rx="1" />
            <line x1="7" y1="5" x2="7" y2="19" strokeLinecap="round" />
            <line x1="10" y1="5" x2="10" y2="19" strokeLinecap="round" />
            <line x1="14" y1="5" x2="14" y2="19" strokeLinecap="round" />
            <line x1="17" y1="5" x2="17" y2="19" strokeLinecap="round" />
          </>
        ),
      },
      {
        to: '/users',
        labelKey: 'sidebar.nav_users_permissions',
        icon: icon(
          <>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
          </>
        ),
      },
    ],
  },
]

export const PAGE_META: Record<string, { titleKey: string; descKey?: string; icon: ReactNode }> = {
  dashboard: {
    titleKey: 'dashboard.title',
    descKey: 'dashboard.desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M7 15l4-5 3 3 5-6" />,
  },
  shipments: {
    titleKey: 'page.shipments',
    descKey: 'page.shipments_desc',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </>
    ),
  },
  'shipments/new': {
    titleKey: 'page.shipment_create',
    descKey: 'page.shipment_create_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />,
  },
  'shipments/detail': {
    titleKey: 'page.shipment_detail',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
      </>
    ),
  },
  returns: {
    titleKey: 'page.returns',
    descKey: 'page.returns_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />,
  },
  'returns/new': {
    titleKey: 'page.return_create',
    descKey: 'page.return_create_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />,
  },
  'returns/detail': {
    titleKey: 'page.return_detail',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />,
  },
  contracts: {
    titleKey: 'page.contracts',
    descKey: 'page.contracts_desc',
    icon: (
      <>
        <rect x="1" y="7" width="14" height="10" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4l3 3v4h-7z" />
        <circle cx="6" cy="19" r="1.6" />
        <circle cx="18" cy="19" r="1.6" />
      </>
    ),
  },
  'contracts/new': {
    titleKey: 'page.contract_new',
    icon: (
      <>
        <rect x="1" y="7" width="14" height="10" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4l3 3v4h-7z" />
      </>
    ),
  },
  'contracts/edit': {
    titleKey: 'page.contract_edit',
    icon: (
      <>
        <rect x="1" y="7" width="14" height="10" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10h4l3 3v4h-7z" />
      </>
    ),
  },
  nodes: {
    titleKey: 'nodes.title',
    descKey: 'nodes.desc',
    icon: (
      <>
        <rect x="2" y="3" width="20" height="5" rx="1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" />
        <line x1="10" y1="12" x2="14" y2="12" strokeLinecap="round" />
      </>
    ),
  },
  transfers: {
    titleKey: 'page.transfers',
    descKey: 'page.transfers_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />,
  },
  'transfers/new': {
    titleKey: 'page.transfer_create',
    descKey: 'page.transfer_create_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />,
  },
  'transfers/detail': {
    titleKey: 'page.transfer_detail',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />,
  },
  routing: {
    titleKey: 'page.routing',
    descKey: 'page.routing_desc',
    icon: (
      <>
        <polyline points="16 3 21 3 21 8" />
        <line x1="4" y1="20" x2="21" y2="3" />
      </>
    ),
  },
  monitoring: {
    titleKey: 'page.monitoring',
    descKey: 'page.monitoring_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  },
  finance: {
    titleKey: 'page.finance',
    descKey: 'page.finance_desc',
    icon: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </>
    ),
  },
  performance: {
    titleKey: 'page.performance',
    descKey: 'page.performance_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />,
  },
  reports: {
    titleKey: 'page.reports',
    descKey: 'page.reports_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v18h18M8 17V10m5 7V6m5 11v-4" />,
  },
  users: {
    titleKey: 'sidebar.nav_users_permissions',
    descKey: 'page.users_desc',
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
      </>
    ),
  },
  permissions: {
    titleKey: 'page.permissions',
    descKey: 'page.permissions_desc',
    icon: (
      <>
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V7a5 5 0 0110 0v4" />
      </>
    ),
  },
  templates: {
    titleKey: 'page.templates',
    descKey: 'page.templates_desc',
    icon: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M22 6l-10 7L2 6" />
      </>
    ),
  },
  'barcode-templates': {
    titleKey: 'page.barcode_templates',
    descKey: 'page.barcode_templates_desc',
    icon: <rect x="3" y="5" width="18" height="14" rx="1" />,
  },
  profile: {
    titleKey: 'profile.title',
    descKey: 'profile.desc',
    icon: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
      </>
    ),
  },
  'not-found': {
    titleKey: 'page.not_found',
    descKey: 'page.not_found_desc',
    icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />,
  },
}
