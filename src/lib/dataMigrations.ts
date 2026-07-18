import { SEED_TRANSFERS, SEED_CONTRACTS, type ShipmentStatus, type ReturnStatus } from '../data/catalog'

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
  return state
}
