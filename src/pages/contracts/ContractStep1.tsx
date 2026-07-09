import {
  COMPANIES,
  CUSTOMER_SEGMENTS,
  ORDER_PAYMENT_TYPES,
  PACKAGE_TYPES,
  PRODUCT_TYPES,
  SHIPMENT_CHANNELS,
  type ContractForm,
} from '../../data/catalog'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

function Toggle({
  val,
  label,
  desc,
  onToggle,
}: {
  val: boolean
  label: string
  desc: string
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
      <div>
        <p className="text-sm font-medium text-neutral-950">{label}</p>
        <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
      </div>
      <button type="button" className={`toggle-track ${val ? 'on' : 'off'}`} onClick={onToggle}>
        <div className="toggle-thumb" />
      </button>
    </div>
  )
}

export function ContractStep1({
  f,
  errors,
  onChange,
}: {
  f: ContractForm
  errors: Record<string, string>
  onChange: (patch: Partial<ContractForm>) => void
}) {
  const t = useT()

  function toggleMulti(field: keyof ContractForm, key: string) {
    const arr = f[field] as string[]
    const idx = arr.indexOf(key)
    const next = idx >= 0 ? arr.filter((k) => k !== key) : [...arr, key]
    onChange({ [field]: next } as Partial<ContractForm>)
  }

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="col-span-2">
        <label className="form-label">
          {t('step1.company_label')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown
          error={!!errors.companyId}
          value={f.companyId === '' ? '' : String(f.companyId)}
          onChange={(v) => onChange({ companyId: v ? +v : '' })}
          placeholder={t('step1.company_placeholder')}
          options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
        />
        {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
      </div>

      <div className="col-span-2">
        <Toggle
          val={f.isDefault}
          label={t('step1.default_label')}
          desc={t('step1.default_desc')}
          onToggle={() => onChange({ isDefault: !f.isDefault })}
        />
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('step1.desi_section')}</p>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              {t('step1.min_desi')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-input ${errors.minDesi ? 'error' : ''}`}
              value={f.minDesi}
              placeholder="0"
              onChange={(e) => onChange({ minDesi: e.target.value })}
            />
            {errors.minDesi ? <p className="form-error">{errors.minDesi}</p> : null}
          </div>
          <div>
            <label className="form-label">
              {t('step1.max_desi')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-input ${errors.maxDesi ? 'error' : ''}`}
              value={f.maxDesi}
              placeholder="50"
              onChange={(e) => onChange({ maxDesi: e.target.value })}
            />
            {errors.maxDesi ? <p className="form-error">{errors.maxDesi}</p> : null}
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">
          {t('step1.amount_section')} <span className="font-normal normal-case text-neutral-400">{t('step1.optional')}</span>
        </p>
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="form-label">{t('step1.min_amount')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
              <input
                type="text"
                inputMode="numeric"
                className={`form-input pl-7 ${errors.minOrderAmount ? 'error' : ''}`}
                value={f.minOrderAmount}
                placeholder={t('step1.no_limit')}
                onChange={(e) => onChange({ minOrderAmount: e.target.value })}
              />
            </div>
            {errors.minOrderAmount ? <p className="form-error">{errors.minOrderAmount}</p> : null}
          </div>
          <div>
            <label className="form-label">{t('step1.max_amount')}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
              <input
                type="text"
                inputMode="numeric"
                className={`form-input pl-7 ${errors.maxOrderAmount ? 'error' : ''}`}
                value={f.maxOrderAmount}
                placeholder={t('step1.no_limit')}
                onChange={(e) => onChange({ maxOrderAmount: e.target.value })}
              />
            </div>
            {errors.maxOrderAmount ? <p className="form-error">{errors.maxOrderAmount}</p> : null}
          </div>
        </div>
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('step1.shipping_type_section')}</p>
        {errors.shippingType ? <p className="form-error mb-3">{errors.shippingType}</p> : null}
        <div className="flex flex-col gap-3">
          <Toggle
            val={f.orderShipping}
            label={t('step1.order_shipping_label')}
            desc={t('step1.order_shipping_desc')}
            onToggle={() => onChange({ orderShipping: !f.orderShipping })}
          />
          <Toggle
            val={f.returnShipping}
            label={t('step1.return_shipping_label')}
            desc={t('step1.return_shipping_desc')}
            onToggle={() => onChange({ returnShipping: !f.returnShipping })}
          />
          <Toggle
            val={f.transferShipping}
            label={t('step1.transfer_shipping_label')}
            desc={t('step1.transfer_shipping_desc')}
            onToggle={() => onChange({ transferShipping: !f.transferShipping })}
          />
        </div>
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-1">
          {t('step1.extra_rules')} <span className="font-normal normal-case text-neutral-400">{t('step1.extra_rules_hint')}</span>
        </p>

        <p className="text-xs font-medium text-neutral-500 mt-4 mb-2">Ürün Tipi Kısıtı</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PRODUCT_TYPES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`filter-tab ${f.productTypes.includes(key) ? 'active' : ''}`}
              onClick={() => toggleMulti('productTypes', key)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-4 mb-2">Müşteri Segmenti Kuralı</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(CUSTOMER_SEGMENTS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`filter-tab ${f.customerSegments.includes(key) ? 'active' : ''}`}
              onClick={() => toggleMulti('customerSegments', key)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-4 mb-2">Paket Tipi Kuralı</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(PACKAGE_TYPES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`filter-tab ${f.packageTypes.includes(key) ? 'active' : ''}`}
              onClick={() => toggleMulti('packageTypes', key)}
            >
              {label}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-4 mb-2">Sipariş Kanalı Kuralı</p>
        <div className="flex flex-wrap gap-1.5">
          {SHIPMENT_CHANNELS.map((val) => (
            <button
              key={val}
              type="button"
              className={`filter-tab ${f.channels.includes(val) ? 'active' : ''}`}
              onClick={() => toggleMulti('channels', val)}
            >
              {val}
            </button>
          ))}
        </div>

        <p className="text-xs font-medium text-neutral-500 mt-4 mb-2">Ödeme Tipi Kuralı</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(ORDER_PAYMENT_TYPES).map(([key, label]) => (
            <button
              key={key}
              type="button"
              className={`filter-tab ${f.paymentTypes.includes(key) ? 'active' : ''}`}
              onClick={() => toggleMulti('paymentTypes', key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
