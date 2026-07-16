import type { ReactNode } from 'react'
import { COMPANIES, PRODUCT_TYPES, type ContractForm } from '../../data/catalog'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

const PRODUCT_TYPE_ICONS: Record<string, ReactNode> = {
  gida: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v4.5m3.75-4.5v4.5m-7.5 0h11.25M6 7.5v13.5a1 1 0 001 1h10a1 1 0 001-1V7.5M9.75 12v6m4.5-6v6" />
    </svg>
  ),
  elektronik: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 2L3 14h7l-1 8 11-14h-7l1-6z" />
    </svg>
  ),
  tekstil: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2l4 2 4-2 3 4-3 2v14H5V8L2 6l3-4h3zm4 2v18" />
    </svg>
  ),
}

function Toggle({
  val,
  label,
  desc,
  onToggle,
  defaultChecked,
  onDefaultToggle,
  defaultLabel,
}: {
  val: boolean
  label: string
  desc: string
  onToggle: () => void
  defaultChecked?: boolean
  onDefaultToggle?: () => void
  defaultLabel?: string
}) {
  return (
    <div className="rounded-lg border border-neutral-100 bg-neutral-50/50 overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-neutral-950">{label}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{desc}</p>
        </div>
        <button type="button" className={`toggle-track ${val ? 'on' : 'off'}`} onClick={onToggle}>
          <div className="toggle-thumb" />
        </button>
      </div>
      {val && onDefaultToggle ? (
        <label className="flex items-center gap-2 px-4 py-2.5 border-t border-neutral-100 bg-white cursor-pointer">
          <input type="checkbox" checked={!!defaultChecked} onChange={onDefaultToggle} />
          <svg className="w-3.5 h-3.5 text-[#f0b429] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-xs text-neutral-600">{defaultLabel}</span>
        </label>
      ) : null}
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
                className={`form-input form-input-icon-left ${errors.minOrderAmount ? 'error' : ''}`}
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
                className={`form-input form-input-icon-left ${errors.maxOrderAmount ? 'error' : ''}`}
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
            onToggle={() =>
              onChange({ orderShipping: !f.orderShipping, ...(f.orderShipping ? { isDefaultOrder: false } : {}) })
            }
            defaultChecked={f.isDefaultOrder}
            onDefaultToggle={() => onChange({ isDefaultOrder: !f.isDefaultOrder })}
            defaultLabel={t('step1.default_order_label')}
          />
          <Toggle
            val={f.returnShipping}
            label={t('step1.return_shipping_label')}
            desc={t('step1.return_shipping_desc')}
            onToggle={() =>
              onChange({ returnShipping: !f.returnShipping, ...(f.returnShipping ? { isDefaultReturn: false } : {}) })
            }
            defaultChecked={f.isDefaultReturn}
            onDefaultToggle={() => onChange({ isDefaultReturn: !f.isDefaultReturn })}
            defaultLabel={t('step1.default_return_label')}
          />
          <Toggle
            val={f.transferShipping}
            label={t('step1.transfer_shipping_label')}
            desc={t('step1.transfer_shipping_desc')}
            onToggle={() =>
              onChange({
                transferShipping: !f.transferShipping,
                ...(f.transferShipping ? { isDefaultTransfer: false } : {}),
              })
            }
            defaultChecked={f.isDefaultTransfer}
            onDefaultToggle={() => onChange({ isDefaultTransfer: !f.isDefaultTransfer })}
            defaultLabel={t('step1.default_transfer_label')}
          />
        </div>
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-1">
          {t('step1.product_type_section')} <span className="font-normal normal-case text-neutral-400">{t('step1.extra_rules_hint')}</span>
        </p>
        <div className="grid grid-cols-3 gap-3 mt-3" style={{ maxWidth: 480 }}>
          {Object.entries(PRODUCT_TYPES).map(([key, label]) => {
            const active = f.productTypes.includes(key)
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleMulti('productTypes', key)}
                className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-lg border text-center transition-colors ${
                  active ? 'border-primary bg-primary-lighter/30' : 'border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                {active ? (
                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                ) : null}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center ${
                    active ? 'bg-primary text-white' : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {PRODUCT_TYPE_ICONS[key]}
                </div>
                <p className={`text-xs font-semibold ${active ? 'text-primary-darker' : 'text-neutral-700'}`}>{label}</p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
