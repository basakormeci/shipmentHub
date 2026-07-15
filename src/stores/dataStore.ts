import { create } from 'zustand'
import { generateTrackingNo } from '../lib/shipments'
import { generateTransferTrackingNo } from '../lib/transfers'
import { persist, createJSONStorage } from 'zustand/middleware'
import { SEED_NODES, SEED_USERS, type StockNode, type User, type UserRole, type UserStatus } from '../data/seed'
import {
  SEED_SHIPMENTS,
  SEED_RETURNS,
  SEED_TRANSFERS,
  SEED_ROUTING_RULES,
  SEED_ROUTING_HISTORY,
  SEED_CARRIER_PRICING,
  SEED_CARRIER_INVOICES,
  SEED_CARRIER_QUOTAS,
  SEED_CARRIER_HEALTH,
  SEED_ERROR_LOGS,
  SEED_WEBHOOK_QUEUE,
  SEED_PERMISSION_MATRIX,
  SEED_TEMPLATES,
  SEED_BARCODE_TEMPLATES,
  SEED_CONTRACTS,
  type Shipment,
  type Contract,
  type ShipmentStatus,
  type ReturnItem,
  type ReturnStatus,
  type TransferItem,
  type RoutingRule,
  type RoutingHistoryItem,
  type CarrierPricing,
  type CarrierInvoice,
  type CarrierQuota,
  type CarrierHealth,
  type ErrorLog,
  type WebhookItem,
  type PermissionMatrix,
  type NotifyTemplate,
  type BarcodeTemplate,
} from '../data/catalog'

export type { StockNode, User, UserRole, UserStatus }

interface DataState {
  users: User[]
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

  upsertUser: (input: Omit<User, 'id' | 'lastLogin'> & { id?: number | null; lastLogin?: string }) => User
  toggleUserStatus: (id: number) => User | null
  removeUser: (id: number) => User | null
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
    input: Omit<ReturnItem, 'id' | 'returnNo' | 'requestDate' | 'status' | 'statusHistory'> & { status?: ReturnStatus },
  ) => ReturnItem
  cancelReturn: (id: number) => ReturnItem | null
  recallReturn: (id: number) => ReturnItem | null

  updateTransfer: (id: number, patch: Partial<TransferItem>) => TransferItem | null
  addTransfer: (
    input: Omit<TransferItem, 'id' | 'transferNo' | 'trackingNo' | 'status' | 'createdAt' | 'statusHistory'> & {
      trackingNo?: string
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
      users: SEED_USERS,
      nodes: SEED_NODES,
      shipments: SEED_SHIPMENTS,
      returns: SEED_RETURNS,
      transfers: SEED_TRANSFERS,
      routingRules: SEED_ROUTING_RULES,
      routingHistory: SEED_ROUTING_HISTORY,
      carrierPricing: SEED_CARRIER_PRICING,
      carrierInvoices: SEED_CARRIER_INVOICES,
      carrierQuotas: SEED_CARRIER_QUOTAS,
      carrierHealth: SEED_CARRIER_HEALTH,
      errorLogs: SEED_ERROR_LOGS,
      webhookQueue: SEED_WEBHOOK_QUEUE,
      permissionMatrix: SEED_PERMISSION_MATRIX,
      templates: SEED_TEMPLATES,
      barcodeTemplates: SEED_BARCODE_TEMPLATES,
      contracts: SEED_CONTRACTS,

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

      upsertUser: (input) => {
        if (input.id == null) {
          const user: User = {
            id: nextId(get().users),
            name: input.name,
            email: input.email,
            role: input.role,
            status: input.status,
            lastLogin: input.lastLogin ?? '-',
          }
          set({ users: [...get().users, user] })
          return user
        }
        set({
          users: get().users.map((u) =>
            u.id === input.id
              ? { ...u, name: input.name, email: input.email, role: input.role, status: input.status }
              : u,
          ),
        })
        return get().users.find((u) => u.id === input.id)!
      },
      toggleUserStatus: (id) => {
        let updated: User | null = null
        set({
          users: get().users.map((u) => {
            if (u.id !== id) return u
            updated = { ...u, status: u.status === 'active' ? 'passive' : 'active' }
            return updated
          }),
        })
        return updated
      },
      removeUser: (id) => {
        const user = get().users.find((u) => u.id === id) ?? null
        set({ users: get().users.filter((u) => u.id !== id) })
        return user
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
        const createdAt = new Date().toISOString()
        const status = input.status ?? 'DispatchLabelCreated'
        const item: TransferItem = {
          ...input,
          id,
          transferNo,
          trackingNo: input.trackingNo ?? generateTransferTrackingNo(input.companyId),
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
        const clearDefaults: Partial<Pick<Contract, 'isDefaultOrder' | 'isDefaultReturn' | 'isDefaultTransfer'>> = {}
        if (input.isDefaultOrder) clearDefaults.isDefaultOrder = false
        if (input.isDefaultReturn) clearDefaults.isDefaultReturn = false
        if (input.isDefaultTransfer) clearDefaults.isDefaultTransfer = false
        if (Object.keys(clearDefaults).length) {
          set({
            contracts: get().contracts.map((c) => ({ ...c, ...clearDefaults })),
          })
        }
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
      storage: createJSONStorage(() => localStorage),
      version: 7,
      migrate: (persisted, version) => {
        const state = persisted as DataState
        if (version < 3) {
          return { ...state, transfers: state.transfers ?? SEED_TRANSFERS }
        }
        if (version < 4) {
          return { ...state, contracts: state.contracts ?? SEED_CONTRACTS }
        }
        if (version < 6) {
          const shipmentStatusMap: Record<string, ShipmentStatus> = {
            preparing: 'DispatchLabelCreated',
            in_transit: 'OnTheWay',
            delivered: 'DeliveredToCustomer',
            returned: 'ReturnToSender',
            cancelled: 'ShipmentCanceled',
            recalled: 'OnTheWayBackToSender',
          }
          const returnStatusMap: Record<string, ReturnStatus> = {
            requested: 'ReturnCodeCreated',
            picked_up: 'ReturnOnTheWay',
            in_warehouse: 'ReturnReceivedByProvider',
            completed: 'ReceivedByReturnCenter',
            cancelled: 'ReturnShipmentError',
            recalled: 'ReturnCodeExpired',
          }
          const transferStatusMap: Record<string, ShipmentStatus> = {
            preparing: 'DispatchLabelCreated',
            in_transit: 'OnTheWay',
            delivered: 'DeliveredToStore',
            cancelled: 'ShipmentCanceled',
            recalled: 'OnTheWayBackToSender',
          }
          return {
            ...state,
            shipments: (state.shipments ?? []).map((s) => ({
              ...s,
              status: shipmentStatusMap[s.status as string] ?? s.status,
            })),
            returns: (state.returns ?? []).map((r) => ({
              ...r,
              status: returnStatusMap[r.status as string] ?? r.status,
            })),
            transfers: (state.transfers ?? []).map((tr) => ({
              ...tr,
              status: transferStatusMap[tr.status as string] ?? tr.status,
            })),
          }
        }
        return state
      },
      // Runs on every load (unlike migrate, which only fires on a version mismatch) so a
      // record written by a stale browser tab / older bundle can never crash the app by
      // missing a field the current schema requires (e.g. statusHistory).
      merge: (persisted, current) => {
        const merged = { ...current, ...(persisted as Partial<DataState>) } as DataState
        const now = new Date().toISOString()
        return {
          ...merged,
          shipments: (merged.shipments ?? []).map((s) => ({
            ...s,
            statusHistory: s.statusHistory?.length ? s.statusHistory : [{ status: s.status, at: now }],
          })),
          returns: (merged.returns ?? []).map((r) => ({
            ...r,
            statusHistory: r.statusHistory?.length ? r.statusHistory : [{ status: r.status, at: now }],
          })),
          transfers: (merged.transfers ?? []).map((tr) => ({
            ...tr,
            statusHistory: tr.statusHistory?.length ? tr.statusHistory : [{ status: tr.status, at: now }],
          })),
        }
      },
    },
  ),
)
