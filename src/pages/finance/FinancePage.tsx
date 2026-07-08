import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import {
  COMPANIES,
  getCompany,
  INVOICE_STATUS,
  type CarrierInvoice,
} from '../../data/catalog'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'

const TABS = [
  { key: 'pricing', label: 'Fiyatlandırma', to: '/finance/pricing' },
  { key: 'invoices', label: 'Fatura İşlemleri', to: '/finance/invoices' },
  { key: 'quotas', label: 'Kota Bilgileri', to: '/finance/quotas' },
] as const

function PricingModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const carrierPricing = useDataStore((s) => s.carrierPricing)
  const upsertPricing = useDataStore((s) => s.upsertPricing)
  const existing = editId != null ? carrierPricing.find((p) => p.id === editId) : null

  const [companyId, setCompanyId] = useState(existing?.companyId ?? COMPANIES[0].id)
  const [minDesi, setMinDesi] = useState(existing ? String(existing.minDesi) : '')
  const [maxDesi, setMaxDesi] = useState(existing ? String(existing.maxDesi) : '')
  const [price, setPrice] = useState(existing ? String(existing.price) : '')

  if (!open) return null

  const canSave = companyId && minDesi !== '' && maxDesi !== '' && price !== ''

  function save() {
    if (!canSave) return
    upsertPricing({
      id: editId,
      companyId,
      minDesi: +minDesi,
      maxDesi: +maxDesi,
      price: +price,
    })
    toast(editId ? 'Fiyat kaydı güncellendi.' : 'Yeni fiyat kaydı oluşturuldu.', 'success')
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
        <h3 className="font-semibold text-neutral-950 mb-4">{editId ? 'Fiyat Kaydını Düzenle' : 'Yeni Fiyat Kaydı'}</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label">Kargo Firması</label>
            <select className="form-input" value={companyId} onChange={(e) => setCompanyId(+e.target.value)}>
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Min. Desi</label>
              <input type="text" inputMode="numeric" className="form-input" value={minDesi} onChange={(e) => setMinDesi(e.target.value)} />
            </div>
            <div>
              <label className="form-label">Maks. Desi</label>
              <input type="text" inputMode="numeric" className="form-input" value={maxDesi} onChange={(e) => setMaxDesi(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">Beklenen Ücret (₺)</label>
            <input type="text" inputMode="numeric" className="form-input" value={price} onChange={(e) => setPrice(e.target.value)} />
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
            <select className="form-input" value={companyId} onChange={(e) => setCompanyId(+e.target.value)}>
              {COMPANIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
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
            <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as CarrierInvoice['status'])}>
              {(Object.keys(INVOICE_STATUS) as CarrierInvoice['status'][]).map((k) => (
                <option key={k} value={k}>
                  {INVOICE_STATUS[k].label}
                </option>
              ))}
            </select>
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

function QuotaModal({
  open,
  companyId,
  onClose,
}: {
  open: boolean
  companyId: number | null
  onClose: () => void
}) {
  const carrierQuotas = useDataStore((s) => s.carrierQuotas)
  const updateQuota = useDataStore((s) => s.updateQuota)
  const quota = companyId != null ? carrierQuotas.find((q) => q.companyId === companyId) : null
  const co = companyId != null ? getCompany(companyId) : null

  const [monthlyLimit, setMonthlyLimit] = useState(quota ? String(quota.monthlyLimit) : '')

  if (!open || companyId == null) return null

  const canSave = monthlyLimit !== ''

  function save() {
    if (!canSave) return
    updateQuota(companyId!, +monthlyLimit)
    toast('Kota limiti güncellendi.', 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-sm p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">Kota Limitini Düzenle</h3>
        <p className="text-sm text-neutral-500 mb-4">{co?.name}</p>
        <label className="form-label">Aylık Gönderi Limiti</label>
        <input type="text" inputMode="numeric" className="form-input" value={monthlyLimit} onChange={(e) => setMonthlyLimit(e.target.value)} />
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

function PricingPanel() {
  const carrierPricing = useDataStore((s) => s.carrierPricing)
  const removePricing = useDataStore((s) => s.removePricing)
  const [modalId, setModalId] = useState<number | null | 'new'>(null)

  if (carrierPricing.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Fiyatlandırma kaydı bulunmuyor.</div>
  }

  return (
    <>
      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100 bg-neutral-50">
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Desi Aralığı</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Beklenen Ücret</th>
              <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {carrierPricing.map((p) => {
              const co = getCompany(p.companyId)
              return (
                <tr key={p.id} className="hover:bg-neutral-50/80">
                  <td className="px-4 py-3 font-medium text-neutral-700">{co ? co.name : 'Bilinmiyor'}</td>
                  <td className="px-4 py-3 text-neutral-500">
                    {p.minDesi} – {p.maxDesi} desi
                  </td>
                  <td className="px-4 py-3 text-neutral-800 font-semibold">₺{p.price}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button className="action-btn btn-edit" type="button" onClick={() => setModalId(p.id)}>
                        Düzenle
                      </button>
                      <button
                        className="action-btn btn-delete"
                        type="button"
                        onClick={() => {
                          removePricing(p.id)
                          toast('Fiyat kaydı silindi.', 'info')
                        }}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {modalId != null && modalId !== 'new' ? (
        <PricingModal open editId={modalId} onClose={() => setModalId(null)} />
      ) : null}
    </>
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
                  <td className="px-4 py-3 text-neutral-500">#{inv.shipmentNo}</td>
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
                    <div className="flex items-center gap-1.5 justify-end">
                      <button className="action-btn btn-edit" type="button" onClick={() => setModalId(inv.id)}>
                        Düzenle
                      </button>
                      <button
                        className="action-btn btn-delete"
                        type="button"
                        onClick={() => {
                          removeInvoice(inv.id)
                          toast('Fatura kaydı silindi.', 'info')
                        }}
                      >
                        Sil
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
  const [editCompanyId, setEditCompanyId] = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {carrierQuotas.map((q) => {
          const co = getCompany(q.companyId)
          const pct = Math.min(100, Math.round((q.usedThisMonth / q.monthlyLimit) * 100))
          const barColor = pct >= 90 ? '#fb3748' : pct >= 70 ? '#fa7319' : '#1fc16b'
          return (
            <div key={q.companyId} className="border border-neutral-100 rounded-lg p-4 bg-neutral-50/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-neutral-800">{co ? co.name : 'Bilinmiyor'}</p>
                <button
                  type="button"
                  className="text-neutral-400 hover:text-primary transition-colors"
                  title="Kota Limitini Düzenle"
                  onClick={() => setEditCompanyId(q.companyId)}
                >
                  ✎
                </button>
              </div>
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
      {editCompanyId != null ? (
        <QuotaModal open companyId={editCompanyId} onClose={() => setEditCompanyId(null)} />
      ) : null}
    </>
  )
}

export function FinancePage() {
  const { tab } = useParams<{ tab: string }>()
  const [pricingOpen, setPricingOpen] = useState(false)
  const [invoiceOpen, setInvoiceOpen] = useState(false)

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
          {tab === 'pricing' ? (
            <button className="primary-btn" type="button" onClick={() => setPricingOpen(true)}>
              Yeni Fiyat Kaydı
            </button>
          ) : tab === 'invoices' ? (
            <button className="primary-btn" type="button" onClick={() => setInvoiceOpen(true)}>
              Yeni Fatura Kaydı
            </button>
          ) : null}
        </div>
        <div className="p-5">
          {tab === 'pricing' ? <PricingPanel /> : tab === 'invoices' ? <InvoicePanel /> : <QuotaPanel />}
        </div>
      </div>

      {pricingOpen ? <PricingModal open editId={null} onClose={() => setPricingOpen(false)} /> : null}
      {invoiceOpen ? <InvoiceModal open editId={null} onClose={() => setInvoiceOpen(false)} /> : null}
    </div>
  )
}
