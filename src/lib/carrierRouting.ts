import {
  CARRIER_METRIC_KEYS,
  type CarrierMetricKey,
  type Contract,
  type RoutingCargoType,
  type RoutingRule,
  type Shipment,
  type ShipmentRoutingDecision,
} from '../data/catalog'
import { getDefaultCompanyId, getEligibleCompanyIds, type ShippingType } from './contracts'
import { computeNormalizedCarrierScores, matchRoutingRule, ruleConditionsSummary } from './carrierScoring'

export interface DecideCarrierInput {
  provinceId: number
  desi: number
  amount: number
  contracts: Contract[]
  routingRules: RoutingRule[]
  routingWeights: Record<CarrierMetricKey, number>
  shipments: Shipment[]
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[]
  carrierPricing: { companyId: number; price: number }[]
  shippingType?: ShippingType
  cargoType?: RoutingCargoType
}

const TIE_EPSILON = 0.0005

/**
 * Decides which carrier a new shipment should be routed to, step by step:
 * 1) eligibility from active order-shipping contracts, 2) an active routing rule
 * matching desi/province/amount narrows that pool, 3) the remaining pool is
 * ranked by the normalized carrier score table (Ağırlık Verme weights,
 * per-metric breakdown kept for display), 4) ties fall back to the contract
 * marked as default for orders. Returns null when no carrier is eligible at
 * all. Every step's outcome is kept on the returned decision so the shipment
 * detail page can show exactly what was checked.
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
  } = input

  const eligible = new Set(getEligibleCompanyIds(contracts, shippingType))
  if (eligible.size === 0) return null

  const matchedRule = matchRoutingRule(routingRules, desi, provinceId, amount, cargoType)
  let narrowed = eligible
  let ruleNarrowedCompanyIds: number[] | null = null
  if (matchedRule) {
    const ruleCompanies = [matchedRule.primaryCompanyId, matchedRule.failoverCompanyId].filter(
      (id): id is number => id != null && eligible.has(id),
    )
    if (ruleCompanies.length > 0) {
      narrowed = new Set(ruleCompanies)
      ruleNarrowedCompanyIds = [...narrowed]
    }
  }

  const allScores = computeNormalizedCarrierScores(routingWeights, shipments, carrierInvoices, carrierPricing)
  const eligibleScores = allScores.filter((s) => narrowed.has(s.companyId))
  if (eligibleScores.length === 0) return null

  const topScore = eligibleScores[0].combined
  const tied = eligibleScores.filter((s) => Math.abs(s.combined - topScore) < TIE_EPSILON)

  let chosen = eligibleScores[0]
  let tieBreakUsedDefault = false
  if (tied.length > 1) {
    const defaultCompanyId = getDefaultCompanyId(contracts, shippingType)
    const defaultTied = defaultCompanyId != null ? tied.find((s) => s.companyId === defaultCompanyId) : undefined
    if (defaultTied) {
      chosen = defaultTied
      tieBreakUsedDefault = true
    }
  }

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
    weights: normalizedWeights,
    scores: eligibleScores.map((s) => ({ companyId: s.companyId, companyName: s.companyName, metrics: s.metrics, combined: s.combined })),
    chosenCompanyId: chosen.companyId,
    tieBreakUsedDefault,
  }
}
