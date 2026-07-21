import { useLayoutEffect, useMemo, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import {
  CARRIER_METRIC_KEYS,
  CARRIER_METRIC_DESCRIPTIONS,
  PROVINCES,
  PRODUCT_TYPES,
  getCompany,
  type CarrierMetricKey,
  type RoutingCargoType,
} from '../../data/catalog'
import { computeCarrierScores, matchExcludeRules, matchIncludeRule, ruleConditionsSummary } from '../../lib/carrierScoring'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { useHeaderSlotStore } from '../../stores/headerSlotStore'
import { Dropdown } from '../../components/ui/Dropdown'
import { InfoTooltip } from '../../components/ui/InfoTooltip'

const TABS = [
  { key: 'rules', label: 'Kurallar', to: '/routing/rules' },
  { key: 'weights', label: 'Ağırlıklandırma', to: '/routing/weights' },
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

function RulesTab() {
  const navigate = useNavigate()
  const routingRules = useDataStore((s) => s.routingRules)
  const toggleRoutingRule = useDataStore((s) => s.toggleRoutingRule)
  const removeRoutingRule = useDataStore((s) => s.removeRoutingRule)
  const moveRoutingPriority = useDataStore((s) => s.moveRoutingPriority)
  const logRoutingHistory = useDataStore((s) => s.logRoutingHistory)
  const simulator = useUiStore((s) => s.routingSimulator)
  const setRoutingSimulator = useUiStore((s) => s.setRoutingSimulator)
  const [simProductType, setSimProductType] = useState('')

  const sorted = useMemo(() => [...routingRules].sort((a, b) => a.priority - b.priority), [routingRules])

  const [simExcluded, setSimExcluded] = useState<{ companyId: number; ruleNames: string[] } | null>(null)

  function runSimulation() {
    if (simulator.desi === '' || !simulator.provinceId || !simulator.cargoType) {
      toast('Simülasyon için modül, desi ve il bilgisi gereklidir.', 'info')
      return
    }
    const desi = +simulator.desi
    const provinceId = +simulator.provinceId
    const amount = simulator.amount === '' ? 0 : +simulator.amount
    const productType = simProductType || undefined
    const result = matchIncludeRule(routingRules, desi, provinceId, amount, simulator.cargoType, productType)
    const excludeRules = matchExcludeRules(routingRules, desi, provinceId, amount, simulator.cargoType, productType)
    setSimExcluded(
      excludeRules.length
        ? { companyId: 0, ruleNames: excludeRules.map((r) => r.name) }
        : null,
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
        <button className="secondary-btn" type="button" onClick={() => navigate('/routing/rules/new')}>
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
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
          <div>
            <label className="form-label">Ürün Tipi</label>
            <Dropdown
              value={simProductType}
              onChange={(v) => {
                setSimProductType(v)
                setRoutingSimulator({ resultId: null })
              }}
              placeholder="Farketmez"
              options={[{ value: '', label: 'Farketmez' }, ...Object.entries(PRODUCT_TYPES).map(([k, l]) => ({ value: k, label: l }))]}
            />
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
                  Birincil taşıyıcı: <strong>{getCompany(simResult.primaryCompanyId ?? -1)?.name}</strong>
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
                Bu koşullarla eşleşen aktif bir kullanım kuralı bulunamadı.
              </p>
            )}
            {simExcluded ? (
              <p className="text-xs mt-2 pt-2 border-t border-black/10" style={{ color: simResult ? '#0b4627' : '#681219' }}>
                Ayrıca hariç tutulan kural(lar): <strong>{simExcluded.ruleNames.join(', ')}</strong>
              </p>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100">
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Öncelik</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kural Adı</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tip</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Modüller</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Koşullar</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Taşıyıcı</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((rule, i) => {
              const primary = rule.primaryCompanyId != null ? getCompany(rule.primaryCompanyId) : null
              const failover = rule.failoverCompanyId ? getCompany(rule.failoverCompanyId) : null
              const excludedNames = rule.excludedCompanyIds.map((id) => getCompany(id)?.name).filter(Boolean)
              const modulesText =
                rule.cargoTypes.length === CARGO_TYPE_OPTIONS.length
                  ? 'Tümü'
                  : rule.cargoTypes.map((t) => CARGO_TYPE_META[t].label).join(', ')
              const even = i % 2 === 0
              return (
                <tr key={rule.id} className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3 font-medium text-neutral-700 whitespace-nowrap">{rule.name}</td>
                  <td className="px-4 py-3">
                    {rule.ruleType === 'exclude' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap" style={{ color: '#ad1f2b' }}>
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        Kullanma
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-primary whitespace-nowrap">
                        <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Kullan
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{modulesText}</td>
                  <td className="px-4 py-3 text-neutral-500 text-xs whitespace-nowrap">{ruleConditionsSummary(rule.conditions)}</td>
                  <td className="px-4 py-3 text-neutral-600 text-xs">
                    {rule.ruleType === 'exclude' ? (
                      excludedNames.length ? (
                        excludedNames.join(', ')
                      ) : (
                        '-'
                      )
                    ) : (
                      <>
                        {primary ? primary.name : 'Bilinmiyor'}
                        {failover ? <span className="text-neutral-400"> · yedek {failover.name}</span> : null}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`badge ${rule.active ? 'badge-active' : 'badge-passive'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${rule.active ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
                      {rule.active ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
                        type="button"
                        title="Düzenle"
                        onClick={() => navigate(`/routing/rules/${rule.id}/edit`)}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
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
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
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
      </div>
    </>
  )
}

const WEIGHT_FIELDS: { key: CarrierMetricKey; label: string; lowerIsBetter?: boolean }[] = [
  { key: 'deliveryTime', label: 'Zamanında Teslimat (OTD)' },
  { key: 'successRate', label: 'Başarı Oranı' },
  { key: 'damagedRate', label: 'Hasar Oranı', lowerIsBetter: true },
  { key: 'avgPickupHours', label: 'Ort. Teslim Alma Süresi', lowerIsBetter: true },
  { key: 'costDiffPct', label: 'Maliyet Sapması', lowerIsBetter: true },
]

const WEIGHT_LEVELS = [1, 2, 3, 4, 5]

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
        Taşıyıcı seçim motorunun her kriteri ne kadar önemseyeceğini 1 (az önemli) ile 5 (çok önemli) arasında bir
        katsayı ile ayarlayın. Katsayılar otomatik olarak %100&apos;e normalize edilir.
      </p>
      <div className="flex flex-col divide-y divide-neutral-100">
        {WEIGHT_FIELDS.map((wf) => (
          <div key={wf.key} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
            <span className="text-sm font-medium text-neutral-700 flex items-center">
              {wf.label}
              {wf.lowerIsBetter ? <span className="text-xs text-neutral-400 font-normal"> (düşük iyi)</span> : null}
              <InfoTooltip text={CARRIER_METRIC_DESCRIPTIONS[wf.key]} />
            </span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {WEIGHT_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    title={`${level}`}
                    onClick={() => setRoutingWeights({ [wf.key]: level })}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      level <= (weights[wf.key] ?? 0) ? 'bg-primary' : 'bg-neutral-200 hover:bg-neutral-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-neutral-400 w-16 text-right">
                {weights[wf.key] ?? 0}/5 · %{norm[wf.key]}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-neutral-400 mt-5">
        Katsayılar, &quot;Normalize Puanlama&quot; sekmesindeki taşıyıcı skor tablosunu doğrudan etkiler.
      </p>
    </div>
  )
}

function ScoringTab() {
  const weights = useUiStore((s) => s.routingWeights)
  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)

  const scores = useMemo(
    () => computeCarrierScores(weights, shipments, carrierInvoices),
    [weights, shipments, carrierInvoices],
  )

  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      <div className="px-5 py-3.5 border-b border-neutral-100">
        <p className="text-sm font-semibold text-neutral-950">Taşıyıcı Puan Tablosu</p>
        <p className="text-xs text-neutral-400 mt-0.5">
          Zamanında Teslimat, Başarı ve Hasar Oranı gerçek yüzdelerin kendisidir (örn. 100 gönderiden 90&apos;ı zamanında
          teslim edildiyse puan 90&apos;dır). Toplam sütunu, &quot;Ağırlıklandırma&quot; sekmesindeki katsayılarla
          hesaplanan bileşik skordur.
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
