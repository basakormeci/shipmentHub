import { useLayoutEffect, useMemo, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import {
  CARRIER_METRIC_KEYS,
  COMPANIES,
  PROVINCES,
  getCompany,
  type CarrierMetricKey,
  type RoutingCargoType,
} from '../../data/catalog'
import { computeNormalizedCarrierScores, matchRoutingRule, ruleConditionsSummary } from '../../lib/carrierScoring'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { useHeaderSlotStore } from '../../stores/headerSlotStore'
import { Dropdown } from '../../components/ui/Dropdown'

const TABS = [
  { key: 'rules', label: 'Kurallar', to: '/routing/rules' },
  { key: 'weights', label: 'Ağırlık Verme', to: '/routing/weights' },
  { key: 'scoring', label: 'Normalize Puanlama', to: '/routing/scoring' },
  { key: 'history', label: 'Kural Geçmişi', to: '/routing/history' },
] as const

const CARGO_TYPE_META: Record<RoutingCargoType, { label: string; badge: string }> = {
  shipment: { label: 'Sipariş Gönderileri', badge: 'badge-info' },
  transfer: { label: 'Transfer Gönderileri', badge: 'badge-warning' },
  return: { label: 'İade Gönderileri', badge: 'badge-passive' },
}

const CARGO_TYPE_OPTIONS: RoutingCargoType[] = ['shipment', 'transfer', 'return']

const RULE_HISTORY_ACTION_META: Record<string, { label: string; badge: string }> = {
  created: { label: 'Oluşturuldu', badge: 'badge-active' },
  updated: { label: 'Güncellendi', badge: 'badge-info' },
  deleted: { label: 'Silindi', badge: 'badge-danger' },
  toggled: { label: 'Durum Değişti', badge: 'badge-warning' },
  reordered: { label: 'Öncelik Değişti', badge: 'badge-passive' },
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
  const [cargoTypes, setCargoTypes] = useState<RoutingCargoType[]>(existing?.cargoTypes ?? [...CARGO_TYPE_OPTIONS])

  if (!open) return null

  const canSave = name.trim() && primaryCompanyId && cargoTypes.length > 0

  function toggleProvince(id: number) {
    setProvinceIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }

  function toggleCargoType(type: RoutingCargoType) {
    setCargoTypes((prev) => (prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]))
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
      cargoTypes,
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
            <label className="form-label">
              Bu Kural Hangi Modüller İçin Geçerli? <span className="text-[#fb3748]">*</span>
              <span className="font-normal normal-case text-neutral-400"> (en az bir tanesi seçilmeli)</span>
            </label>
            <div className="flex items-center gap-4 flex-wrap">
              {CARGO_TYPE_OPTIONS.map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={cargoTypes.includes(type)} onChange={() => toggleCargoType(type)} />
                  <span className="text-sm text-neutral-700">{CARGO_TYPE_META[type].label}</span>
                </label>
              ))}
            </div>
            {cargoTypes.length === 0 ? (
              <p className="form-error">En az bir modül seçmelisiniz.</p>
            ) : null}
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
                <Dropdown
                  value={String(primaryCompanyId)}
                  onChange={(v) => setPrimaryCompanyId(+v)}
                  options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
                />
              </div>
              <div>
                <label className="form-label">Yedek Kargo Firması (Failover)</label>
                <Dropdown
                  value={failoverCompanyId === '' ? '' : String(failoverCompanyId)}
                  onChange={(v) => setFailoverCompanyId(v === '' ? '' : +v)}
                  placeholder="Yok"
                  options={[{ value: '', label: 'Yok' }, ...COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))]}
                />
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
    if (simulator.desi === '' || !simulator.provinceId || !simulator.cargoType) {
      toast('Simülasyon için modül, desi ve il bilgisi gereklidir.', 'info')
      return
    }
    const result = matchRoutingRule(
      routingRules,
      +simulator.desi,
      +simulator.provinceId,
      simulator.amount === '' ? 0 : +simulator.amount,
      simulator.cargoType,
    )
    setRoutingSimulator({ resultId: result ? result.id : false })
  }

  const simResult =
    simulator.resultId === null
      ? null
      : simulator.resultId === false
        ? false
        : routingRules.find((r) => r.id === simulator.resultId) ?? false

  const setHeaderSlot = useHeaderSlotStore((s) => s.setHeaderSlot)
  const clearHeaderSlot = useHeaderSlotStore((s) => s.clearHeaderSlot)

  useLayoutEffect(() => {
    setHeaderSlot({
      subtitle: `${routingRules.length} kural tanımlı`,
      actions: (
        <button className="secondary-btn" type="button" onClick={() => setCreateOpen(true)}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Yeni Kural Ekle
        </button>
      ),
    })
    return () => clearHeaderSlot()
  })

  return (
    <>

      <div className="bg-white rounded-lg border border-neutral-200 p-5 mb-6">
        <p className="text-sm font-semibold text-neutral-950 mb-1">Yönlendirme Simülatörü</p>
        <p className="text-xs text-neutral-400 mb-4">
          Örnek bir gönderi girin, hangi kuralın eşleşip hangi taşıyıcının seçileceğini görün.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="form-label">Modül</label>
            <Dropdown
              value={simulator.cargoType}
              onChange={(v) => setRoutingSimulator({ cargoType: v as RoutingCargoType | '', resultId: null })}
              placeholder="Modül seçin..."
              options={CARGO_TYPE_OPTIONS.map((type) => ({ value: type, label: CARGO_TYPE_META[type].label }))}
            />
          </div>
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
            <Dropdown
              value={simulator.provinceId}
              onChange={(v) => setRoutingSimulator({ provinceId: v, resultId: null })}
              placeholder="İl seçin..."
              options={PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))}
            />
          </div>
          <div>
            <label className="form-label">Sipariş Tutarı</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
              <input
                type="text"
                inputMode="numeric"
                className="form-input form-input-icon-left"
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
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kapsam</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Koşullar</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Birincil Taşıyıcı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Yedek Taşıyıcı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th
                className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right sticky right-0 bg-white"
                style={{ boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.06)' }}
              >
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((rule, i) => {
              const primary = getCompany(rule.primaryCompanyId)
              const failover = rule.failoverCompanyId ? getCompany(rule.failoverCompanyId) : null
              const even = i % 2 === 0
              const stickyBg = even ? '#ffffff' : '#fafbfc'
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
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {rule.cargoTypes.map((type) => (
                        <span key={type} className={`badge ${CARGO_TYPE_META[type].badge}`}>
                          {CARGO_TYPE_META[type].label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-neutral-500 text-xs">{ruleConditionsSummary(rule.conditions)}</td>
                  <td className="px-5 py-3.5 text-neutral-600">{primary ? primary.name : 'Bilinmiyor'}</td>
                  <td className="px-5 py-3.5 text-neutral-500">{failover ? failover.name : '-'}</td>
                  <td className="px-5 py-3.5">
                    <span className={`badge ${rule.active ? 'badge-active' : 'badge-passive'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rule.active ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
                      {rule.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td
                    className="px-5 py-3.5 sticky right-0"
                    style={{ background: stickyBg, boxShadow: '-4px 0 6px -2px rgba(0,0,0,0.06)' }}
                  >
                    <div className="flex justify-end gap-1">
                      <button className="action-btn" type="button" title="Düzenle" onClick={() => setEditId(rule.id)}>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="action-btn"
                        type="button"
                        title={rule.active ? 'Pasife Al' : 'Aktife Al'}
                        onClick={() => {
                          toggleRoutingRule(rule.id)
                          logRoutingHistory('toggled', rule.name, rule.active ? 'Kural pasife alındı.' : 'Kural aktif edildi.')
                          toast(`"${rule.name}" ${rule.active ? 'pasife alındı' : 'aktif edildi'}.`, 'info')
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v9m6.364-7.364a9 9 0 11-12.728 0" />
                        </svg>
                      </button>
                      <button
                        className="action-btn hover:text-[#ad1f2b] hover:bg-[#ffebec]"
                        type="button"
                        title="Sil"
                        onClick={() => {
                          removeRoutingRule(rule.id)
                          logRoutingHistory('deleted', rule.name, 'Kural silindi.')
                          toast(`"${rule.name}" silindi.`, 'info')
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

      {createOpen ? <RoutingRuleModal open editId={null} onClose={() => setCreateOpen(false)} /> : null}
      {editId != null ? <RoutingRuleModal open editId={editId} onClose={() => setEditId(null)} /> : null}
    </>
  )
}


const WEIGHT_FIELDS: { key: CarrierMetricKey; label: string; lowerIsBetter?: boolean }[] = [
  { key: 'cost', label: 'Maliyet' },
  { key: 'deliveryTime', label: 'Zamanında Teslimat (OTD)' },
  { key: 'successRate', label: 'Başarı Oranı' },
  { key: 'damagedRate', label: 'Hasar Oranı', lowerIsBetter: true },
  { key: 'avgPickupHours', label: 'Ort. Teslim Alma Süresi', lowerIsBetter: true },
  { key: 'costDiffPct', label: 'Maliyet Sapması', lowerIsBetter: true },
]

function WeightsTab() {
  const weights = useUiStore((s) => s.routingWeights)
  const setRoutingWeights = useUiStore((s) => s.setRoutingWeights)

  const total = CARRIER_METRIC_KEYS.reduce((sum, k) => sum + (weights[k] ?? 0), 0) || 1
  const norm = Object.fromEntries(
    CARRIER_METRIC_KEYS.map((k) => [k, Math.round(((weights[k] ?? 0) / total) * 100)]),
  ) as Record<CarrierMetricKey, number>

  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-5">
      <p className="text-sm font-semibold text-neutral-950 mb-1">Kriter Ağırlıkları</p>
      <p className="text-xs text-neutral-400 mb-5">
        Taşıyıcı seçim motorunun her kriteri ne kadar önemseyeceğini ayarlayın. Ağırlıklar otomatik olarak %100&apos;e
        normalize edilir.
      </p>
      <div className="flex flex-col gap-5">
        {WEIGHT_FIELDS.map((wf) => (
          <div key={wf.key}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-medium text-neutral-700">
                {wf.label}
                {wf.lowerIsBetter ? <span className="text-xs text-neutral-400 font-normal"> (düşük iyi)</span> : null}
              </span>
              <span className="text-sm font-semibold text-primary">%{norm[wf.key]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights[wf.key] ?? 0}
              className="w-full"
              onChange={(e) => setRoutingWeights({ [wf.key]: +e.target.value })}
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-400 mt-5">
        Normalize edilmiş ağırlıklar, &quot;Normalize Puanlama&quot; sekmesindeki taşıyıcı skor tablosunu doğrudan
        etkiler.
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

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-950">Standardize Taşıyıcı Puan Tablosu</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Her metrik, tüm kargo firmaları arasında 0-100 arasına normalize edilir; Toplam sütunu, &quot;Ağırlık
          Verme&quot; sekmesindeki katsayılarla hesaplanan bileşik skordur.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: 760 }}>
          <thead>
            <tr className="text-left border-b border-neutral-100">
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
              {WEIGHT_FIELDS.map((wf) => (
                <th key={wf.key} className="px-3 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">
                  {wf.label}
                </th>
              ))}
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.companyId} className={`${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50/50'} border-b border-neutral-50`}>
                <td className="px-5 py-3">
                  <span className="flex items-center gap-2 font-medium text-neutral-700">
                    <span
                      className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'bg-[#fff3eb] text-[#c2570e]' : 'bg-neutral-100 text-neutral-500'
                      }`}
                    >
                      {i + 1}
                    </span>
                    {s.companyName}
                  </span>
                </td>
                {WEIGHT_FIELDS.map((wf) => (
                  <td key={wf.key} className="px-3 py-3 text-right text-neutral-600">
                    {(s.metrics[wf.key] * 100).toFixed(0)}
                  </td>
                ))}
                <td className="px-5 py-3 text-right font-semibold text-neutral-900">{(s.combined * 100).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
    <div className="page-container">
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
