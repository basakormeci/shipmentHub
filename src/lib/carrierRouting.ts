import {
  CARRIER_METRIC_KEYS,
  type CarrierMetricKey,
  type CarrierPricingRule,
  type Contract,
  type RoutingCargoType,
  type RoutingRule,
  type Shipment,
  type ShipmentRoutingDecision,
} from '../data/catalog'
import { getEligibleCompanyIdsForShipment, type ShippingType } from './contracts'
import { computeCarrierScores, resolveRuleNarrowedPool, ruleConditionsSummary } from './carrierScoring'

export interface DecideCarrierInput {
  provinceId: number
  desi: number
  amount: number
  contracts: Contract[]
  routingRules: RoutingRule[]
  routingWeights: Record<CarrierMetricKey, number>
  shipments: Shipment[]
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[]
  carrierPricing: CarrierPricingRule[]
  shippingType?: ShippingType
  cargoType?: RoutingCargoType
  productType?: string
}

/**
 * Decides which carrier a new shipment should be routed to, step by step:
 * 1) scan every contract and find every company whose active contract for this shipping
 *    type actually covers the package (desi range, order-amount range, recipient province,
 *    product type) — not just a shipping-type flag,
 * 2) among those, every matching "Kullanma" (exclude) rule removes carriers from the pool,
 *    then the first matching "Kullan" (include) rule narrows what's left to its
 *    primary/failover companies,
 * 3) the remaining pool is scored per criterion (normalized 0-1), each criterion's score is
 *    multiplied by its weight and the products are summed into one combined score per
 *    carrier — scored and compared only against each other, not the whole company roster,
 * 4) the carrier with the highest combined score is chosen.
 * Returns null when no carrier is eligible at all. Every step's outcome is kept on the
 * returned decision so the shipment/return/transfer detail page can show exactly what was
 * checked at each step.
 */
export function decideCarrier(input: DecideCarrierInput): ShipmentRoutingDecision | null {
  const {
    provinceId,
    desi,
    amount,
    contracts,
    routingRules,
    routingWeights,
    shipments,
    carrierInvoices,
    carrierPricing,
    shippingType = 'orderShipping',
    cargoType = 'shipment',
    productType,
  } = input

  const eligible = new Set(getEligibleCompanyIdsForShipment(contracts, shippingType, { provinceId, desi, amount, productType }))
  if (eligible.size === 0) return null

  const { narrowed, ruleNarrowedCompanyIds, matchedRule, excludedCompanyIds, excludedByRuleNames } = resolveRuleNarrowedPool(
    routingRules,
    eligible,
    desi,
    provinceId,
    amount,
    cargoType,
    productType,
  )

  const scores = computeCarrierScores(routingWeights, shipments, carrierInvoices, carrierPricing, [...narrowed])
  if (scores.length === 0) return null

  const chosen = scores[0]

  const totalWeight = CARRIER_METRIC_KEYS.reduce((sum, k) => sum + (routingWeights[k] ?? 0), 0) || 1
  const normalizedWeights = Object.fromEntries(
    CARRIER_METRIC_KEYS.map((k) => [k, (routingWeights[k] ?? 0) / totalWeight]),
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
    scores: scores.map((s) => ({ companyId: s.companyId, companyName: s.companyName, metrics: s.metrics, combined: s.combined })),
    chosenCompanyId: chosen.companyId,
  }
}
