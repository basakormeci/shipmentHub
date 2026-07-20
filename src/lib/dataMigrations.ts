import { SEED_TRANSFERS, SEED_CONTRACTS, type ShipmentStatus, type ReturnStatus } from '../data/catalog'

// CarrierPricing used to be a flat per-desi-range row (id, companyId, minDesi, maxDesi,
// price) — one row per tier. It's now one CarrierPricingRule per (company, origin depot)
// pair with an embedded tiers array, plus model/minimumAmount/unitPrice/originNodeId.
// Old rows (grouped by companyId, since there was no depot concept before) become a
// single "Tüm Depolar" tiered rule each; already-migrated data (has `model`) passes through.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateCarrierPricing(rows: any[] | undefined): any[] {
  if (!rows || rows.length === 0) return []
  if ('model' in rows[0]) return rows

  const grouped: Record<number, { minDesi: number; maxDesi: number; price: number }[]> = {}
  rows.forEach((p) => {
    if (!grouped[p.companyId]) grouped[p.companyId] = []
    grouped[p.companyId].push({ minDesi: p.minDesi, maxDesi: p.maxDesi, price: p.price })
  })
  return Object.entries(grouped).map(([companyId, tiers], idx) => ({
    id: idx + 1,
    companyId: Number(companyId),
    originNodeId: null,
    model: 'tiered',
    minimumAmount: 0,
    unitPrice: null,
    tiers,
  }))
}

// CarrierPricingRule's perDesi model used to carry a single flat `unitPrice` for the
// whole rule; it's now `perDesiTiers` (desi-range → unit price), matching how the
// tiered model already worked. Old perDesi rows become a single tier spanning the full
// desi range with their old unitPrice; already-migrated data (has `perDesiTiers`) passes
// through untouched.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migratePerDesiTiers(rows: any[] | undefined): any[] {
  if (!rows || rows.length === 0) return []
  return rows.map((r) => {
    if ('perDesiTiers' in r) return r
    const { unitPrice, ...rest } = r
    return {
      ...rest,
      perDesiTiers: r.model === 'perDesi' && unitPrice != null ? [{ minDesi: 0, maxDesi: 999, unitPrice }] : [],
    }
  })
}

// CarrierPricingRule dropped its rule-level `model` — a rule's tiers array now mixes
// 'fixed' (flat price) and 'perDesi' (unit price) bands within a single rule, instead of a
// whole rule being one model. Depots that briefly could hold two separate rows (one tiered
// + one perDesi rule for the same depot) get merged into a single row per (companyId,
// originNodeId); minimumAmount takes the higher of the two. Already-migrated data (no
// `model` field) passes through untouched.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateUnifiedTiers(rows: any[] | undefined): any[] {
  if (!rows || rows.length === 0) return []
  if (!('model' in rows[0])) return rows

  const groups = new Map<string, any[]>()
  rows.forEach((r) => {
    const key = `${r.companyId}:${r.originNodeId}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(r)
  })

  let nextId = 1
  const merged: any[] = []
  groups.forEach((group) => {
    const fixedTiers = group
      .filter((r) => r.model === 'tiered')
      .flatMap((r) => (r.tiers ?? []).map((t: any) => ({ minDesi: t.minDesi, maxDesi: t.maxDesi, type: 'fixed', price: t.price })))
    const perDesiTiers = group
      .filter((r) => r.model === 'perDesi')
      .flatMap((r) => (r.perDesiTiers ?? []).map((t: any) => ({ minDesi: t.minDesi, maxDesi: t.maxDesi, type: 'perDesi', price: t.unitPrice })))
    merged.push({
      id: nextId++,
      companyId: group[0].companyId,
      originNodeId: group[0].originNodeId,
      minimumAmount: Math.max(...group.map((r) => r.minimumAmount ?? 0)),
      tiers: [...fixedTiers, ...perDesiTiers].sort((a, b) => a.minDesi - b.minDesi),
    })
  })
  return merged
}

// CarrierPricingRule's minimumAmount moved from rule-level to per-tier — there is no single
// rule-wide minimum, each desi band carries its own. Old rows' rule-level minimumAmount gets
// copied onto every one of their tiers; already-migrated data (no rule-level `minimumAmount`)
// passes through untouched.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migratePerTierMinimum(rows: any[] | undefined): any[] {
  if (!rows || rows.length === 0) return []
  if (!('minimumAmount' in rows[0])) return rows
  return rows.map((r) => {
    const { minimumAmount, ...rest } = r
    return {
      ...rest,
      tiers: (r.tiers ?? []).map((t: any) => ({ ...t, minimumAmount: t.minimumAmount ?? minimumAmount ?? 0 })),
    }
  })
}

// RoutingRule gained a ruleType ('include'/'exclude'), excludedCompanyIds, and
// conditions.productTypes. Old rows (all implicitly "include" rules) get those fields
// backfilled; already-migrated data (has `ruleType`) passes through untouched.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function migrateRoutingRules(rows: any[] | undefined): any[] {
  if (!rows || rows.length === 0) return []
  if ('ruleType' in rows[0]) return rows
  return rows.map((r) => ({
    ...r,
    ruleType: 'include',
    excludedCompanyIds: r.excludedCompanyIds ?? [],
    conditions: { ...r.conditions, productTypes: r.conditions?.productTypes ?? [] },
  }))
}

// Standalone (not living inside dataStore.ts) so both dataStore's own zustand `persist`
// `migrate` option AND userDataRepository's one-time legacy-blob migration can share it
// without dataStore.ts <-> userDataRepository.ts import cycle.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateDataState(persisted: any, version: number): any {
  let state = persisted
  if (version < 3) {
    state = { ...state, transfers: state.transfers ?? SEED_TRANSFERS }
  }
  if (version < 4) {
    state = { ...state, contracts: state.contracts ?? SEED_CONTRACTS }
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
    state = {
      ...state,
      shipments: (state.shipments ?? []).map((s: { status: string }) => ({
        ...s,
        status: shipmentStatusMap[s.status] ?? s.status,
      })),
      returns: (state.returns ?? []).map((r: { status: string }) => ({
        ...r,
        status: returnStatusMap[r.status] ?? r.status,
      })),
      transfers: (state.transfers ?? []).map((tr: { status: string }) => ({
        ...tr,
        status: transferStatusMap[tr.status] ?? tr.status,
      })),
    }
  }
  if (version < 9) {
    state = { ...state, carrierPricing: migrateCarrierPricing(state.carrierPricing) }
  }
  if (version < 10) {
    state = { ...state, routingRules: migrateRoutingRules(state.routingRules) }
  }
  if (version < 11) {
    state = { ...state, carrierPricing: migratePerDesiTiers(state.carrierPricing) }
  }
  if (version < 12) {
    state = { ...state, carrierPricing: migrateUnifiedTiers(state.carrierPricing) }
  }
  if (version < 13) {
    state = { ...state, carrierPricing: migratePerTierMinimum(state.carrierPricing) }
  }
  return state
}
