import { INVOICE_STATUS, getCompany, type CarrierInvoice } from '../data/catalog'
import { fmtDate } from './format'

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
