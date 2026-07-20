import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { RequireAuth, PublicOnly } from './guards'
import { TabGuard } from './TabGuard'
import { LoginPage } from '../pages/LoginPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { NodesPage } from '../pages/nodes/NodesPage'
import { NodeWizardPage } from '../pages/nodes/NodeWizardPage'
import { DashboardPage } from '../pages/DashboardPage'
import { UsersPage } from '../pages/users/UsersPage'
import { PermissionsPage } from '../pages/PermissionsPage'
import { PerformancePage } from '../pages/PerformancePage'
import { TemplatesPage } from '../pages/templates/TemplatesPage'
import { BarcodeTemplatesPage } from '../pages/templates/BarcodeTemplatesPage'
import { ReportsPage } from '../pages/ReportsPage'
import { MonitoringPage } from '../pages/monitoring/MonitoringPage'
import { FinancePage } from '../pages/finance/FinancePage'
import { RoutingPage } from '../pages/routing/RoutingPage'
import { RoutingRuleFormPage } from '../pages/routing/RoutingRuleFormPage'
import { ShipmentsPage } from '../pages/shipments/ShipmentsPage'
import { ShipmentCreatePage } from '../pages/shipments/ShipmentCreatePage'
import { ShipmentDetailPage } from '../pages/shipments/ShipmentDetailPage'
import { ReturnsPage } from '../pages/returns/ReturnsPage'
import { ReturnCreatePage } from '../pages/returns/ReturnCreatePage'
import { ReturnDetailPage } from '../pages/returns/ReturnDetailPage'
import { TransfersPage } from '../pages/transfers/TransfersPage'
import { TransferCreatePage } from '../pages/transfers/TransferCreatePage'
import { TransferDetailPage } from '../pages/transfers/TransferDetailPage'
import { ContractsPage } from '../pages/contracts/ContractsPage'
import { ContractWizardPage } from '../pages/contracts/ContractWizardPage'
import { ProfilePage } from '../pages/ProfilePage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <PublicOnly>
        <LoginPage />
      </PublicOnly>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'shipments', element: <ShipmentsPage /> },
      { path: 'shipments/new', element: <ShipmentCreatePage /> },
      { path: 'shipments/:shipmentId', element: <ShipmentDetailPage /> },
      { path: 'returns', element: <ReturnsPage /> },
      { path: 'returns/new', element: <ReturnCreatePage /> },
      { path: 'returns/:returnId', element: <ReturnDetailPage /> },
      { path: 'contracts', element: <ContractsPage /> },
      { path: 'contracts/new', element: <ContractWizardPage /> },
      { path: 'contracts/:contractId/edit', element: <ContractWizardPage /> },
      { path: 'nodes', element: <NodesPage /> },
      { path: 'nodes/new', element: <NodeWizardPage /> },
      { path: 'nodes/:nodeId/edit', element: <NodeWizardPage /> },
      { path: 'transfers', element: <TransfersPage /> },
      { path: 'transfers/new', element: <TransferCreatePage /> },
      { path: 'transfers/:transferId', element: <TransferDetailPage /> },
      { path: 'routing', element: <Navigate to="/routing/rules" replace /> },
      { path: 'routing/rules/new', element: <RoutingRuleFormPage /> },
      { path: 'routing/rules/:ruleId/edit', element: <RoutingRuleFormPage /> },
      {
        path: 'routing/:tab',
        element: (
          <TabGuard group="routing">
            <RoutingPage />
          </TabGuard>
        ),
      },
      { path: 'monitoring', element: <Navigate to="/monitoring/health" replace /> },
      {
        path: 'monitoring/:tab',
        element: (
          <TabGuard group="monitoring">
            <MonitoringPage />
          </TabGuard>
        ),
      },
      { path: 'finance', element: <Navigate to="/finance/setup" replace /> },
      {
        path: 'finance/:tab',
        element: (
          <TabGuard group="finance">
            <FinancePage />
          </TabGuard>
        ),
      },
      { path: 'performance', element: <PerformancePage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'users', element: <UsersPage /> },
      { path: 'permissions', element: <PermissionsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'barcode-templates', element: <BarcodeTemplatesPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
