import type { ReturnStatus, ShipmentStatus } from '../data/catalog'

/** Canonical progression leading up to (and including) each status, used to backfill a
 * plausible full history for a record that only has its current status on record. */
const SHIPMENT_STATUS_PATH: Record<ShipmentStatus, ShipmentStatus[]> = {
  DispatchLabelCreated: ['DispatchLabelCreated'],
  OnTheWayForPickUp: ['DispatchLabelCreated', 'OnTheWayForPickUp'],
  OnPickUpAddress: ['DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress'],
  ReceivedByProvider: ['DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider'],
  OnTheWay: ['DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay'],
  ProviderReceivedThePackage: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay', 'ProviderReceivedThePackage',
  ],
  OnDeliveryAddress: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress',
  ],
  DeliveredToCustomer: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress', 'DeliveredToCustomer',
  ],
  DeliveredToStore: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress', 'DeliveredToStore',
  ],
  CreateShipmentError: ['DispatchLabelCreated', 'CreateShipmentError'],
  ShipmentCanceled: ['DispatchLabelCreated', 'ShipmentCanceled'],
  ShipmentFailed: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress', 'ShipmentFailed',
  ],
  OnTheWayBackToSender: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress', 'ShipmentFailed', 'OnTheWayBackToSender',
  ],
  ReturnToSender: [
    'DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress', 'ReceivedByProvider', 'OnTheWay',
    'ProviderReceivedThePackage', 'OnDeliveryAddress', 'ShipmentFailed', 'OnTheWayBackToSender', 'ReturnToSender',
  ],
}

const RETURN_STATUS_PATH: Record<ReturnStatus, ReturnStatus[]> = {
  ReturnCodeCreated: ['ReturnCodeCreated'],
  ReturnOnTheWay: ['ReturnCodeCreated', 'ReturnOnTheWay'],
  OnReturnAddress: ['ReturnCodeCreated', 'ReturnOnTheWay', 'OnReturnAddress'],
  ReturnReceivedByProvider: ['ReturnCodeCreated', 'ReturnOnTheWay', 'OnReturnAddress', 'ReturnReceivedByProvider'],
  ReceivedByReturnCenter: ['ReturnCodeCreated', 'ReturnOnTheWay', 'OnReturnAddress', 'ReturnReceivedByProvider', 'ReceivedByReturnCenter'],
  ReturnShipmentError: ['ReturnCodeCreated', 'ReturnShipmentError'],
  ReturnCodeExpired: ['ReturnCodeCreated', 'ReturnCodeExpired'],
}

function spreadTimestamps<T extends string>(path: T[], startIso: string, endIso: string, idSeed: number): { status: T; at: string }[] {
  const start = new Date(startIso).getTime()
  const end = new Date(endIso).getTime()
  const totalMs = Math.max(end - start, path.length * 60000)
  const n = path.length
  return path.map((status, idx) => {
    if (idx === 0) return { status, at: new Date(start).toISOString() }
    const frac = idx / (n - 1)
    const jitter = ((idSeed * (idx + 1)) % 17) / 100
    const t = start + totalMs * Math.min(frac + jitter - 0.08, 1)
    return { status, at: new Date(Math.max(t, start + idx * 60000)).toISOString() }
  })
}

/** Synthesizes a plausible full status history for a shipment/transfer that only has its
 * current status on record (e.g. a stale record from before history tracking existed). */
export function synthesizeShipmentHistory(status: ShipmentStatus, createdAtIso: string, id: number): { status: ShipmentStatus; at: string }[] {
  const path = SHIPMENT_STATUS_PATH[status] ?? [status]
  let end: string
  if (status === 'DeliveredToCustomer' || status === 'DeliveredToStore' || status === 'ReturnToSender') {
    const d = new Date(createdAtIso)
    d.setHours(d.getHours() + 20 + (id % 30))
    end = d.toISOString()
  } else if (status === 'ShipmentCanceled' || status === 'CreateShipmentError') {
    end = new Date(new Date(createdAtIso).getTime() + 1000 * 60 * 60 * (2 + (id % 5))).toISOString()
  } else {
    end = new Date().toISOString()
  }
  return spreadTimestamps(path, createdAtIso, end, id)
}

/** Same idea for returns. */
export function synthesizeReturnHistory(status: ReturnStatus, requestDateIso: string, id: number): { status: ReturnStatus; at: string }[] {
  const path = RETURN_STATUS_PATH[status] ?? [status]
  const isTerminal = status === 'ReceivedByReturnCenter' || status === 'ReturnShipmentError' || status === 'ReturnCodeExpired'
  const end = isTerminal
    ? new Date(new Date(requestDateIso).getTime() + 1000 * 60 * 60 * 24 * (2 + (id % 6))).toISOString()
    : new Date().toISOString()
  return spreadTimestamps(path, requestDateIso, end, id)
}
