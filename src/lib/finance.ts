import { INVOICE_STATUS, getCompany, type CarrierInvoice, type CarrierPricingRule } from '../data/catalog'
import { fmtDate } from './format'

export interface PriceCalculation {
  desi: number
  formula: string
  calculatedAmount: number | null
  minimumAmount: number
  usedMinimum: boolean
  finalAmount: number | null
}

/** Applies a carrier's pricing rule to a given desi, exactly matching how real invoices
 * are reconciled: tiered rules look up the matching desi band's flat price; per-desi
 * rules multiply desi by the unit price. Either way, the result is floored at the rule's
 * minimum charge — whichever is higher actually gets paid. */
export function calculateCarrierPrice(rule: CarrierPricingRule, desi: number): PriceCalculation {
  let calculatedAmount: number | null = null
  let formula = '—'

  if (rule.model === 'perDesi') {
    if (rule.unitPrice != null) {
      calculatedAmount = desi * rule.unitPrice
      formula = `${desi} × ${rule.unitPrice}`
    }
  } else {
    const tier = rule.tiers.find((t) => desi >= t.minDesi && desi <= t.maxDesi)
    if (tier) calculatedAmount = tier.price
  }

  if (calculatedAmount == null) {
    return { desi, formula, calculatedAmount: null, minimumAmount: rule.minimumAmount, usedMinimum: false, finalAmount: null }
  }

  const usedMinimum = calculatedAmount < rule.minimumAmount
  return {
    desi,
    formula,
    calculatedAmount,
    minimumAmount: rule.minimumAmount,
    usedMinimum,
    finalAmount: usedMinimum ? rule.minimumAmount : calculatedAmount,
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
