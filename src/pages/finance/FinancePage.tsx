import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import {
  COMPANIES,
  getCompany,
  INVOICE_STATUS,
  type CarrierInvoice,
  type CarrierPricingRule,
  type PricingTierType,
} from '../../data/catalog'
import { fmtDateTimeStr } from '../../lib/format'
import { exportInvoicesCsv, calculateCarrierPrice } from '../../lib/finance'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'
import { SegmentedToggle } from '../../components/ui/SegmentedToggle'

const TABS = [
  { key: 'setup', label: 'Fiyatlandırma & Kota', to: '/finance/setup' },
  { key: 'invoices', label: 'Fatura İşlemleri', to: '/finance/invoices' },
  { key: 'quotas', label: 'Kota Kullanımları', to: '/finance/quotas' },
] as const

function InvoiceModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const upsertInvoice = useDataStore((s) => s.upsertInvoice)
  const existing = editId != null ? carrierInvoices.find((i) => i.id === editId) : null

  const [companyId, setCompanyId] = useState(existing?.companyId ?? COMPANIES[0].id)
  const [shipmentNo, setShipmentNo] = useState(existing ? String(existing.shipmentNo) : '')
  const [invoiceNo, setInvoiceNo] = useState(existing?.invoiceNo ?? '')
  const [expectedCost, setExpectedCost] = useState(existing ? String(existing.expectedCost) : '')
  const [realCost, setRealCost] = useState(existing ? String(existing.realCost) : '')
  const [status, setStatus] = useState<CarrierInvoice['status']>(existing?.status ?? 'pending')

  if (!open) return null

  const canSave = companyId && shipmentNo && invoiceNo && expectedCost !== '' && realCost !== ''

  function save() {
    if (!canSave) return
    upsertInvoice({
      id: editId,
      companyId,
      shipmentNo: +shipmentNo,
      invoiceNo,
      expectedCost: +expectedCost,
      realCost: +realCost,
      invoiceDate: existing?.invoiceDate ?? new Date().toISOString(),
      status,
    })
    toast(editId ? 'Fatura kaydı güncellendi.' : 'Yeni fatura kaydı oluşturuldu.', 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-4">{editId ? 'Fatura Kaydını Düzenle' : 'Yeni Fatura Kaydı'}</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label">Kargo Firması</label>
            <Dropdown
              value={String(companyId)}
              onChange={(v) => setCompanyId(+v)}
              options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Gönderi No</label>
              <input type="text" className="form-input" value={shipmentNo} onChange={(e) => setShipmentNo(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Fatura No</label>
              <input type="text" className="form-input" value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Beklenen Ücret (₺)</label>
              <input type="text" inputMode="numeric" className="form-input" value={expectedCost} onChange={(e) => setExpectedCost(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Gerçek Ücret (₺)</label>
              <input type="text" inputMode="numeric" className="form-input" value={realCost} onChange={(e) => setRealCost(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">Durum</label>
            <Dropdown
              value={status}
              onChange={(v) => setStatus(v as CarrierInvoice['status'])}
              options={(Object.keys(INVOICE_STATUS) as CarrierInvoice['status'][]).map((k) => ({
                value: k,
                label: INVOICE_STATUS[k].label,
              }))}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            Vazgeç
          </button>
          <button className="primary-btn" type="button" onClick={save} disabled={!canSave}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

function InvoicePanel() {
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const removeInvoice = useDataStore((s) => s.removeInvoice)
  const [modalId, setModalId] = useState<number | null>(null)

  if (carrierInvoices.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Fatura kaydı bulunmuyor.</div>
  }

  return (
    <>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100 bg-neutral-50">
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fatura No</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gönderi</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Beklenen / Gerçek</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tarih</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {carrierInvoices.map((inv) => {
              const co = getCompany(inv.companyId)
              const meta = INVOICE_STATUS[inv.status]
              const diff = inv.realCost - inv.expectedCost
              return (
                <tr key={inv.id} className="hover:bg-neutral-50/80">
                  <td className="px-4 py-3 font-mono text-xs text-neutral-700">{inv.invoiceNo}</td>
                  <td className="px-4 py-3 text-neutral-600">{co ? co.name : 'Bilinmiyor'}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {inv.shipmentNo != null
                      ? `#${inv.shipmentNo}`
                      : inv.returnNo != null
                        ? `İade #${inv.returnNo}`
                        : inv.transferNo != null
                          ? `Transfer #${inv.transferNo}`
                          : '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-neutral-500">₺{inv.expectedCost}</span> /{' '}
                    <span className={`font-semibold ${diff > 0 ? 'text-[#ad1f2b]' : diff < 0 ? 'text-[#1a8245]' : 'text-neutral-700'}`}>
                      ₺{inv.realCost}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(inv.invoiceDate)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${meta.badge}`}>{meta.label}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 justify-end">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                        type="button"
                        title="Düzenle"
                        onClick={() => setModalId(inv.id)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
                        type="button"
                        title="Sil"
                        onClick={() => {
                          removeInvoice(inv.id)
                          toast('Fatura kaydı silindi.', 'info')
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {modalId != null ? <InvoiceModal open editId={modalId} onClose={() => setModalId(null)} /> : null}
    </>
  )
}

function QuotaPanel() {
  const carrierQuotas = useDataStore((s) => s.carrierQuotas)

  if (carrierQuotas.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Kota kaydı bulunmuyor.</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {carrierQuotas.map((q) => {
        const co = getCompany(q.companyId)
        const pct = Math.min(100, Math.round((q.usedThisMonth / q.monthlyLimit) * 100))
        const barColor = pct >= 90 ? '#fb3748' : pct >= 70 ? '#fa7319' : '#1fc16b'
        return (
          <div key={q.companyId} className="border border-neutral-100 rounded-lg p-4 bg-neutral-50/50">
            <p className="text-sm font-semibold text-neutral-800 mb-2">{co ? co.name : 'Bilinmiyor'}</p>
            <p className="text-xs text-neutral-400 mb-2">
              {q.usedThisMonth.toLocaleString('tr-TR')} / {q.monthlyLimit.toLocaleString('tr-TR')} gönderi
            </p>
            <div className="h-2 rounded-full bg-neutral-200 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: barColor }} />
            </div>
            <p className="text-xs text-neutral-400 mt-1.5">
              Kalan kota:{' '}
              <span className="font-semibold text-neutral-700">
                {Math.max(0, q.monthlyLimit - q.usedThisMonth).toLocaleString('tr-TR')}
              </span>
            </p>
          </div>
        )
      })}
    </div>
  )
}

// Each band picks its own type independently: `value` is a flat price for 'fixed', or a
// unit price (₺/desi) for 'perDesi' — so one rule can mix both across its desi range. There
// is no rule-wide minimum; each band carries its own `minimumAmount`.
type TierRow = { minDesi: string; maxDesi: string; type: PricingTierType; value: string; minimumAmount: string }

function emptyTier(): TierRow {
  return { minDesi: '', maxDesi: '', type: 'fixed', value: '', minimumAmount: '0' }
}

function quotaForCompany(companyId: number): string {
  const quota = useDataStore.getState().carrierQuotas.find((q) => q.companyId === companyId)
  return quota ? String(quota.monthlyLimit) : ''
}

function depotLabel(nodes: { id: number; name: string }[], originNodeId: number | null): string {
  if (originNodeId == null) return 'Tüm Depolar'
  return nodes.find((n) => n.id === originNodeId)?.name ?? 'Bilinmeyen Depo'
}

function ruleSummary(rule: CarrierPricingRule): string {
  if (!rule.tiers?.length) return 'Aralık tanımlı değil'
  const fixedCount = rule.tiers.filter((t) => t.type === 'fixed').length
  const perDesiCount = rule.tiers.filter((t) => t.type === 'perDesi').length
  const parts: string[] = []
  if (fixedCount) parts.push(`${fixedCount} sabit`)
  if (perDesiCount) parts.push(`${perDesiCount} desi başı`)
  return `${rule.tiers.length} aralık (${parts.join(', ')})`
}

const WIZARD_STEPS = [
  { label: 'Kargo Firması & Kota', desc: 'Firma seçin, aylık gönderi limitini belirleyin' },
  { label: 'Fiyatlandırma Kuralları', desc: 'Depo bazlı, aralık veya birim fiyat kuralları tanımlayın' },
  { label: 'Örnek Hesaplama', desc: 'Bir kural seçip desi değeriyle sonucu test edin' },
] as const

const TIER_FIXED_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
  </svg>
)
const TIER_PERDESI_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

function PricingQuotaWizardPanel() {
  const nodes = useDataStore((s) => s.nodes)
  const carrierPricing = useDataStore((s) => s.carrierPricing)
  const carrierQuotas = useDataStore((s) => s.carrierQuotas)
  const upsertPricing = useDataStore((s) => s.upsertPricing)
  const removePricing = useDataStore((s) => s.removePricing)
  const updateQuota = useDataStore((s) => s.updateQuota)

  const [view, setView] = useState<'list' | 'wizard'>('list')
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [companyId, setCompanyId] = useState<number>(COMPANIES[0].id)
  const [monthlyLimit, setMonthlyLimit] = useState(() => quotaForCompany(COMPANIES[0].id))
  const [quotaError, setQuotaError] = useState('')

  const [editingRuleId, setEditingRuleId] = useState<number | 'new' | null>(null)
  const [formOriginNodeId, setFormOriginNodeId] = useState<number | null>(null)
  const [formTiers, setFormTiers] = useState<TierRow[]>([emptyTier()])
  const [formError, setFormError] = useState('')

  const [testRuleId, setTestRuleId] = useState<number | null>(null)
  const [sampleDesi, setSampleDesi] = useState('')

  const rules = carrierPricing.filter((r) => r.companyId === companyId)
  const testRule = rules.find((r) => r.id === testRuleId) ?? null
  const preview = testRule && sampleDesi.trim() !== '' ? calculateCarrierPrice(testRule, +sampleDesi) : null

  function selectCompany(id: number) {
    setCompanyId(id)
    setMonthlyLimit(quotaForCompany(id))
    setQuotaError('')
    setEditingRuleId(null)
    setTestRuleId(null)
    setSampleDesi('')
  }

  function openNewRuleForm() {
    setEditingRuleId('new')
    setFormOriginNodeId(null)
    setFormTiers([emptyTier()])
    setFormError('')
  }

  function openEditRuleForm(rule: CarrierPricingRule) {
    setEditingRuleId(rule.id)
    setFormOriginNodeId(rule.originNodeId)
    const rows = rule.tiers.map((t) => ({
      minDesi: String(t.minDesi),
      maxDesi: String(t.maxDesi),
      type: t.type,
      value: String(t.price),
      minimumAmount: String(t.minimumAmount),
    }))
    setFormTiers(rows.length ? rows : [emptyTier()])
    setFormError('')
  }

  function closeRuleForm() {
    setEditingRuleId(null)
    setFormError('')
  }

  function updateFormTier(index: number, patch: Partial<TierRow>) {
    setFormTiers((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)))
  }

  function addFormTier() {
    setFormTiers((rows) => [...rows, emptyTier()])
  }

  function removeFormTier(index: number) {
    setFormTiers((rows) => rows.filter((_, i) => i !== index))
  }

  function saveRule() {
    const incomplete = formTiers.some((r) => r.minDesi === '' || r.maxDesi === '' || r.value === '')
    if (incomplete) {
      setFormError('Tüm desi aralıkları için değerleri doldurun veya boş satırı silin.')
      return
    }
    const duplicate = rules.find((r) => r.originNodeId === formOriginNodeId && r.id !== editingRuleId)
    if (duplicate) {
      setFormError(`${depotLabel(nodes, formOriginNodeId)} için zaten bir kural tanımlı. Önce onu düzenleyin veya silin.`)
      return
    }
    upsertPricing({
      id: editingRuleId === 'new' ? null : editingRuleId,
      companyId,
      originNodeId: formOriginNodeId,
      tiers: formTiers.map((t) => ({
        minDesi: +t.minDesi,
        maxDesi: +t.maxDesi,
        type: t.type,
        price: +t.value,
        minimumAmount: t.minimumAmount === '' ? 0 : +t.minimumAmount,
      })),
    })
    toast('Fiyatlandırma kuralı kaydedildi.', 'success')
    closeRuleForm()
  }

  function deleteRule(id: number) {
    removePricing(id)
    toast('Fiyatlandırma kuralı silindi.', 'info')
    if (testRuleId === id) setTestRuleId(null)
  }

  function goStep1to2() {
    if (monthlyLimit.trim() !== '') {
      if (+monthlyLimit <= 0) {
        setQuotaError('Geçerli bir aylık gönderi limiti girin.')
        return
      }
      updateQuota(companyId, +monthlyLimit)
      toast('Kota güncellendi.', 'success')
    }
    setQuotaError('')
    setStep(2)
  }

  function goStep2to3() {
    closeRuleForm()
    setStep(3)
    if (testRuleId == null && rules.length) setTestRuleId(rules[0].id)
  }

  function prevStep() {
    setStep((s) => (s === 3 ? 2 : 1))
  }

  function backToList() {
    closeRuleForm()
    setView('list')
  }

  function finishWizard() {
    toast(`${getCompany(companyId)?.name} için fiyatlandırma/kota ayarları kaydedildi.`, 'success')
    backToList()
  }

  function openCreateNew() {
    selectCompany(COMPANIES[0].id)
    setStep(1)
    setView('wizard')
  }

  function openEditCompany(id: number) {
    selectCompany(id)
    setStep(2)
    setView('wizard')
  }

  function deleteCompanySetup(id: number) {
    carrierPricing.filter((r) => r.companyId === id).forEach((r) => removePricing(r.id))
    toast(`${getCompany(id)?.name} için tüm fiyatlandırma kuralları silindi.`, 'info')
  }

  if (view === 'list') {
    const configuredIds = Array.from(new Set([...carrierQuotas.map((q) => q.companyId), ...carrierPricing.map((r) => r.companyId)])).sort(
      (a, b) => a - b,
    )
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-neutral-500">{configuredIds.length} kargo firması için fiyatlandırma/kota tanımlı</p>
          <button className="primary-btn" type="button" onClick={openCreateNew}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Kural Ekle
          </button>
        </div>
        {configuredIds.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 text-sm">Henüz fiyatlandırma/kota tanımlanmadı.</div>
        ) : (
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Aylık Kota</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Fiyatlandırma Kuralı</th>
                  <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {configuredIds.map((id) => {
                  const co = getCompany(id)
                  const quota = carrierQuotas.find((q) => q.companyId === id)
                  const ruleCount = carrierPricing.filter((r) => r.companyId === id).length
                  return (
                    <tr key={id} className="hover:bg-neutral-50/80">
                      <td className="px-4 py-3 font-medium text-neutral-700">{co ? co.name : 'Bilinmiyor'}</td>
                      <td className="px-4 py-3 text-neutral-500">{quota ? `${quota.monthlyLimit.toLocaleString('tr-TR')} gönderi` : 'Tanımsız'}</td>
                      <td className="px-4 py-3 text-neutral-500">{ruleCount > 0 ? `${ruleCount} kural` : 'Tanımsız'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                            type="button"
                            title="Düzenle"
                            onClick={() => openEditCompany(id)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                              />
                            </svg>
                          </button>
                          <button
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
                            type="button"
                            title="Fiyatlandırma Kurallarını Sil"
                            onClick={() => deleteCompanySetup(id)}
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79a48.437 48.437 0 00-7.227-.437 48.55 48.55 0 00-7.228.437m14.456 0a48.61 48.61 0 013.334.416m-3.334-.416L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.058.68-.113 1.02-.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <button type="button" className="secondary-btn py-1.5 px-3 text-xs mb-4" onClick={backToList}>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Fiyatlandırma Listesine Dön
      </button>
      <div className="flex" style={{ minHeight: 460 }}>
      <div className="w-56 flex-shrink-0 border-r border-neutral-100 pr-6 mr-6">
        {WIZARD_STEPS.map((s, i) => {
          const n = i + 1
          const st = n < step ? 'done' : n === step ? 'active' : 'pending'
          const isLast = i === WIZARD_STEPS.length - 1
          return (
            <div key={s.label} className="flex gap-3.5">
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`step-circle ${st}`}>
                  {st === 'done' ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    n
                  )}
                </div>
                {!isLast ? (
                  <div className={`w-px flex-1 my-2 ${st === 'done' ? 'bg-primary-light' : 'bg-neutral-200'}`} style={{ minHeight: 36 }} />
                ) : null}
              </div>
              <div className={isLast ? 'pt-1' : 'pb-8 pt-1'}>
                <p className={`text-sm font-semibold leading-snug ${st === 'pending' ? 'text-neutral-400' : st === 'active' ? 'text-primary-dark' : 'text-neutral-950'}`}>
                  {s.label}
                </p>
                <p className={`text-xs mt-0.5 leading-relaxed ${st === 'pending' ? 'text-neutral-300' : 'text-neutral-400'}`}>{s.desc}</p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        <div className="flex-1">
          {step === 1 ? (
            <div className="max-w-sm">
              <div className="mb-5">
                <label className="form-label">Kargo Firması</label>
                <Dropdown
                  value={String(companyId)}
                  onChange={(v) => selectCompany(+v)}
                  options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
                />
              </div>
              <div>
                <label className="form-label">
                  Aylık Gönderi Limiti (Kota){' '}
                  <span className="font-normal normal-case text-neutral-400">(isteğe bağlı)</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`form-input ${quotaError ? 'error' : ''}`}
                  value={monthlyLimit}
                  onChange={(e) => {
                    setMonthlyLimit(e.target.value)
                    setQuotaError('')
                  }}
                />
                {quotaError ? <p className="form-error">{quotaError}</p> : null}
              </div>
            </div>
          ) : step === 2 ? (
            <div>
              {editingRuleId === null ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-neutral-800">{getCompany(companyId)?.name} için Fiyatlandırma Kuralları</p>
                    <button type="button" className="secondary-btn py-1.5 px-3 text-xs" onClick={openNewRuleForm}>
                      + Yeni Kural Ekle
                    </button>
                  </div>
                  {rules.length === 0 ? (
                    <p className="text-sm text-neutral-400 py-10 text-center">Henüz fiyatlandırma kuralı tanımlanmadı.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {rules.map((rule) => (
                        <div key={rule.id} className="flex items-center justify-between border border-neutral-200 rounded-lg px-4 py-3">
                          <div>
                            <p className="text-sm font-semibold text-neutral-800">{depotLabel(nodes, rule.originNodeId)}</p>
                            <p className="text-xs text-neutral-400 mt-0.5">{ruleSummary(rule)}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                              type="button"
                              title="Düzenle"
                              onClick={() => openEditRuleForm(rule)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                                />
                              </svg>
                            </button>
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
                              type="button"
                              title="Sil"
                              onClick={() => deleteRule(rule.id)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79a48.437 48.437 0 00-7.227-.437 48.55 48.55 0 00-7.228.437m14.456 0a48.61 48.61 0 013.334.416m-3.334-.416L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.058.68-.113 1.02-.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-neutral-800 mb-4">
                    {editingRuleId === 'new' ? 'Yeni Fiyatlandırma Kuralı' : 'Kuralı Düzenle'}
                  </p>

                  <div className="mb-5 max-w-sm">
                    <label className="form-label">Çıkış Deposu</label>
                    <Dropdown
                      value={formOriginNodeId == null ? 'all' : String(formOriginNodeId)}
                      onChange={(v) => setFormOriginNodeId(v === 'all' ? null : +v)}
                      options={[{ value: 'all', label: 'Tüm Depolar (Varsayılan)' }, ...nodes.map((n) => ({ value: String(n.id), label: n.name }))]}
                    />
                    <p className="text-xs text-neutral-400 mt-1.5">
                      Bu kriter, kuralın hangi çıkış deposundan yapılan gönderilere uygulanacağını belirler — aynı firma için farklı depolara farklı kurallar tanımlayabilirsiniz.
                    </p>
                  </div>

                  <div className="mb-5">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-semibold text-neutral-800">Desi Aralıkları</p>
                      <button type="button" className="secondary-btn py-1.5 px-3 text-xs" onClick={addFormTier}>
                        + Aralık Ekle
                      </button>
                    </div>
                    <p className="text-xs text-neutral-400 mb-3">
                      Her aralık için sabit bir fiyat ya da desi başına birim fiyat tanımlayabilirsiniz — aynı kural içinde farklı aralıklar farklı
                      fiyatlandırma türü kullanabilir (ör. 0-14 desi ₺100 sabit, 14.1-40 desi ₺120 sabit, 40.1-100 desi ₺11/desi). Genel bir minimum
                      tutar yoktur — her aralığın kendi minimum tutarı vardır: hesaplanan tutar o aralığın minimumunun altında kalırsa minimum ödenir.
                    </p>
                    <div className="flex flex-col gap-3">
                      {formTiers.map((row, i) => (
                        <div key={i} className="border border-neutral-200 rounded-lg p-3 bg-neutral-50/40">
                          <div className="flex items-center justify-between mb-3">
                            <SegmentedToggle
                              value={row.type}
                              onChange={(v) => updateFormTier(i, { type: v })}
                              options={[
                                { value: 'fixed', label: 'Sabit Fiyat', icon: TIER_FIXED_ICON },
                                { value: 'perDesi', label: 'Desi Başı', icon: TIER_PERDESI_ICON },
                              ]}
                            />
                            <button
                              type="button"
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
                              title="Aralığı Kaldır"
                              onClick={() => removeFormTier(i)}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          <div className="grid gap-3" style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr' }}>
                            <div>
                              <label className="form-label">Min. Desi</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="form-input"
                                value={row.minDesi}
                                onChange={(e) => updateFormTier(i, { minDesi: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label">Maks. Desi</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="form-input"
                                value={row.maxDesi}
                                onChange={(e) => updateFormTier(i, { maxDesi: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label">{row.type === 'perDesi' ? 'Birim Fiyat (₺/desi)' : 'Sabit Fiyat (₺)'}</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="form-input"
                                value={row.value}
                                onChange={(e) => updateFormTier(i, { value: e.target.value })}
                              />
                            </div>
                            <div>
                              <label className="form-label">Minimum Tutar (₺)</label>
                              <input
                                type="text"
                                inputMode="numeric"
                                className="form-input"
                                value={row.minimumAmount}
                                onChange={(e) => updateFormTier(i, { minimumAmount: e.target.value })}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {formError ? <p className="form-error mb-3">{formError}</p> : null}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm font-semibold text-neutral-800 mb-1">Örnek Hesaplama</p>
              <p className="text-xs text-neutral-400 mb-4">{getCompany(companyId)?.name}</p>

              {rules.length === 0 ? (
                <p className="text-sm text-neutral-400">Test edebilmek için önce bir fiyatlandırma kuralı ekleyin.</p>
              ) : (
                <>
                  <div className="max-w-sm mb-4">
                    <label className="form-label">Kural</label>
                    <Dropdown
                      value={testRuleId != null ? String(testRuleId) : ''}
                      onChange={(v) => setTestRuleId(+v)}
                      options={rules.map((r) => ({ value: String(r.id), label: `${depotLabel(nodes, r.originNodeId)} — ${ruleSummary(r)}` }))}
                    />
                  </div>
                  <div className="max-w-xs mb-5">
                    <label className="form-label">Desi</label>
                    <input type="text" inputMode="numeric" className="form-input" value={sampleDesi} onChange={(e) => setSampleDesi(e.target.value)} placeholder="Örn. 42" />
                  </div>

                  {preview ? (
                    <div className="border border-neutral-200 rounded-lg overflow-hidden max-w-xl">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left border-b border-neutral-100 bg-neutral-50">
                            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Hesaplama</th>
                            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Hesaplanan Meblağ</th>
                            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Min. Tutar Karşılaştırması</th>
                            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Final Kargo Maliyeti</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="px-4 py-3 text-neutral-500">{preview.formula}</td>
                            <td className="px-4 py-3 text-neutral-700">
                              {preview.calculatedAmount != null ? `₺${preview.calculatedAmount.toLocaleString('tr-TR')}` : '-'}
                            </td>
                            <td className="px-4 py-3 text-neutral-500 text-xs">
                              {preview.calculatedAmount != null
                                ? `₺${Math.max(preview.calculatedAmount, preview.minimumAmount).toLocaleString('tr-TR')} > ₺${Math.min(preview.calculatedAmount, preview.minimumAmount).toLocaleString('tr-TR')}`
                                : '-'}
                            </td>
                            <td className="px-4 py-3 font-semibold text-neutral-950">
                              {preview.finalAmount != null ? `₺${preview.finalAmount.toLocaleString('tr-TR')}` : 'Bu desi için tanımlı aralık yok'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-400">Sonucu görmek için bir desi değeri girin.</p>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100">
          <div>
            {step === 2 && editingRuleId !== null ? (
              <button className="secondary-btn" type="button" onClick={closeRuleForm}>
                Vazgeç
              </button>
            ) : step > 1 ? (
              <button className="secondary-btn" type="button" onClick={prevStep}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Geri
              </button>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            {step === 2 && editingRuleId !== null ? null : <span className="text-sm text-neutral-400">Adım {step}/3</span>}
            {step === 2 && editingRuleId !== null ? (
              <button className="primary-btn" type="button" onClick={saveRule}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Kaydet
              </button>
            ) : step === 1 ? (
              <button className="primary-btn" type="button" onClick={goStep1to2}>
                İleri
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : step === 2 ? (
              <button className="primary-btn" type="button" onClick={goStep2to3}>
                İleri
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            ) : (
              <button className="primary-btn" type="button" onClick={finishWizard}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Kaydet
              </button>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export function FinancePage() {
  const { tab } = useParams<{ tab: string }>()
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)

  function handleExportInvoicesCsv() {
    if (!exportInvoicesCsv(carrierInvoices)) {
      toast('Dışa aktarılacak fatura kaydı bulunamadı.', 'info')
      return
    }
    toast(`${carrierInvoices.length} fatura CSV olarak indirildi.`, 'success')
  }

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-100">
          <div className="flex items-center gap-1.5">
            {TABS.map((tb) => (
              <NavLink
                key={tb.key}
                to={tb.to}
                className={({ isActive }) => `filter-tab ${isActive || tab === tb.key ? 'active' : ''}`}
              >
                {tb.label}
              </NavLink>
            ))}
          </div>
          {tab === 'invoices' ? (
            <button className="secondary-btn" type="button" onClick={handleExportInvoicesCsv}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
              </svg>
              CSV Olarak İndir
            </button>
          ) : null}
        </div>
        <div className="p-5">
          {tab === 'setup' ? <PricingQuotaWizardPanel /> : tab === 'invoices' ? <InvoicePanel /> : <QuotaPanel />}
        </div>
      </div>
    </div>
  )
}
