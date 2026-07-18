import { create } from 'zustand'
import { generateTrackingNo } from '../lib/shipments'
import { generateTransferTrackingNo } from '../lib/transfers'
import { synthesizeShipmentHistory, synthesizeReturnHistory } from '../lib/statusHistory'
import { synthesizeRoutingDecision, provinceIdForName } from '../lib/routingBackfill'
import { PROVINCES } from '../data/catalog'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { StockNode, UserRole } from '../data/seed'
import { migrateDataState } from '../lib/dataMigrations'
import { createEmptyUserData, createInitialDataForUser } from '../lib/initialDataFactory'
import { userScopedRawStorage, CURRENT_DATA_VERSION, clearUserData } from '../lib/userDataRepository'
import { getActiveUserEmail } from '../lib/activeUser'
import type {
  Shipment,
  Contract,
  ShipmentStatus,
  ReturnItem,
  ReturnStatus,
  TransferItem,
  RoutingRule,
  RoutingHistoryItem,
  CarrierPricing,
  CarrierInvoice,
  CarrierQuota,
  CarrierHealth,
  ErrorLog,
  WebhookItem,
  PermissionMatrix,
  NotifyTemplate,
  BarcodeTemplate,
} from '../data/catalog'

export type { StockNode }

// Per-user-namespaced business data. `users` (the account directory) intentionally lives
// in a separate, global, non-namespaced store — see src/stores/usersStore.ts.
interface DataState {
  nodes: StockNode[]
  shipments: Shipment[]
  returns: ReturnItem[]
  transfers: TransferItem[]
  routingRules: RoutingRule[]
  routingHistory: RoutingHistoryItem[]
  carrierPricing: CarrierPricing[]
  carrierInvoices: CarrierInvoice[]
  carrierQuotas: CarrierQuota[]
  carrierHealth: CarrierHealth[]
  errorLogs: ErrorLog[]
  webhookQueue: WebhookItem[]
  permissionMatrix: PermissionMatrix
  templates: NotifyTemplate[]
  barcodeTemplates: BarcodeTemplate[]
  contracts: Contract[]

  upsertNode: (input: Omit<StockNode, 'id'> & { id?: number | null }) => StockNode
  removeNode: (id: number) => StockNode | null

  togglePermission: (role: UserRole, moduleIndex: number) => void

  upsertTemplate: (input: Omit<NotifyTemplate, 'id'> & { id?: number | null }) => NotifyTemplate
  toggleTemplateActive: (id: number) => void
  removeTemplate: (id: number) => void

  upsertBarcodeTemplate: (input: Omit<BarcodeTemplate, 'id'> & { id?: number | null }) => BarcodeTemplate
  toggleBarcodeTemplateActive: (id: number) => void
  removeBarcodeTemplate: (id: number) => void

  upsertRoutingRule: (input: Omit<RoutingRule, 'id'> & { id?: number | null }) => RoutingRule
  toggleRoutingRule: (id: number) => void
  removeRoutingRule: (id: number) => void
  moveRoutingPriority: (id: number, direction: -1 | 1) => void
  logRoutingHistory: (action: string, ruleName: string, detail: string) => void

  upsertPricing: (input: Omit<CarrierPricing, 'id'> & { id?: number | null }) => CarrierPricing
  removePricing: (id: number) => void
  upsertInvoice: (input: Omit<CarrierInvoice, 'id'> & { id?: number | null }) => CarrierInvoice
  removeInvoice: (id: number) => void
  updateQuota: (companyId: number, monthlyLimit: number) => void

  retryErrorLog: (id: number) => void

  updateShipment: (id: number, patch: Partial<Shipment>) => Shipment | null
  addShipment: (
    input: Omit<Shipment, 'id' | 'shipmentNo' | 'trackingNo' | 'shipTime' | 'status' | 'statusHistory'> & {
      trackingNo?: string
      status?: ShipmentStatus
    },
  ) => Shipment
  cancelShipment: (id: number) => Shipment | null
  recallShipment: (id: number) => Shipment | null

  updateReturn: (id: number, patch: Partial<ReturnItem>) => ReturnItem | null
  addReturn: (
    input: Omit<ReturnItem, 'id' | 'returnNo' | 'trackingNo' | 'requestDate' | 'status' | 'statusHistory'> & {
      trackingNo?: string
      status?: ReturnStatus
    },
  ) => ReturnItem
  cancelReturn: (id: number) => ReturnItem | null
  recallReturn: (id: number) => ReturnItem | null

  updateTransfer: (id: number, patch: Partial<TransferItem>) => TransferItem | null
  addTransfer: (
    input: Omit<
      TransferItem,
      'id' | 'transferNo' | 'dispatchNo' | 'trackingNo' | 'referenceId' | 'packageNo' | 'status' | 'createdAt' | 'statusHistory'
    > & {
      dispatchNo?: number
      trackingNo?: string
      referenceId?: string
      packageNo?: string
      status?: ShipmentStatus
    },
  ) => TransferItem
  cancelTransfer: (id: number) => TransferItem | null
  recallTransfer: (id: number) => TransferItem | null

  upsertContract: (input: Omit<Contract, 'id'> & { id?: number | null }) => Contract
  toggleContractStatus: (id: number) => Contract | null
  removeContract: (id: number) => Contract | null
}

function nextId<T extends { id: number }>(rows: T[]) {
  return Math.max(0, ...rows.map((r) => r.id)) + 1
}

export const useDataStore = create<DataState>()(
  persist(
    (set, get) => ({
      // Pre-hydration placeholder only — every protected route is gated behind
      // RequireAuth, which rehydrates this store with the active user's real data
      // (seeded or blank) before any of these fields are ever rendered.
      ...createEmptyUserData(),

      upsertNode: (input) => {
        if (input.id == null) {
          const node: StockNode = { ...input, id: nextId(get().nodes) } as StockNode
          set({ nodes: [...get().nodes, node] })
          return node
        }
        set({
          nodes: get().nodes.map((n) => (n.id === input.id ? ({ ...n, ...input, id: n.id } as StockNode) : n)),
        })
        return get().nodes.find((n) => n.id === input.id)!
      },
      removeNode: (id) => {
        const node = get().nodes.find((n) => n.id === id) ?? null
        set({ nodes: get().nodes.filter((n) => n.id !== id) })
        return node
      },

      togglePermission: (role, moduleIndex) => {
        const matrix = { ...get().permissionMatrix, [role]: [...get().permissionMatrix[role]] }
        matrix[role][moduleIndex] = !matrix[role][moduleIndex]
        set({ permissionMatrix: matrix })
      },

      upsertTemplate: (input) => {
        if (input.id == null) {
          const row: NotifyTemplate = { ...input, id: nextId(get().templates) }
          set({ templates: [...get().templates, row] })
          return row
        }
        set({
          templates: get().templates.map((t) => (t.id === input.id ? ({ ...t, ...input, id: t.id } as NotifyTemplate) : t)),
        })
        return get().templates.find((t) => t.id === input.id)!
      },
      toggleTemplateActive: (id) => {
        set({
          templates: get().templates.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
        })
      },
      removeTemplate: (id) => set({ templates: get().templates.filter((t) => t.id !== id) }),

      upsertBarcodeTemplate: (input) => {
        if (input.id == null) {
          const row: BarcodeTemplate = { ...input, id: nextId(get().barcodeTemplates) }
          set({ barcodeTemplates: [...get().barcodeTemplates, row] })
          return row
        }
        set({
          barcodeTemplates: get().barcodeTemplates.map((t) =>
            t.id === input.id ? ({ ...t, ...input, id: t.id } as BarcodeTemplate) : t,
          ),
        })
        return get().barcodeTemplates.find((t) => t.id === input.id)!
      },
      toggleBarcodeTemplateActive: (id) => {
        set({
          barcodeTemplates: get().barcodeTemplates.map((t) => (t.id === id ? { ...t, active: !t.active } : t)),
        })
      },
      removeBarcodeTemplate: (id) => set({ barcodeTemplates: get().barcodeTemplates.filter((t) => t.id !== id) }),

      upsertRoutingRule: (input) => {
        if (input.id == null) {
          const row: RoutingRule = {
            ...input,
            id: nextId(get().routingRules),
            priority: get().routingRules.length + 1,
          }
          set({ routingRules: [...get().routingRules, row] })
          return row
        }
        set({
          routingRules: get().routingRules.map((r) => (r.id === input.id ? ({ ...r, ...input, id: r.id } as RoutingRule) : r)),
        })
        return get().routingRules.find((r) => r.id === input.id)!
      },
      toggleRoutingRule: (id) => {
        set({
          routingRules: get().routingRules.map((r) => (r.id === id ? { ...r, active: !r.active } : r)),
        })
      },
      removeRoutingRule: (id) => {
        set({ routingRules: get().routingRules.filter((r) => r.id !== id) })
      },
      moveRoutingPriority: (id, direction) => {
        const sorted = [...get().routingRules].sort((a, b) => a.priority - b.priority)
        const idx = sorted.findIndex((r) => r.id === id)
        const swapIdx = idx + direction
        if (idx < 0 || swapIdx < 0 || swapIdx >= sorted.length) return
        const a = sorted[idx]
        const b = sorted[swapIdx]
        const aP = a.priority
        sorted[idx] = { ...a, priority: b.priority }
        sorted[swapIdx] = { ...b, priority: aP }
        set({ routingRules: sorted })
      },
      logRoutingHistory: (action, ruleName, detail) => {
        const item: RoutingHistoryItem = {
          id: nextId(get().routingHistory),
          time: new Date().toISOString(),
          action,
          ruleName,
          detail,
        }
        set({ routingHistory: [item, ...get().routingHistory] })
      },

      upsertPricing: (input) => {
        if (input.id == null) {
          const row: CarrierPricing = { ...input, id: nextId(get().carrierPricing) }
          set({ carrierPricing: [...get().carrierPricing, row] })
          return row
        }
        set({
          carrierPricing: get().carrierPricing.map((p) =>
            p.id === input.id ? ({ ...p, ...input, id: p.id } as CarrierPricing) : p,
          ),
        })
        return get().carrierPricing.find((p) => p.id === input.id)!
      },
      removePricing: (id) => set({ carrierPricing: get().carrierPricing.filter((p) => p.id !== id) }),
      upsertInvoice: (input) => {
        if (input.id == null) {
          const row: CarrierInvoice = { ...input, id: nextId(get().carrierInvoices) }
          set({ carrierInvoices: [...get().carrierInvoices, row] })
          return row
        }
        set({
          carrierInvoices: get().carrierInvoices.map((p) =>
            p.id === input.id ? ({ ...p, ...input, id: p.id } as CarrierInvoice) : p,
          ),
        })
        return get().carrierInvoices.find((p) => p.id === input.id)!
      },
      removeInvoice: (id) => set({ carrierInvoices: get().carrierInvoices.filter((p) => p.id !== id) }),
      updateQuota: (companyId, monthlyLimit) => {
        const exists = get().carrierQuotas.some((q) => q.companyId === companyId)
        if (!exists) {
          set({ carrierQuotas: [...get().carrierQuotas, { companyId, monthlyLimit, usedThisMonth: 0 }] })
          return
        }
        set({
          carrierQuotas: get().carrierQuotas.map((q) => (q.companyId === companyId ? { ...q, monthlyLimit } : q)),
        })
      },

      retryErrorLog: (id) => {
        set({
          errorLogs: get().errorLogs.map((e) => (e.id === id ? { ...e, status: 'retrying' } : e)),
        })
      },

      updateShipment: (id, patch) => {
        const existing = get().shipments.find((s) => s.id === id)
        if (!existing) return null
        const statusHistory =
          patch.status && patch.status !== existing.status
            ? [...existing.statusHistory, { status: patch.status, at: new Date().toISOString() }]
            : existing.statusHistory
        const updated = { ...existing, ...patch, id: existing.id, shipTo: patch.shipTo ?? existing.shipTo, statusHistory }
        set({ shipments: get().shipments.map((s) => (s.id === id ? updated : s)) })
        return updated
      },

      addShipment: (input) => {
        const id = nextId(get().shipments)
        const shipmentNo = Math.max(0, ...get().shipments.map((s) => s.shipmentNo)) + 1
        const orderNoVal = Number.isNaN(Number(input.orderNo)) ? input.orderNo : Number(input.orderNo)
        const shipTime = new Date().toISOString()
        const status = input.status ?? 'DispatchLabelCreated'
        const shipment: Shipment = {
          ...input,
          id,
          shipmentNo,
          orderNo: orderNoVal as number,
          trackingNo: input.trackingNo ?? generateTrackingNo(input.companyId),
          shipTime,
          status,
          referenceId: input.referenceId || `REF-${Math.floor(Math.random() * 90000) + 10000}`,
          packageNo: input.packageNo || `PKT-${String(id).padStart(6, '0')}`,
          statusHistory: [{ status, at: shipTime }],
        }
        set({ shipments: [...get().shipments, shipment] })
        return shipment
      },

      cancelShipment: (id) => get().updateShipment(id, { status: 'ShipmentCanceled' }),

      recallShipment: (id) => get().updateShipment(id, { status: 'OnTheWayBackToSender' }),

      updateReturn: (id, patch) => {
        const existing = get().returns.find((r) => r.id === id)
        if (!existing) return null
        const statusHistory =
          patch.status && patch.status !== existing.status
            ? [...existing.statusHistory, { status: patch.status, at: new Date().toISOString() }]
            : existing.statusHistory
        const updated = { ...existing, ...patch, id: existing.id, statusHistory }
        set({ returns: get().returns.map((r) => (r.id === id ? updated : r)) })
        return updated
      },

      addReturn: (input) => {
        const id = nextId(get().returns)
        const returnNo = Math.max(9300000, ...get().returns.map((r) => r.returnNo)) + 1
        const requestDate = new Date().toISOString()
        const status = input.status ?? 'ReturnCodeCreated'
        const item: ReturnItem = {
          ...input,
          id,
          returnNo,
          trackingNo: input.trackingNo ?? generateTrackingNo(input.companyId),
          requestDate,
          status,
          statusHistory: [{ status, at: requestDate }],
        }
        set({ returns: [item, ...get().returns] })
        return item
      },

      cancelReturn: (id) => get().updateReturn(id, { status: 'ReturnShipmentError' }),

      recallReturn: (id) => get().updateReturn(id, { status: 'ReturnCodeExpired' }),

      updateTransfer: (id, patch) => {
        const existing = get().transfers.find((t) => t.id === id)
        if (!existing) return null
        const statusHistory =
          patch.status && patch.status !== existing.status
            ? [...existing.statusHistory, { status: patch.status, at: new Date().toISOString() }]
            : existing.statusHistory
        const updated = { ...existing, ...patch, id: existing.id, statusHistory }
        set({ transfers: get().transfers.map((t) => (t.id === id ? updated : t)) })
        return updated
      },

      addTransfer: (input) => {
        const id = nextId(get().transfers)
        const transferNo = Math.max(0, ...get().transfers.map((t) => t.transferNo)) + 1
        const dispatchNo = input.dispatchNo ?? Math.max(5100000, ...get().transfers.map((t) => t.dispatchNo)) + 1
        const createdAt = new Date().toISOString()
        const status = input.status ?? 'DispatchLabelCreated'
        const item: TransferItem = {
          ...input,
          id,
          transferNo,
          dispatchNo,
          trackingNo: input.trackingNo ?? generateTransferTrackingNo(input.companyId),
          referenceId: input.referenceId || `REF-T${Math.floor(Math.random() * 90000) + 10000}`,
          packageNo: input.packageNo || `PKT-T${String(id).padStart(6, '0')}`,
          status,
          createdAt,
          statusHistory: [{ status, at: createdAt }],
        }
        set({ transfers: [item, ...get().transfers] })
        return item
      },

      cancelTransfer: (id) => get().updateTransfer(id, { status: 'ShipmentCanceled' }),

      recallTransfer: (id) => get().updateTransfer(id, { status: 'OnTheWayBackToSender' }),

      upsertContract: (input) => {
        if (input.id == null) {
          const row: Contract = { ...input, id: nextId(get().contracts) } as Contract
          set({ contracts: [...get().contracts, row] })
          return row
        }
        set({
          contracts: get().contracts.map((c) =>
            c.id === input.id ? ({ ...c, ...input, id: c.id } as Contract) : c,
          ),
        })
        return get().contracts.find((c) => c.id === input.id)!
      },

      toggleContractStatus: (id) => {
        let updated: Contract | null = null
        set({
          contracts: get().contracts.map((c) => {
            if (c.id !== id) return c
            updated = { ...c, status: c.status === 'active' ? 'passive' : 'active' }
            return updated
          }),
        })
        return updated
      },

      removeContract: (id) => {
        const contract = get().contracts.find((c) => c.id === id) ?? null
        set({ contracts: get().contracts.filter((c) => c.id !== id) })
        return contract
      },
    }),
    {
      name: 'shipment-hub:v1',
      storage: createJSONStorage(() => userScopedRawStorage),
      version: CURRENT_DATA_VERSION,
      migrate: (persisted, version) => migrateDataState(persisted, version),
      // Runs on every load (unlike migrate, which only fires on a version mismatch) so a
      // record written by a stale browser tab / older bundle can never crash the app by
      // missing a field the current schema requires (e.g. statusHistory).
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<DataState>) } as DataState
        const shipments = merged.shipments ?? []
        const scoringArgs = {
          contracts: merged.contracts ?? [],
          routingRules: merged.routingRules ?? [],
          shipments,
          carrierInvoices: merged.carrierInvoices ?? [],
          carrierPricing: merged.carrierPricing ?? [],
        }
        return {
          ...merged,
          shipments: shipments.map((s) => ({
            ...s,
            statusHistory: s.statusHistory?.length ? s.statusHistory : synthesizeShipmentHistory(s.status, s.shipTime, s.id),
            routingDecision:
              s.routingDecision ??
              synthesizeRoutingDecision({
                id: s.id,
                companyId: s.companyId,
                provinceId: provinceIdForName(s.shipTo.province),
                desi: s.desi,
                amount: s.orderAmount,
                cargoType: 'shipment',
                shippingType: 'orderShipping',
                ...scoringArgs,
              }) ??
              undefined,
          })),
          returns: (merged.returns ?? []).map((r) => ({
            ...r,
            statusHistory: r.statusHistory?.length ? r.statusHistory : synthesizeReturnHistory(r.status, r.requestDate, r.id),
            routingDecision:
              r.routingDecision ??
              synthesizeRoutingDecision({
                id: r.id,
                companyId: r.companyId,
                provinceId: provinceIdForName(r.shipTo.province),
                desi: r.desi,
                amount: r.orderAmount,
                cargoType: 'return',
                shippingType: 'returnShipping',
                ...scoringArgs,
              }) ??
              undefined,
          })),
          transfers: (merged.transfers ?? []).map((tr) => ({
            ...tr,
            statusHistory: tr.statusHistory?.length ? tr.statusHistory : synthesizeShipmentHistory(tr.status, tr.createdAt, tr.id),
            routingDecision:
              tr.routingDecision ??
              synthesizeRoutingDecision({
                id: tr.id,
                companyId: tr.companyId,
                provinceId: PROVINCES[tr.id % PROVINCES.length]?.id ?? null,
                desi: tr.desi,
                cargoType: 'transfer',
                shippingType: 'transferShipping',
                ...scoringArgs,
              }) ??
              undefined,
          })),
        }
      },
    },
  ),
)

// Dev-only helper to reset ONLY the active user's namespace back to their own initial
// data (seeded for legacy demo accounts, blank for everyone else) — never touches any
// other user's storage key. Exposed on window in dev so it's reachable from the browser
// console without adding any new UI surface.
export function resetCurrentUserData(): void {
  const email = getActiveUserEmail()
  if (!email) return
  clearUserData(email)
  useDataStore.setState(createInitialDataForUser(email))
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __resetCurrentUserData?: () => void }).__resetCurrentUserData = resetCurrentUserData
}
