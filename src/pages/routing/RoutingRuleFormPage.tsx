import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { COMPANIES, PROVINCES, PRODUCT_TYPES, type RoutingCargoType, type RoutingRuleType } from '../../data/catalog'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'
import { SegmentedToggle } from '../../components/ui/SegmentedToggle'
import { ToggleChip } from '../../components/ui/ToggleChip'

const CARGO_TYPE_META: Record<RoutingCargoType, string> = {
  shipment: 'Sipariş Gönderileri',
  transfer: 'Transfer Gönderileri',
  return: 'İade Gönderileri',
}
const CARGO_TYPE_OPTIONS: RoutingCargoType[] = ['shipment', 'transfer', 'return']

const USE_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
const EXCLUDE_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
  </svg>
)

export function RoutingRuleFormPage() {
  const navigate = useNavigate()
  const { ruleId } = useParams()
  const editId = ruleId ? Number(ruleId) : null

  const routingRules = useDataStore((s) => s.routingRules)
  const upsertRoutingRule = useDataStore((s) => s.upsertRoutingRule)
  const logRoutingHistory = useDataStore((s) => s.logRoutingHistory)
  const existing = editId != null ? routingRules.find((r) => r.id === editId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [ruleType, setRuleType] = useState<RoutingRuleType>(existing?.ruleType ?? 'include')
  const [minDesi, setMinDesi] = useState(existing ? String(existing.conditions.minDesi) : '0')
  const [maxDesi, setMaxDesi] = useState(existing ? String(existing.conditions.maxDesi) : '999')
  const [minAmount, setMinAmount] = useState(existing ? String(existing.conditions.minAmount) : '')
  const [maxAmount, setMaxAmount] = useState(existing ? String(existing.conditions.maxAmount) : '')
  const [provinceIds, setProvinceIds] = useState<number[]>(existing?.conditions.provinceIds ?? [])
  const [productTypes, setProductTypes] = useState<string[]>(existing?.conditions.productTypes ?? [])
  const [primaryCompanyId, setPrimaryCompanyId] = useState<number | ''>(existing?.primaryCompanyId ?? COMPANIES[0].id)
  const [failoverCompanyId, setFailoverCompanyId] = useState<number | ''>(existing?.failoverCompanyId ?? '')
  const [excludedCompanyIds, setExcludedCompanyIds] = useState<number[]>(existing?.excludedCompanyIds ?? [])
  const [active, setActive] = useState(existing?.active ?? true)
  const [cargoTypes, setCargoTypes] = useState<RoutingCargoType[]>(existing?.cargoTypes ?? [...CARGO_TYPE_OPTIONS])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = editId != null

  function toggleProvince(id: number) {
    setProvinceIds((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]))
  }
  function toggleProductType(key: string) {
    setProductTypes((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]))
  }
  function toggleCargoType(type: RoutingCargoType) {
    setCargoTypes((prev) => (prev.includes(type) ? prev.filter((c) => c !== type) : [...prev, type]))
  }
  function toggleExcludedCompany(id: number) {
    setExcludedCompanyIds((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  function validate() {
    const errs: Record<string, string> = {}
    if (!name.trim()) errs.name = 'Kural adı girilmelidir.'
    if (cargoTypes.length === 0) errs.cargoTypes = 'En az bir gönderi tipi seçmelisiniz.'
    if (ruleType === 'include' && !primaryCompanyId) errs.primaryCompanyId = 'Birincil kargo firması seçilmelidir.'
    if (ruleType === 'exclude' && excludedCompanyIds.length === 0) errs.excludedCompanyIds = 'En az bir kargo firması seçilmelidir.'
    return errs
  }

  function save() {
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const conditions = {
      minDesi: +minDesi,
      maxDesi: +maxDesi,
      provinceIds,
      minAmount: minAmount === '' ? ('' as const) : +minAmount,
      maxAmount: maxAmount === '' ? ('' as const) : +maxAmount,
      productTypes,
    }
    const rule = upsertRoutingRule({
      id: editId,
      name: name.trim(),
      priority: existing?.priority ?? routingRules.length + 1,
      active,
      ruleType,
      conditions,
      primaryCompanyId: ruleType === 'include' ? (primaryCompanyId === '' ? null : primaryCompanyId) : null,
      failoverCompanyId: ruleType === 'include' ? (failoverCompanyId === '' ? null : failoverCompanyId) : null,
      excludedCompanyIds: ruleType === 'exclude' ? excludedCompanyIds : [],
      cargoTypes,
    })
    logRoutingHistory(editId ? 'updated' : 'created', rule.name, editId ? 'Kural güncellendi.' : 'Kural oluşturuldu.')
    toast(editId ? 'Kural güncellendi.' : 'Yeni kural oluşturuldu.', 'success')
    navigate('/routing/rules')
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/routing/rules" className="hover:text-neutral-600">
            Akıllı Yönlendirme
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{isEdit ? 'Kuralı Düzenle' : 'Yeni Kural'}</span>
        </div>
        <Link to="/routing/rules" className="secondary-btn py-2 px-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Listeye Dön
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col gap-6">
          <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">Kural Bilgileri</p>
            <label className="form-label">
              Kural Adı <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              className={`form-input ${errors.name ? 'error' : ''}`}
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((er) => ({ ...er, name: '' }))
              }}
            />
            {errors.name ? <p className="form-error">{errors.name}</p> : null}
          </div>

          <div>
            <div className="h-px bg-neutral-100 mb-6" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">1. Koşullar</p>
            <p className="text-xs text-neutral-400 mb-4">Bu kural, aşağıdaki koşullara uyan gönderiler için geçerli olacak.</p>

            <div className="flex flex-col gap-4">
              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
                <label className="form-label">
                  Gönderi Tipi <span className="text-[#fb3748]">*</span>
                  <span className="font-normal normal-case text-neutral-400"> (en az bir tanesi seçilmeli)</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {CARGO_TYPE_OPTIONS.map((type) => (
                    <ToggleChip key={type} label={CARGO_TYPE_META[type]} active={cargoTypes.includes(type)} onClick={() => toggleCargoType(type)} />
                  ))}
                </div>
                {errors.cargoTypes ? <p className="form-error">{errors.cargoTypes}</p> : null}
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
                <label className="form-label">
                  Ürün Tipi <span className="font-normal normal-case text-neutral-400">(boş bırakılırsa tüm tipler)</span>
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {Object.entries(PRODUCT_TYPES).map(([key, label]) => (
                    <ToggleChip key={key} label={label} active={productTypes.includes(key)} onClick={() => toggleProductType(key)} />
                  ))}
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
                <label className="form-label">Desi ve Tutar Aralığı</label>
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">Min Desi</label>
                    <input type="text" inputMode="numeric" className="form-input" value={minDesi} onChange={(e) => setMinDesi(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Max Desi</label>
                    <input type="text" inputMode="numeric" className="form-input" value={maxDesi} onChange={(e) => setMaxDesi(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">
                      Min Sipariş Tutarı <span className="font-normal normal-case text-neutral-400">(isteğe bağlı)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      placeholder="Kısıt yok"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label">
                      Max Sipariş Tutarı <span className="font-normal normal-case text-neutral-400">(isteğe bağlı)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="form-input"
                      placeholder="Kısıt yok"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
                <label className="form-label">
                  Bölgeler <span className="font-normal normal-case text-neutral-400">(boş bırakılırsa tüm iller)</span>
                </label>
                <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-0.5">
                  {PROVINCES.map((p) => (
                    <ToggleChip key={p.id} label={p.name} active={provinceIds.includes(p.id)} onClick={() => toggleProvince(p.id)} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="h-px bg-neutral-100 mb-6" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">2. Kargo Firması Ataması</p>
            <p className="text-xs text-neutral-400 mb-4">Koşullar eşleştiğinde ne yapılacağını belirleyin.</p>

            <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50/40">
              <label className="form-label">Kural Tipi</label>
              <SegmentedToggle
                value={ruleType}
                onChange={setRuleType}
                options={[
                  { value: 'include', label: 'Kargo Firması Kullan', icon: USE_ICON },
                  { value: 'exclude', label: 'Kargo Firması Kullanma', icon: EXCLUDE_ICON },
                ]}
              />

              <div className="h-px bg-neutral-200 my-4" />

              {ruleType === 'include' ? (
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="form-label">
                      Birincil Kargo Firması <span className="text-[#fb3748]">*</span>
                    </label>
                    <Dropdown
                      error={!!errors.primaryCompanyId}
                      value={primaryCompanyId === '' ? '' : String(primaryCompanyId)}
                      onChange={(v) => setPrimaryCompanyId(+v)}
                      options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
                    />
                    {errors.primaryCompanyId ? <p className="form-error">{errors.primaryCompanyId}</p> : null}
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
              ) : (
                <div>
                  <label className="form-label">
                    Hariç Tutulacak Kargo Firmaları <span className="text-[#fb3748]">*</span>
                    <span className="font-normal normal-case text-neutral-400"> (bu koşullar eşleştiğinde hiç kullanılmaz)</span>
                  </label>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto p-0.5">
                    {COMPANIES.map((c) => (
                      <ToggleChip key={c.id} label={c.name} active={excludedCompanyIds.includes(c.id)} onClick={() => toggleExcludedCompany(c.id)} />
                    ))}
                  </div>
                  {errors.excludedCompanyIds ? <p className="form-error">{errors.excludedCompanyIds}</p> : null}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="h-px bg-neutral-100 mb-6" />
            <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-200 bg-neutral-50/40">
              <div>
                <p className="text-sm font-medium text-neutral-950">Kural Aktif</p>
                <p className="text-xs text-neutral-400 mt-0.5">Pasif kurallar yönlendirmede dikkate alınmaz</p>
              </div>
              <button type="button" className={`toggle-track ${active ? 'on' : 'off'}`} onClick={() => setActive(!active)}>
                <div className="toggle-thumb" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-100">
          <button className="secondary-btn" type="button" onClick={() => navigate('/routing/rules')}>
            Vazgeç
          </button>
          <button className="primary-btn" type="button" onClick={save}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {isEdit ? 'Kaydet' : 'Kural Oluştur'}
          </button>
        </div>
      </div>
    </div>
  )
}
