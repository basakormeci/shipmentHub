import {
  CARRIER_METRIC_KEYS,
  PROVINCES,
  type CarrierMetricKey,
  type CarrierPricingRule,
  type Contract,
  type RoutingCargoType,
  type RoutingRule,
  type Shipment,
  type ShipmentRoutingDecision,
} from '../data/catalog'
import { getEligibleCompanyIds, type ShippingType } from './contracts'
import { computeNormalizedCarrierScores, matchRoutingRule, ruleConditionsSummary } from './carrierScoring'
import { desiKgFor, packageItemsFor } from './shipments'

const DEFAULT_WEIGHTS: Record<CarrierMetricKey, number> = {
  cost: 25,
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
  cargoType: RoutingCargoType
  shippingType: ShippingType
  contracts: Contract[]
  routingRules: RoutingRule[]
  shipments: Shipment[]
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[]
  carrierPricing: CarrierPricingRule[]
}): ShipmentRoutingDecision | null {
  if (params.provinceId == null) return null
  const desi = params.desi ?? desiKgFor(params.id).desi
  const amount = params.amount ?? syntheticOrderAmount(params.id)

  const eligible = new Set(getEligibleCompanyIds(params.contracts, params.shippingType))
  if (eligible.size === 0) return null

  const matchedRule = matchRoutingRule(params.routingRules, desi, params.provinceId, amount, params.cargoType)
  let narrowed = eligible
  let ruleNarrowedCompanyIds: number[] | null = null
  if (matchedRule) {
    const ruleCompanies = [matchedRule.primaryCompanyId, matchedRule.failoverCompanyId].filter(
      (cid): cid is number => cid != null && eligible.has(cid),
    )
    if (ruleCompanies.length > 0) {
      narrowed = new Set(ruleCompanies)
      ruleNarrowedCompanyIds = [...narrowed]
    }
  }

  const allScores = computeNormalizedCarrierScores(DEFAULT_WEIGHTS, params.shipments, params.carrierInvoices, params.carrierPricing)
  narrowed.add(params.companyId)
  const eligibleScores = allScores.filter((s) => narrowed.has(s.companyId))
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
    weights: normalizedWeights,
    scores: eligibleScores.map((s) => ({ companyId: s.companyId, companyName: s.companyName, metrics: s.metrics, combined: s.combined })),
    chosenCompanyId: params.companyId,
  }
}
