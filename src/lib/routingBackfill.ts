import {
  CARRIER_METRIC_KEYS,
  PROVINCES,
  type CarrierMetricKey,
  type Contract,
  type RoutingCargoType,
  type RoutingRule,
  type Shipment,
  type ShipmentRoutingDecision,
} from '../data/catalog'
import { getEligibleCompanyIdsForShipment, type ShippingType } from './contracts'
import { computeCarrierScores, resolveRuleNarrowedPool, ruleConditionsSummary } from './carrierScoring'
import { desiKgFor, packageItemsFor } from './shipments'

const DEFAULT_WEIGHTS: Record<CarrierMetricKey, number> = {
  deliveryTime: 20,
  successRate: 25,
  damagedRate: 10,
  avgPickupHours: 10,
  costDiffPct: 10,
}

const PROVINCE_ID_BY_NAME = new Map<string, number>(PROVINCES.map((p) => [p.name, p.id]))

export function provinceIdForName(name: string): number | null {
  return PROVINCE_ID_BY_NAME.get(name) ?? null
}

export function syntheticOrderAmount(id: number): number {
  return packageItemsFor(id).reduce((sum, it) => sum + it.price * it.qty, 0)
}

/** Reconstructs a plausible 'auto' routing decision for a record that only has its final
 * carrier on record (no routingDecision snapshot) — runs the real eligibility/rule/scoring
 * pipeline, but always keeps the record's actual carrier as the chosen one so the result
 * never contradicts what the record shows elsewhere. */
export function synthesizeRoutingDecision(params: {
  id: number
  companyId: number
  provinceId: number | null
  desi?: number
  amount?: number
  productType?: string
  cargoType: RoutingCargoType
  shippingType: ShippingType
  contracts: Contract[]
  routingRules: RoutingRule[]
  shipments: Shipment[]
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[]
}): ShipmentRoutingDecision | null {
  if (params.provinceId == null) return null
  const desi = params.desi ?? desiKgFor(params.id).desi
  const amount = params.amount ?? syntheticOrderAmount(params.id)

  const eligible = new Set(
    getEligibleCompanyIdsForShipment(params.contracts, params.shippingType, {
      provinceId: params.provinceId,
      desi,
      amount,
      productType: params.productType,
    }),
  )
  // Never contradict the record's actual carrier — this is reconstructing a plausible
  // history around a known outcome, not re-deciding it.
  eligible.add(params.companyId)

  const { narrowed, ruleNarrowedCompanyIds, matchedRule, excludedCompanyIds, excludedByRuleNames } = resolveRuleNarrowedPool(
    params.routingRules,
    eligible,
    desi,
    params.provinceId,
    amount,
    params.cargoType,
    params.productType,
  )
  narrowed.add(params.companyId)

  const eligibleScores = computeCarrierScores(DEFAULT_WEIGHTS, params.shipments, params.carrierInvoices, [...narrowed])
  if (eligibleScores.length === 0) return null

  const totalWeight = CARRIER_METRIC_KEYS.reduce((sum, k) => sum + (DEFAULT_WEIGHTS[k] ?? 0), 0) || 1
  const normalizedWeights = Object.fromEntries(
    CARRIER_METRIC_KEYS.map((k) => [k, (DEFAULT_WEIGHTS[k] ?? 0) / totalWeight]),
  ) as Record<CarrierMetricKey, number>

  return {
    mode: 'auto',
    contractEligibleCompanyIds: [...eligible],
    matchedRuleId: matchedRule ? matchedRule.id : null,
    matchedRuleName: matchedRule ? matchedRule.name : null,
    matchedRuleSummary: matchedRule ? ruleConditionsSummary(matchedRule.conditions) : null,
    ruleNarrowedCompanyIds,
    excludedCompanyIds,
    excludedByRuleNames,
    weights: normalizedWeights,
    scores: eligibleScores.map((s) => ({ companyId: s.companyId, companyName: s.companyName, metrics: s.metrics, combined: s.combined })),
    chosenCompanyId: params.companyId,
  }
}
