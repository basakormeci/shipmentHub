import { SEED_NODES, type StockNode } from '../data/seed'
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
  type ReturnItem,
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

// The per-user-namespaced slice of dataStore's DataState: every field except `users`
// (which stays in a separate, global, non-namespaced store) and the action functions.
export interface UserDataBlob {
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
}

// Genuinely blank workspace for a brand-new user. `permissionMatrix` is the one
// exception to "everything starts empty": it's fixed-shape RBAC scaffolding (3 roles ×
// module list), not user-created business data, so every account gets a sane working
// default rather than an all-unchecked matrix.
export function createEmptyUserData(): UserDataBlob {
  return {
    nodes: [],
    shipments: [],
    returns: [],
    transfers: [],
    routingRules: [],
    routingHistory: [],
    carrierPricing: [],
    carrierInvoices: [],
    carrierQuotas: [],
    carrierHealth: [],
    errorLogs: [],
    webhookQueue: [],
    permissionMatrix: { ...SEED_PERMISSION_MATRIX },
    templates: [],
    barcodeTemplates: [],
    contracts: [],
  }
}

// Today's demo dataset — what every account used to see before per-user isolation.
export function createSeededUserData(): UserDataBlob {
  return {
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
  }
}

// Original demo accounts (everyone except kemal@omnitive.com) may keep seeing the
// shared dummy dataset on their first login under the new per-user scheme. Any other
// account — kemal, or anyone created later via the Kullanıcı Yönetimi screen — starts
// from a genuinely clean workspace.
export const LEGACY_SEEDED_EMAILS = new Set(['basak@omnitive.com', 'berkay@omnitive.com', 'seyma@omnitive.com', 'caner@omnitive.com'])

export function createInitialDataForUser(email: string): UserDataBlob {
  return LEGACY_SEEDED_EMAILS.has(email.toLowerCase()) ? createSeededUserData() : createEmptyUserData()
}
