import {
  CARRIER_METRIC_KEYS,
  COMPANIES,
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

function representativePrice(rule: CarrierPricingRule): number | null {
  if (rule.model === 'perDesi') return rule.unitPrice
  if (!rule.tiers.length) return null
  return rule.tiers.reduce((sum, t) => sum + t.price, 0) / rule.tiers.length
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
  return parts.join(' · ')
}

export function matchRoutingRule(
  rules: RoutingRule[],
  desi: number,
  provinceId: number,
  amount: number,
  cargoType: RoutingCargoType,
) {
  const sorted = [...rules].filter((r) => r.active).sort((a, b) => a.priority - b.priority)
  for (const rule of sorted) {
    const c = rule.conditions
    if (!rule.cargoTypes.includes(cargoType)) continue
    if (desi < c.minDesi || desi > c.maxDesi) continue
    if (c.provinceIds.length > 0 && !c.provinceIds.includes(provinceId)) continue
    if (c.minAmount !== '' && amount < +c.minAmount) continue
    if (c.maxAmount !== '' && amount > +c.maxAmount) continue
    return rule
  }
  return null
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

/** Metrics where a lower raw value means better carrier performance (score is inverted after min-max normalization). */
const LOWER_IS_BETTER: CarrierMetricKey[] = ['cost', 'damagedRate', 'avgPickupHours', 'costDiffPct']

export function computeNormalizedCarrierScores(
  weights: Record<CarrierMetricKey, number>,
  shipments: Parameters<typeof computeCarrierPerformance>[0],
  carrierInvoices: Parameters<typeof computeCarrierPerformance>[1],
  carrierPricing: CarrierPricingRule[],
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

  const raw: Record<number, Record<CarrierMetricKey, number | null>> = {}
  COMPANIES.forEach((c) => {
    const p = perfMap[c.id]
    raw[c.id] = {
      cost: avgPriceFor(c.id),
      deliveryTime: p ? p.otdRate : null,
      successRate: p ? p.successRate : null,
      damagedRate: p ? p.damagedRate : null,
      avgPickupHours: p ? p.avgPickupHours : null,
      costDiffPct: p ? p.costDiffPct : null,
    }
  })

  const bounds = Object.fromEntries(
    CARRIER_METRIC_KEYS.map((k) => {
      const values = COMPANIES.map((c) => raw[c.id][k]).filter((v): v is number => v !== null)
      return [k, { min: values.length ? Math.min(...values) : 0, max: values.length ? Math.max(...values) : 0 }]
    }),
  ) as Record<CarrierMetricKey, { min: number; max: number }>

  function scoreFor(companyId: number, key: CarrierMetricKey): number {
    const value = raw[companyId][key]
    if (value === null) return 0.5
    const { min, max } = bounds[key]
    if (max <= min) return 1
    const norm = (value - min) / (max - min)
    return LOWER_IS_BETTER.includes(key) ? 1 - norm : norm
  }

  return COMPANIES.map((c) => {
    const metrics = Object.fromEntries(
      CARRIER_METRIC_KEYS.map((k) => [k, scoreFor(c.id, k)]),
    ) as Record<CarrierMetricKey, number>
    const combined = CARRIER_METRIC_KEYS.reduce((sum, k) => sum + normWeights[k] * metrics[k], 0)
    return { companyId: c.id, companyName: c.name, metrics, combined }
  }).sort((a, b) => b.combined - a.combined)
}
