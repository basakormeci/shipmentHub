import {
  COMPANIES,
  PROVINCES,
  SEED_CONTRACTS,
  getCompany,
  type Contract,
  type ContractForm,
  type ContractStatus,
} from '../data/catalog'
import { fmtDate } from './format'

export type ContractFilterStatus = ContractStatus | 'all'

export interface NodeUsage {
  companyId: number
  companyName: string
  credentialName: string
  contractId: number
  contractName: string
  contractStatus: ContractStatus
}

export function emptyContractForm(): ContractForm {
  return {
    companyId: '',
    name: '',
    minDesi: '',
    maxDesi: '',
    minOrderAmount: '',
    maxOrderAmount: '',
    orderShipping: true,
    returnShipping: true,
    transferShipping: false,
    productTypes: [],
    coveredRegions: [],
    search2: '',
    activeProvinceId2: '',
    credentials: [],
  }
}

export function contractFormFromContract(c: Contract): ContractForm {
  return {
    companyId: c.companyId,
    name: c.name,
    minDesi: c.minDesi,
    maxDesi: c.maxDesi,
    minOrderAmount: c.minOrderAmount,
    maxOrderAmount: c.maxOrderAmount,
    orderShipping: c.orderShipping,
    returnShipping: c.returnShipping,
    transferShipping: !!c.transferShipping,
    productTypes: [...(c.productTypes ?? [])],
    coveredRegions: JSON.parse(JSON.stringify(c.coveredRegions)),
    search2: '',
    activeProvinceId2: '',
    credentials: JSON.parse(JSON.stringify(c.credentials)),
  }
}

export type ShippingType = 'orderShipping' | 'returnShipping' | 'transferShipping'

/** Companies that have at least one active contract enabled for the given shipping type. */
export function getEligibleCompanyIds(contracts: Contract[], type: ShippingType): number[] {
  const ids = new Set<number>()
  contracts.forEach((c) => {
    if (c.status === 'active' && c[type]) ids.add(c.companyId)
  })
  return [...ids]
}

export function getNodeUsage(nodeId: number, contracts: Contract[] = SEED_CONTRACTS): NodeUsage[] {
  const usage: NodeUsage[] = []
  contracts.forEach((c) => {
    const co = getCompany(c.companyId)
    c.credentials.forEach((cred) => {
      if (cred.nodes.some((n) => n.id === nodeId)) {
        usage.push({
          companyId: c.companyId,
          companyName: co ? co.name : 'Bilinmiyor',
          credentialName: cred.name,
          contractId: c.id,
          contractName: c.name,
          contractStatus: c.status,
        })
      }
    })
  })
  return usage
}

export function validateContractStep(
  step: number,
  f: ContractForm,
  t: (key: string) => string,
): Record<string, string> {
  const errs: Record<string, string> = {}
  if (step === 1) {
    if (!f.companyId) errs.companyId = t('validation.company_required')
    if (f.minDesi === '' || f.minDesi === null) errs.minDesi = t('validation.min_desi_required')
    if (f.maxDesi === '' || f.maxDesi === null) errs.maxDesi = t('validation.max_desi_required')
    if (errs.minDesi === undefined && errs.maxDesi === undefined) {
      if (+f.minDesi < 0) errs.minDesi = t('validation.negative_value')
      if (+f.maxDesi < 0) errs.maxDesi = t('validation.negative_value')
      if (+f.minDesi >= +f.maxDesi) errs.minDesi = t('validation.min_desi_lt_max')
    }
    if (
      f.minOrderAmount !== '' &&
      f.maxOrderAmount !== '' &&
      +f.minOrderAmount >= +f.maxOrderAmount
    ) {
      errs.minOrderAmount = t('validation.min_amount_lt_max')
    }
    if (!f.orderShipping && !f.returnShipping) {
      errs.shippingType = t('validation.shipping_type_required')
    }
  }
  return errs
}

export function contractPayloadFromForm(f: ContractForm, editingId: number | null, contracts: Contract[]) {
  const extraFields = {
    transferShipping: f.transferShipping,
    productTypes: f.productTypes,
  }
  const base = {
    companyId: +f.companyId,
    orderShipping: f.orderShipping,
    returnShipping: f.returnShipping,
    minDesi: +f.minDesi,
    maxDesi: +f.maxDesi,
    minOrderAmount: f.minOrderAmount !== '' ? +f.minOrderAmount : ('' as const),
    maxOrderAmount: f.maxOrderAmount !== '' ? +f.maxOrderAmount : ('' as const),
    coveredRegions: f.coveredRegions,
    credentials: f.credentials,
    ...extraFields,
  }

  if (editingId !== null) {
    const existing = contracts.find((c) => c.id === editingId)
    return {
      id: editingId,
      name: existing?.name ?? f.name,
      status: existing?.status ?? ('active' as const),
      createdAt: existing?.createdAt ?? new Date().toISOString().split('T')[0],
      ...base,
    }
  }

  const co = getCompany(+f.companyId)
  const sameCount = contracts.filter((c) => c.companyId === +f.companyId).length
  const autoName = co ? (sameCount > 0 ? `${co.name} #${sameCount + 1}` : co.name) : 'Sözleşme'
  return {
    name: autoName,
    status: 'active' as const,
    createdAt: new Date().toISOString().split('T')[0],
    ...base,
  }
}

function csvEscape(val: unknown) {
  const s = String(val ?? '')
  return s.includes(';') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
}

export function exportContractsCsv(contracts: Contract[], lang: 'tr' | 'en' = 'tr') {
  if (contracts.length === 0) return false

  const headers =
    lang === 'tr'
      ? ['Firma', 'Sözleşme Adı', 'Sipariş', 'İade', 'Transfer', 'Min Desi', 'Max Desi', 'Durum', 'Tarih']
      : ['Company', 'Contract Name', 'Order', 'Return', 'Transfer', 'Min Desi', 'Max Desi', 'Status', 'Date']

  const yes = lang === 'tr' ? 'Evet' : 'Yes'
  const no = lang === 'tr' ? 'Hayır' : 'No'
  const active = lang === 'tr' ? 'Aktif' : 'Active'
  const passive = lang === 'tr' ? 'Pasif' : 'Passive'

  const rows = contracts.map((c) => {
    const co = getCompany(c.companyId)
    return [
      co ? co.name : '',
      c.name,
      c.orderShipping ? yes : no,
      c.returnShipping ? yes : no,
      c.transferShipping ? yes : no,
      c.minDesi,
      c.maxDesi,
      c.status === 'active' ? active : passive,
      fmtDate(c.createdAt),
    ]
  })

  const csv = [headers, ...rows].map((r) => r.map(csvEscape).join(';')).join('\r\n')
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `kargo_firmalari_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return true
}

export function nextCredentialId(credentials: ContractForm['credentials']) {
  return Math.max(0, ...credentials.map((c) => c.id)) + 1
}

export { COMPANIES, PROVINCES }
