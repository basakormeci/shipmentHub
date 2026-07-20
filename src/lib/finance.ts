import { INVOICE_STATUS, getCompany, type CarrierInvoice, type CarrierPricingRule } from '../data/catalog'
import { fmtDate } from './format'

/** Picks the pricing rule to bill a shipment against: an exact origin-depot match for
 * that carrier if one exists, otherwise that carrier's "Tüm Depolar" (null-origin) rule,
 * otherwise any rule it has at all. Returns null only if the carrier has no rules at all. */
export function pickPricingRule(rules: CarrierPricingRule[], companyId: number, originNodeId: number | null): CarrierPricingRule | null {
  const companyRules = rules.filter((r) => r.companyId === companyId)
  if (companyRules.length === 0) return null
  if (originNodeId != null) {
    const forNode = companyRules.find((r) => r.originNodeId === originNodeId)
    if (forNode) return forNode
  }
  return companyRules.find((r) => r.originNodeId === null) ?? companyRules[0]
}

export function nextDraftInvoiceNo(existing: CarrierInvoice[]): string {
  const year = new Date().getFullYear()
  return `FTR-${year}-${String(existing.length + 1).padStart(5, '0')}`
}

/** Auto-billing for a freshly created shipment/return/transfer: matches the carrier's
 * pricing rule for the origin depot and computes the expected cost the same way the
 * manual "Örnek Hesaplama" preview does. realCost mirrors expectedCost until someone
 * reconciles the invoice against what the carrier actually billed. */
export function draftInvoiceFor(params: {
  companyId: number
  desi?: number
  originNodeId: number | null
  rules: CarrierPricingRule[]
  existingInvoices: CarrierInvoice[]
  ref: { shipmentNo?: number; returnNo?: number; transferNo?: number }
}): Omit<CarrierInvoice, 'id'> {
  const rule = pickPricingRule(params.rules, params.companyId, params.originNodeId)
  const calc = rule ? calculateCarrierPrice(rule, params.desi ?? 0) : null
  const expectedCost = calc?.finalAmount ?? 0
  return {
    companyId: params.companyId,
    ...params.ref,
    invoiceNo: nextDraftInvoiceNo(params.existingInvoices),
    expectedCost,
    realCost: expectedCost,
    invoiceDate: new Date().toISOString(),
    status: 'pending',
  }
}

export interface PriceCalculation {
  desi: number
  formula: string
  calculatedAmount: number | null
  minimumAmount: number
  usedMinimum: boolean
  finalAmount: number | null
}

/** Applies a carrier's pricing rule to a given desi, exactly matching how real invoices
 * are reconciled: the matching desi band is looked up, then priced according to that
 * band's own type — 'fixed' bands charge their flat price, 'perDesi' bands multiply desi
 * by their unit price. A single rule can mix both across its range. There is no rule-wide
 * minimum — each band carries its own minimumAmount, and the result is floored at that
 * band's minimum charge, whichever is higher actually gets paid. */
export function calculateCarrierPrice(rule: CarrierPricingRule, desi: number): PriceCalculation {
  const tier = (rule.tiers ?? []).find((t) => desi >= t.minDesi && desi <= t.maxDesi)
  if (!tier) {
    return { desi, formula: '—', calculatedAmount: null, minimumAmount: 0, usedMinimum: false, finalAmount: null }
  }

  const calculatedAmount = tier.type === 'perDesi' ? desi * tier.price : tier.price
  const formula = tier.type === 'perDesi' ? `${desi} × ${tier.price}` : `${tier.price}`
  const usedMinimum = calculatedAmount < tier.minimumAmount

  return {
    desi,
    formula,
    calculatedAmount,
    minimumAmount: tier.minimumAmount,
    usedMinimum,
    finalAmount: usedMinimum ? tier.minimumAmount : calculatedAmount,
  }
}

function csvEscape(val: unknown) {
  const s = String(val ?? '')
  return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function referenceLabel(inv: CarrierInvoice): string {
  if (inv.shipmentNo != null) return `#${inv.shipmentNo}`
  if (inv.returnNo != null) return `İade #${inv.returnNo}`
  if (inv.transferNo != null) return `Transfer #${inv.transferNo}`
  return '-'
}

export function exportInvoicesCsv(invoices: CarrierInvoice[]) {
  if (invoices.length === 0) return false

  const headers = ['Fatura No', 'Kargo Firması', 'Gönderi', 'Beklenen Ücret', 'Gerçek Ücret', 'Tarih', 'Durum']

  const rows = invoices.map((inv) => {
    const co = getCompany(inv.companyId)
    return [
      inv.invoiceNo,
      co ? co.name : '',
      referenceLabel(inv),
      inv.expectedCost,
      inv.realCost,
      fmtDate(inv.invoiceDate),
      INVOICE_STATUS[inv.status].label,
    ]
  })

  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `faturalar_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return true
}
