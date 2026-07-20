import {
  CARRIER_METRIC_KEYS,
  COMPANIES,
  PRODUCT_TYPES,
  PROVINCES,
  getCompany,
  isDamagedFor,
  pickupTimeHoursFor,
  plannedDeliveryDate,
  actualDeliveryDate,
  type CarrierMetricKey,
  type CarrierPricingRule,
  type RoutingCargoType,
  type RoutingRule,
  type Shipment,
} from '../data/catalog'

// perDesi bands don't have a standalone ₺ figure — approximate one using the band's own
// midpoint desi so it stays comparable to fixed bands' flat prices.
function representativePrice(rule: CarrierPricingRule): number | null {
  if (!rule.tiers?.length) return null
  const amounts = rule.tiers.map((t) => (t.type === 'perDesi' ? t.price * ((t.minDesi + t.maxDesi) / 2) : t.price))
  return amounts.reduce((sum, a) => sum + a, 0) / amounts.length
}

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

export function ruleConditionsSummary(cond: RoutingRule['conditions']) {
  const parts: string[] = []
  parts.push(`${cond.minDesi}–${cond.maxDesi} desi`)
  if (cond.provinceIds.length > 0) {
    const names = cond.provinceIds.map((id) => getProvince(id)?.name).filter(Boolean) as string[]
    parts.push(names.length > 2 ? `${names.slice(0, 2).join(', ')} +${names.length - 2}` : names.join(', '))
  } else {
    parts.push('Tüm bölgeler')
  }
  if (cond.minAmount !== '' || cond.maxAmount !== '') {
    parts.push(`₺${cond.minAmount || 0}${cond.maxAmount ? `–₺${cond.maxAmount}` : '+'}`)
  }
  if (cond.productTypes?.length > 0) {
    const names = cond.productTypes.map((k) => PRODUCT_TYPES[k] ?? k)
    parts.push(names.join(', '))
  }
  return parts.join(' · ')
}

function conditionsMatch(
  cond: RoutingRule['conditions'],
  desi: number,
  provinceId: number,
  amount: number,
  productType?: string,
) {
  if (desi < cond.minDesi || desi > cond.maxDesi) return false
  if (cond.provinceIds.length > 0 && !cond.provinceIds.includes(provinceId)) return false
  if (cond.minAmount !== '' && amount < +cond.minAmount) return false
  if (cond.maxAmount !== '' && amount > +cond.maxAmount) return false
  if (cond.productTypes?.length > 0 && (!productType || !cond.productTypes.includes(productType))) return false
  return true
}

/** First active "Kullan" (include) rule matching the given shipment, by priority. Narrows the
 * eligible carrier pool to its primary/failover companies (see decideCarrier in carrierRouting.ts). */
export function matchIncludeRule(
  rules: RoutingRule[],
  desi: number,
  provinceId: number,
  amount: number,
  cargoType: RoutingCargoType,
  productType?: string,
) {
  const sorted = [...rules].filter((r) => r.active && r.ruleType === 'include').sort((a, b) => a.priority - b.priority)
  for (const rule of sorted) {
    if (!rule.cargoTypes.includes(cargoType)) continue
    if (!conditionsMatch(rule.conditions, desi, provinceId, amount, productType)) continue
    return rule
  }
  return null
}

/** Every active "Kullanma" (exclude) rule matching the given shipment — all of them apply at
 * once (not just the first by priority), since exclusions are hard constraints, not preferences. */
export function matchExcludeRules(
  rules: RoutingRule[],
  desi: number,
  provinceId: number,
  amount: number,
  cargoType: RoutingCargoType,
  productType?: string,
) {
  return rules.filter(
    (rule) =>
      rule.active &&
      rule.ruleType === 'exclude' &&
      rule.cargoTypes.includes(cargoType) &&
      conditionsMatch(rule.conditions, desi, provinceId, amount, productType),
  )
}

/** Applies every matching "Kullanma" (exclude) rule first (hard removal from the pool), then
 * the first matching "Kullan" (include) rule narrows what's left to its primary/failover
 * companies. Shared by decideCarrier (carrierRouting.ts) and synthesizeRoutingDecision
 * (routingBackfill.ts) so both stay in sync. */
export function resolveRuleNarrowedPool(
  rules: RoutingRule[],
  eligible: Set<number>,
  desi: number,
  provinceId: number,
  amount: number,
  cargoType: RoutingCargoType,
  productType?: string,
) {
  const excludeRules = matchExcludeRules(rules, desi, provinceId, amount, cargoType, productType)
  const excludedCompanyIds = Array.from(new Set(excludeRules.flatMap((r) => r.excludedCompanyIds)))
  const excludedByRuleNames = excludeRules.map((r) => r.name)
  const afterExclude = new Set([...eligible].filter((id) => !excludedCompanyIds.includes(id)))

  const matchedRule = matchIncludeRule(rules, desi, provinceId, amount, cargoType, productType)
  let narrowed = afterExclude
  let ruleNarrowedCompanyIds: number[] | null = null
  if (matchedRule) {
    const ruleCompanies = [matchedRule.primaryCompanyId, matchedRule.failoverCompanyId].filter(
      (id): id is number => id != null && afterExclude.has(id),
    )
    if (ruleCompanies.length > 0) {
      narrowed = new Set(ruleCompanies)
      ruleNarrowedCompanyIds = [...narrowed]
    }
  }

  return { narrowed, ruleNarrowedCompanyIds, matchedRule, excludedCompanyIds, excludedByRuleNames }
}

export function computeCarrierPerformance(
  shipments: Shipment[],
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[],
) {
  const byCompany: Record<
    number,
    { total: number; delivered: number; damaged: number; onTime: number; pickupSum: number }
  > = {}

  shipments.forEach((s) => {
    if (!byCompany[s.companyId]) {
      byCompany[s.companyId] = { total: 0, delivered: 0, damaged: 0, onTime: 0, pickupSum: 0 }
    }
    const b = byCompany[s.companyId]
    b.total++
    b.pickupSum += pickupTimeHoursFor(s.id)
    if (s.status === 'DeliveredToCustomer' || s.status === 'DeliveredToStore' || s.status === 'ReturnToSender') {
      b.delivered++
      if (isDamagedFor(s.id)) b.damaged++
      const actual = actualDeliveryDate(s)
      if (actual && new Date(actual) <= new Date(plannedDeliveryDate(s))) b.onTime++
    }
  })

  return Object.keys(byCompany)
    .map((cid) => {
      const b = byCompany[+cid]
      const co = getCompany(+cid)
      const invoices = carrierInvoices.filter((i) => i.companyId === +cid)
      const costBalance = invoices.reduce((sum, i) => sum + (i.realCost - i.expectedCost), 0)
      const totalExpected = invoices.reduce((sum, i) => sum + i.expectedCost, 0)
      const costDiffPct = totalExpected ? (costBalance / totalExpected) * 100 : 0
      return {
        companyId: +cid,
        companyName: co ? co.name : 'Bilinmiyor',
        total: b.total,
        successRate: b.total ? b.delivered / b.total : 0,
        damagedRate: b.delivered ? b.damaged / b.delivered : 0,
        otdRate: b.delivered ? b.onTime / b.delivered : 0,
        avgPickupHours: b.total ? b.pickupSum / b.total : 0,
        costDiffPct,
      }
    })
    .sort((a, b) => b.total - a.total)
}

/** Metrics whose *displayed* score is inverted from its "goodness" for the weighted total —
 * only damagedRate: the score shown is the literal damage percentage (low = good, but still a
 * high raw number would look bad), while avgPickupHours/costDiffPct are already goodness-scaled
 * (see below) and cost is already inverted by its own min-max comparison. */
const DISPLAY_INVERTED_FOR_COMBINED: CarrierMetricKey[] = ['damagedRate']

/** Computes the weighted score table used to rank carriers. By default scores every company
 * in the system (used by the standalone "Puanlama" screen); pass `companyIds` to restrict
 * both which carriers are scored AND the cost min-max comparison to just that pool — this is
 * what smart routing uses so scores (and the "cheapest wins" cost comparison) are relative to
 * the carriers actually still in the running after eligibility/rule filtering, not the whole
 * roster. */
export function computeCarrierScores(
  weights: Record<CarrierMetricKey, number>,
  shipments: Parameters<typeof computeCarrierPerformance>[0],
  carrierInvoices: Parameters<typeof computeCarrierPerformance>[1],
  carrierPricing: CarrierPricingRule[],
  companyIds?: number[],
) {
  const totalWeight = CARRIER_METRIC_KEYS.reduce((sum, k) => sum + (weights[k] ?? 0), 0) || 1
  const normWeights = Object.fromEntries(
    CARRIER_METRIC_KEYS.map((k) => [k, (weights[k] ?? 0) / totalWeight]),
  ) as Record<CarrierMetricKey, number>

  const perf = computeCarrierPerformance(shipments, carrierInvoices)
  const perfMap: Record<number, (typeof perf)[0]> = {}
  perf.forEach((p) => {
    perfMap[p.companyId] = p
  })

  const pool = companyIds ? COMPANIES.filter((c) => companyIds.includes(c.id)) : COMPANIES

  // Cost has no fixed absolute scale (₺ amounts vary wildly) — it stays comparative: cheapest
  // carrier with pricing data scores highest, relative to the others still in the pool.
  const pricingByCompany: Record<number, number[]> = {}
  carrierPricing.forEach((rule) => {
    const price = representativePrice(rule)
    if (price == null) return
    if (!pricingByCompany[rule.companyId]) pricingByCompany[rule.companyId] = []
    pricingByCompany[rule.companyId].push(price)
  })
  const avgPriceFor = (companyId: number) => {
    const prices = pricingByCompany[companyId]
    return prices?.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null
  }
  const allPrices = pool.map((c) => avgPriceFor(c.id)).filter((v): v is number => v !== null)
  const priceBounds = { min: allPrices.length ? Math.min(...allPrices) : 0, max: allPrices.length ? Math.max(...allPrices) : 0 }
  function costScore(companyId: number): number {
    const price = avgPriceFor(companyId)
    if (price === null) return 0.5
    if (priceBounds.max <= priceBounds.min) return 1
    return 1 - (price - priceBounds.min) / (priceBounds.max - priceBounds.min)
  }

  function displayScore(companyId: number, key: CarrierMetricKey): number {
    const p = perfMap[companyId]
    if (key === 'cost') return costScore(companyId)
    if (!p) return 0.5
    if (key === 'deliveryTime') return p.otdRate
    if (key === 'successRate') return p.successRate
    if (key === 'damagedRate') return p.damagedRate
    if (key === 'avgPickupHours') return Math.max(0, Math.min(1, 1 - p.avgPickupHours / 12))
    // costDiffPct
    return Math.max(0, Math.min(1, 1 - Math.max(0, p.costDiffPct) / 100))
  }

  return pool
    .map((c) => {
      const metrics = Object.fromEntries(
        CARRIER_METRIC_KEYS.map((k) => [k, displayScore(c.id, k)]),
      ) as Record<CarrierMetricKey, number>
      const combined = CARRIER_METRIC_KEYS.reduce((sum, k) => {
        const quality = DISPLAY_INVERTED_FOR_COMBINED.includes(k) ? 1 - metrics[k] : metrics[k]
        return sum + normWeights[k] * quality
      }, 0)
      return { companyId: c.id, companyName: c.name, metrics, combined }
    })
    .sort((a, b) => b.combined - a.combined)
}
