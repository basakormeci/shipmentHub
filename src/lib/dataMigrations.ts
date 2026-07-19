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

// Standalone (not living inside dataStore.ts) so both dataStore's own zustand `persist`
// `migrate` option AND userDataRepository's one-time legacy-blob migration can share it
// without dataStore.ts <-> userDataRepository.ts import cycle.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function migrateDataState(persisted: any, version: number): any {
  const state = persisted
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
    return { ...state, carrierPricing: migrateCarrierPricing(state.carrierPricing) }
  }
  return state
}
