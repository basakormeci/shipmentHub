import { useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import {
  COMPANIES,
  PROVINCES,
  getCompany,
  type RoutingRule,
} from '../../data/catalog'
import { computeCarrierPerformance } from '../PerformancePage'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'

const TABS = [
  { key: 'rules', label: 'Kurallar', to: '/routing/rules' },
  { key: 'weights', label: 'Ağırlık Verme', to: '/routing/weights' },
  { key: 'scoring', label: 'Normalize Puanlama', to: '/routing/scoring' },
  { key: 'history', label: 'Kural Geçmişi', to: '/routing/history' },
] as const

const RULE_HISTORY_ACTION_META: Record<string, { label: string; badge: string }> = {
  created: { label: 'Oluşturuldu', badge: 'badge-active' },
  updated: { label: 'Güncellendi', badge: 'badge-info' },
  deleted: { label: 'Silindi', badge: 'badge-danger' },
  toggled: { label: 'Durum Değişti', badge: 'badge-warning' },
  reordered: { label: 'Öncelik Değişti', badge: 'badge-passive' },
}

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

function ruleConditionsSummary(cond: RoutingRule['conditions']) {
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

function matchRoutingRule(rules: RoutingRule[], desi: number, provinceId: number, amount: number) {
  const sorted = [...rules].filter((r) => r.active).sort((a, b) => a.priority - b.priority)
  for (const rule of sorted) {
    const c = rule.conditions
    if (desi < c.minDesi || desi > c.maxDesi) continue
    if (c.provinceIds.length > 0 && !c.provinceIds.includes(provinceId)) continue
    if (c.minAmount !== '' && amount < +c.minAmount) continue
    if (c.maxAmount !== '' && amount > +c.maxAmount) continue
    return rule
  }
  return null
}

function computeNormalizedCarrierScores(
  weights: { cost: number; deliveryTime: number; successRate: number },
  shipments: Parameters<typeof computeCarrierPerformance>[0],
  carrierInvoices: Parameters<typeof computeCarrierPerformance>[1],
  carrierPricing: { companyId: number; price: number }[],
) {
  const total = weights.cost + weights.deliveryTime + weights.successRate || 1
  const wCost = weights.cost / total
  const wDelivery = weights.deliveryTime / total
  const wSuccess = weights.successRate / total

  const perf = computeCarrierPerformance(shipments, carrierInvoices)
  const perfMap: Record<number, (typeof perf)[0]> = {}
  perf.forEach((p) => {
    perfMap[p.companyId] = p
  })

  const pricingByCompany: Record<number, number[]> = {}
  carrierPricing.forEach((p) => {
    if (!pricingByCompany[p.companyId]) pricingByCompany[p.companyId] = []
    pricingByCompany[p.companyId].push(p.price)
  })

  const avgPriceFor = (companyId: number) => {
    const prices = pricingByCompany[companyId]
    return prices?.length ? prices.reduce((a, b) => a + b, 0) / prices.length : null
  }

  const allAvgPrices = COMPANIES.map((c) => avgPriceFor(c.id)).filter((p): p is number => p !== null)
  const minPrice = allAvgPrices.length ? Math.min(...allAvgPrices) : 0
  const maxPrice = allAvgPrices.length ? Math.max(...allAvgPrices) : 0

  return COMPANIES.map((c) => {
    const p = perfMap[c.id]
    const avgPrice = avgPriceFor(c.id)
    const costScore = avgPrice === null ? 0.5 : maxPrice > minPrice ? 1 - (avgPrice - minPrice) / (maxPrice - minPrice) : 1
    const deliveryScore = p ? p.otdRate : 0.5
    const successScore = p ? p.successRate : 0.5
    const combined = wCost * costScore + wDelivery * deliveryScore + wSuccess * successScore
    return { companyId: c.id, companyName: c.name, costScore, deliveryScore, successScore, combined }
  }).sort((a, b) => b.combined - a.combined)
}

function RoutingRuleModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const routingRules = useDataStore((s) => s.routingRules)
  const upsertRoutingRule = useDataStore((s) => s.upsertRoutingRule)
  const logRoutingHistory = useDataStore((s) => s.logRoutingHistory)
  const existing = editId != null ? routingRules.find((r) => r.id === editId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [minDesi, setMinDesi] = useState(existing ? String(existing.conditions.minDesi) : '0')
  const [maxDesi, setMaxDesi] = useState(existing ? String(existing.conditions.maxDesi) : '999')
  const [minAmount, setMinAmount] = useState(existing ? String(existing.conditions.minAmount) : '')
  const [maxAmount, setMaxAmount] = useState(existing ? String(existing.conditions.maxAmount) : '')
  const [provinceIds, setProvinceIds] = useState<number[]>(existing?.conditions.provinceIds ?? [])
  const [primaryCompanyId, setPrimaryCompanyId] = useState(existing?.primaryCompanyId ?? COMPANIES[0].id)
  const [failoverCompanyId, setFailoverCompanyId] = useState<number | ''>(existing?.failoverCompanyId ?? '')
  const [active, setActive] = useState(existing?.active ?? true)

  if (!open) return null

  const canSave = name.trim() && primaryCompanyId

  function toggleProvince(id: number) {
    setProvinceIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  function save() {
    if (!canSave) return
    const conditions = {
      minDesi: +minDesi,
      maxDesi: +maxDesi,
      provinceIds,
      minAmount: minAmount === '' ? ('' as const) : +minAmount,
      maxAmount: maxAmount === '' ? ('' as const) : +maxAmount,
    }
    const rule = upsertRoutingRule({
      id: editId,
      name: name.trim(),
      priority: existing?.priority ?? routingRules.length + 1,
      active,
      conditions,
      primaryCompanyId,
      failoverCompanyId: failoverCompanyId === '' ? null : failoverCompanyId,
    })
    logRoutingHistory(editId ? 'updated' : 'created', rule.name, editId ? 'Kural güncellendi.' : 'Kural oluşturuldu.')
    toast(editId ? 'Kural güncellendi.' : 'Yeni kural oluşturuldu.', 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-xl flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <h3 className="font-semibold text-neutral-950">{editId ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}</h3>
          <button type="button" className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="form-label">
              Kural Adı <span className="text-[#fb3748]">*</span>
            </label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Koşullar</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="form-label">Min Desi</label>
                <input type="text" inputMode="numeric" className="form-input" value={minDesi} onChange={(e) => setMinDesi(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Max Desi</label>
                <input type="text" inputMode="numeric" className="form-input" value={maxDesi} onChange={(e) => setMaxDesi(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Min Sipariş Tutarı</label>
                <input type="text" inputMode="numeric" className="form-input" placeholder="Kısıt yok" value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
              </div>
              <div>
                <label className="form-label">Max Sipariş Tutarı</label>
                <input type="text" inputMode="numeric" className="form-input" placeholder="Kısıt yok" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
              </div>
            </div>
            <label className="form-label">
              Bölgeler <span className="font-normal normal-case text-neutral-400">(boş bırakılırsa tüm iller)</span>
            </label>
            <div className="district-grid border border-neutral-200 rounded-lg p-3 max-h-40 overflow-y-auto">
              {PROVINCES.map((p) => (
                <label key={p.id} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input type="checkbox" checked={provinceIds.includes(p.id)} onChange={() => toggleProvince(p.id)} />
                  <span className="text-sm text-neutral-700">{p.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Taşıyıcı Atama</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Birincil Kargo Firması <span className="text-[#fb3748]">*</span>
                </label>
                <select className="form-input" value={primaryCompanyId} onChange={(e) => setPrimaryCompanyId(+e.target.value)}>
                  {COMPANIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="form-label">Yedek Kargo Firması (Failover)</label>
                <select
                  className="form-input"
                  value={failoverCompanyId}
                  onChange={(e) => setFailoverCompanyId(e.target.value === '' ? '' : +e.target.value)}
                >
                  <option value="">Yok</option>
                  {COMPANIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
            <div>
              <p className="text-sm font-medium text-neutral-950">Kural Aktif</p>
              <p className="text-xs text-neutral-400 mt-0.5">Pasif kurallar yönlendirmede dikkate alınmaz</p>
            </div>
            <button type="button" className={`toggle-track ${active ? 'on' : 'off'}`} onClick={() => setActive(!active)}>
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
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

function RulesTab() {
  const routingRules = useDataStore((s) => s.routingRules)
  const toggleRoutingRule = useDataStore((s) => s.toggleRoutingRule)
  const removeRoutingRule = useDataStore((s) => s.removeRoutingRule)
  const moveRoutingPriority = useDataStore((s) => s.moveRoutingPriority)
  const logRoutingHistory = useDataStore((s) => s.logRoutingHistory)
  const simulator = useUiStore((s) => s.routingSimulator)
  const setRoutingSimulator = useUiStore((s) => s.setRoutingSimulator)

  const [createOpen, setCreateOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)

  const sorted = useMemo(() => [...routingRules].sort((a, b) => a.priority - b.priority), [routingRules])

  function runSimulation() {
    if (simulator.desi === '' || !simulator.provinceId) {
      toast('Simülasyon için desi ve il bilgisi gereklidir.', 'info')
      return
    }
    const result = matchRoutingRule(
      routingRules,
      +simulator.desi,
      +simulator.provinceId,
      simulator.amount === '' ? 0 : +simulator.amount,
    )
    setRoutingSimulator({ resultId: result ? result.id : false })
  }

  const simResult =
    simulator.resultId === null
      ? null
      : simulator.resultId === false
        ? false
        : routingRules.find((r) => r.id === simulator.resultId) ?? false

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">{routingRules.length} kural tanımlı</p>
        <button className="primary-btn" type="button" onClick={() => setCreateOpen(true)}>
          Yeni Kural Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-5 mb-6">
        <p className="text-sm font-semibold text-neutral-950 mb-1">Yönlendirme Simülatörü</p>
        <p className="text-xs text-neutral-400 mb-4">
          Örnek bir gönderi girin, hangi kuralın eşleşip hangi taşıyıcının seçileceğini görün.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="form-label">Desi</label>
            <input
              type="text"
              inputMode="numeric"
              className="form-input"
              placeholder="Örn. 15"
              value={simulator.desi}
              onChange={(e) => setRoutingSimulator({ desi: e.target.value, resultId: null })}
            />
          </div>
          <div>
            <label className="form-label">İl</label>
            <select
              className="form-input"
              value={simulator.provinceId}
              onChange={(e) => setRoutingSimulator({ provinceId: e.target.value, resultId: null })}
            >
              <option value="">İl seçin...</option>
              {PROVINCES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Sipariş Tutarı</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
              <input
                type="text"
                inputMode="numeric"
                className="form-input pl-7"
                placeholder="Örn. 500"
                value={simulator.amount}
                onChange={(e) => setRoutingSimulator({ amount: e.target.value, resultId: null })}
              />
            </div>
          </div>
          <button className="primary-btn" type="button" onClick={runSimulation}>
            Simüle Et
          </button>
        </div>
        {simResult !== null ? (
          <div
            className={`mt-4 p-4 rounded-lg ${simResult ? 'bg-[#e3f7ec] border border-[#84ebb4]' : 'bg-[#ffebec] border border-[#ffc0c5]'}`}
          >
            {simResult ? (
              <>
                <p className="text-sm font-semibold" style={{ color: '#0b4627' }}>
                  Eşleşen kural: &quot;{simResult.name}&quot; (Öncelik {simResult.priority})
                </p>
                <p className="text-xs mt-1" style={{ color: '#0b4627' }}>
                  Birincil taşıyıcı: <strong>{getCompany(simResult.primaryCompanyId)?.name}</strong>
                  {simResult.failoverCompanyId ? (
                    <>
                      {' '}
                      · Yedek: <strong>{getCompany(simResult.failoverCompanyId)?.name}</strong>
                    </>
                  ) : null}
                </p>
              </>
            ) : (
              <p className="text-sm font-semibold" style={{ color: '#681219' }}>
                Bu koşullarla eşleşen aktif bir kural bulunamadı.
              </p>
            )}
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100">
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Öncelik</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kural Adı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Koşullar</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Birincil Taşıyıcı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Yedek Taşıyıcı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((rule, i) => {
              const primary = getCompany(rule.primaryCompanyId)
              const failover = rule.failoverCompanyId ? getCompany(rule.failoverCompanyId) : null
              const even = i % 2 === 0
              return (
                <tr key={rule.id} className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold flex items-center justify-center flex-shrink-0">
                        {rule.priority}
                      </span>
                      <div className="flex flex-col">
                        <button
                          type="button"
                          className="text-neutral-300 hover:text-primary disabled:opacity-20 leading-none"
                          disabled={i === 0}
                          onClick={() => {
                            moveRoutingPriority(rule.id, -1)
                            logRoutingHistory('reordered', rule.name, 'Öncelik sırası değiştirildi.')
                          }}
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          className="text-neutral-300 hover:text-primary disabled:opacity-20 leading-none"
                          disabled={i === sorted.length - 1}
                          onClick={() => {
                            moveRoutingPriority(rule.id, 1)
                            logRoutingHistory('reordered', rule.name, 'Öncelik sırası değiştirildi.')
                          }}
                        >
                          ▼
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-neutral-700">{rule.name}</td>
                  <td className="px-5 py-3.5 text-neutral-500 text-xs">{ruleConditionsSummary(rule.conditions)}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{primary ? primary.name : 'Bilinmiyor'}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{failover ? failover.name : '-'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${rule.active ? 'badge-active' : 'badge-passive'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rule.active ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
                      {rule.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 justify-end">
                      <button className="action-btn btn-edit" type="button" onClick={() => setEditId(rule.id)}>
                        Düzenle
                      </button>
                      <button
                        className={`action-btn ${rule.active ? 'btn-passive' : 'btn-toggle'}`}
                        type="button"
                        onClick={() => {
                          toggleRoutingRule(rule.id)
                          logRoutingHistory('toggled', rule.name, rule.active ? 'Kural pasife alındı.' : 'Kural aktif edildi.')
                          toast(`"${rule.name}" ${rule.active ? 'pasife alındı' : 'aktif edildi'}.`, 'info')
                        }}
                      >
                        {rule.active ? 'Pasife Al' : 'Aktife Al'}
                      </button>
                      <button
                        className="action-btn btn-delete"
                        type="button"
                        onClick={() => {
                          removeRoutingRule(rule.id)
                          logRoutingHistory('deleted', rule.name, 'Kural silindi.')
                          toast(`"${rule.name}" silindi.`, 'info')
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

      {createOpen ? <RoutingRuleModal open editId={null} onClose={() => setCreateOpen(false)} /> : null}
      {editId != null ? <RoutingRuleModal open editId={editId} onClose={() => setEditId(null)} /> : null}
    </>
  )
}

function WeightsTab() {
  const weights = useUiStore((s) => s.routingWeights)
  const setRoutingWeights = useUiStore((s) => s.setRoutingWeights)

  const total = weights.cost + weights.deliveryTime + weights.successRate || 1
  const norm = {
    cost: Math.round((weights.cost / total) * 100),
    deliveryTime: Math.round((weights.deliveryTime / total) * 100),
    successRate: Math.round((weights.successRate / total) * 100),
  }

  const weightFields = [
    { key: 'cost' as const, label: 'Maliyet' },
    { key: 'deliveryTime' as const, label: 'Teslimat Süresi (OTD)' },
    { key: 'successRate' as const, label: 'Başarı Oranı' },
  ]

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5">
      <p className="text-sm font-semibold text-neutral-950 mb-1">Kriter Ağırlıkları</p>
      <p className="text-xs text-neutral-400 mb-5">
        Taşıyıcı seçim motorunun her kriteri ne kadar önemseyeceğini ayarlayın. Ağırlıklar otomatik olarak %100&apos;e
        normalize edilir.
      </p>
      <div className="flex flex-col gap-5">
        {weightFields.map((wf) => (
          <div key={wf.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-neutral-700">{wf.label}</span>
              <span className="text-sm font-semibold text-primary">%{norm[wf.key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights[wf.key]}
              className="w-full"
              onChange={(e) => setRoutingWeights({ [wf.key]: +e.target.value })}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-400 mt-5">
        Normalize edilmiş ağırlıklar, &quot;Normalize Puanlama&quot; sekmesindeki taşıyıcı skorlarını doğrudan etkiler.
      </p>
    </div>
  )
}

function ScoringTab() {
  const weights = useUiStore((s) => s.routingWeights)
  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const carrierPricing = useDataStore((s) => s.carrierPricing)

  const scores = useMemo(
    () => computeNormalizedCarrierScores(weights, shipments, carrierInvoices, carrierPricing),
    [weights, shipments, carrierInvoices, carrierPricing],
  )
  const maxScore = Math.max(0.01, ...scores.map((s) => s.combined))

  const total = weights.cost + weights.deliveryTime + weights.successRate || 1

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-950">Normalize Edilmiş Taşıyıcı Puanları</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Ağırlık Verme sekmesindeki kriterlere göre periyodik olarak hesaplanır. Mevcut ağırlıklar: Maliyet %
          {Math.round((weights.cost / total) * 100)}, OTD %{Math.round((weights.deliveryTime / total) * 100)}, Başarı %
          {Math.round((weights.successRate / total) * 100)}.
        </p>
      </div>
      <div className="p-5 flex flex-col gap-3">
        {scores.map((s, i) => (
          <div key={s.companyId}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-neutral-700 flex items-center gap-2">
                <span
                  className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? 'bg-[#fff3eb] text-[#c2570e]' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {i + 1}
                </span>
                {s.companyName}
              </span>
              <span className="text-sm font-semibold text-neutral-800">{(s.combined * 100).toFixed(1)}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${((s.combined / maxScore) * 100).toFixed(1)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HistoryTab() {
  const routingHistory = useDataStore((s) => s.routingHistory)

  if (routingHistory.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Kayıtlı değişiklik bulunmuyor.</div>
  }

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-neutral-100">
            <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Zaman</th>
            <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kural</th>
            <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">İşlem</th>
            <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Detay</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {routingHistory.map((h) => {
            const meta = RULE_HISTORY_ACTION_META[h.action] ?? { label: h.action, badge: 'badge-passive' }
            return (
              <tr key={h.id} className="hover:bg-neutral-50/80">
                <td className="px-5 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(h.time)}</td>
                <td className="px-5 py-3 font-medium text-neutral-700">{h.ruleName}</td>
                <td className="px-5 py-3">
                  <span className={`badge ${meta.badge}`}>{meta.label}</span>
                </td>
                <td className="px-5 py-3 text-neutral-500">{h.detail}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function RoutingPage() {
  const { tab } = useParams<{ tab: string }>()

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="flex items-center gap-1.5 mb-6">
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

      {tab === 'rules' ? (
        <RulesTab />
      ) : tab === 'weights' ? (
        <WeightsTab />
      ) : tab === 'scoring' ? (
        <ScoringTab />
      ) : (
        <HistoryTab />
      )}
    </div>
  )
}
