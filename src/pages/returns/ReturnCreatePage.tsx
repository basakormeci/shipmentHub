import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES, SHIPMENT_STATUS, getCompany } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { getDefaultCompanyId, getEligibleCompanyIds } from '../../lib/contracts'
import { RETURN_REASONS, getOriginalShipment } from '../../lib/returns'
import { Dropdown } from '../../components/ui/Dropdown'

type FormErrors = Partial<Record<'originalShipmentId' | 'companyId', string>>

function buildInitial(defaultCompanyId: number | null) {
  return {
    originalShipmentId: '',
    reason: 'begenmedim',
    companyId: defaultCompanyId != null ? String(defaultCompanyId) : '',
    pickup: true,
    pickupDistrict: '',
    pickupProvince: '',
    note: '',
  }
}

export function ReturnCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const shipments = useDataStore((s) => s.shipments)
  const contracts = useDataStore((s) => s.contracts)
  const addReturn = useDataStore((s) => s.addReturn)

  const eligibleCompanyIds = new Set(getEligibleCompanyIds(contracts, 'returnShipping'))
  const companyOptions = COMPANIES.filter((c) => eligibleCompanyIds.has(c.id))
  const defaultCompanyId = getDefaultCompanyId(contracts, 'returnShipping')
  const [form, setForm] = useState(() => buildInitial(defaultCompanyId))
  const [errors, setErrors] = useState<FormErrors>({})

  const orig = form.originalShipmentId ? getOriginalShipment(shipments, +form.originalShipmentId) : null
  const statusLabel = (key: string) => t(`status.${key}`)

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (errors[key as keyof FormErrors]) {
      setErrors((e) => {
        const next = { ...e }
        delete next[key as keyof FormErrors]
        return next
      })
    }
  }

  function reset() {
    setForm(buildInitial(defaultCompanyId))
    setErrors({})
  }

  function validate() {
    const errs: FormErrors = {}
    if (!form.originalShipmentId) errs.originalShipmentId = t('returnCreate.err_shipment')
    if (!form.companyId) errs.companyId = t('returnCreate.err_company')
    return errs
  }

  function submit() {
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const pickupAddress =
      form.pickup && form.pickupDistrict.trim() && form.pickupProvince.trim()
        ? { district: form.pickupDistrict.trim(), province: form.pickupProvince.trim() }
        : undefined
    const created = addReturn({
      originalShipmentId: +form.originalShipmentId,
      reason: form.reason,
      companyId: +form.companyId,
      pickup: form.pickup,
      pickupAddress,
      note: form.note,
    })
    toast(t('returnCreate.toast_created', { no: created.returnNo }), 'success')
    reset()
    navigate(`/returns/${created.id}`)
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/returns" className="hover:text-neutral-600">
            {t('returnDetail.breadcrumb')}
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{t('returns.create_btn')}</span>
        </div>
        <Link to="/returns" className="secondary-btn py-2 px-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('returnDetail.back')}
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">{t('returnCreate.section_detail')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2">
                <label className="form-label">
                  {t('returnCreate.original_shipment')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.originalShipmentId}
                  value={form.originalShipmentId}
                  onChange={(v) => setField('originalShipmentId', v)}
                  placeholder={t('returnCreate.shipment_placeholder')}
                  options={shipments.map((s) => ({
                    value: String(s.id),
                    label: `#${s.shipmentNo} — ${s.customerName} (${getCompany(s.companyId)?.name ?? ''})`,
                  }))}
                />
                {errors.originalShipmentId ? <p className="form-error">{errors.originalShipmentId}</p> : null}
              </div>
              <div>
                <label className="form-label">{t('returnCreate.reason')}</label>
                <Dropdown
                  value={form.reason}
                  onChange={(v) => setField('reason', v)}
                  options={RETURN_REASONS.map((k) => ({ value: k, label: t(`returnReason.${k}`) }))}
                />
              </div>

              {orig ? (
                <div className="col-span-2 border border-neutral-100 rounded-lg p-4 bg-neutral-50/50 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">{t('returnDetail.field_order_no')}</p>
                    <p className="font-medium text-neutral-700">{orig.orderNo}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">{t('returns.th_carrier')}</p>
                    <p className="font-medium text-neutral-700">{getCompany(orig.companyId)?.name ?? ''}</p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">{t('shipmentCreate.section_address')}</p>
                    <p className="font-medium text-neutral-700">
                      {orig.shipTo.district} / {orig.shipTo.province}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-neutral-400 mb-0.5">{t('returns.th_status')}</p>
                    <span className={`badge ${SHIPMENT_STATUS[orig.status].badge}`}>{statusLabel(orig.status)}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('returnCreate.section_carrier')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('returnCreate.company')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.companyId}
                  value={form.companyId}
                  onChange={(v) => setField('companyId', v)}
                  placeholder={t('returnCreate.company_placeholder')}
                  options={companyOptions.map((c) => ({ value: String(c.id), label: c.name }))}
                />
                {errors.companyId ? (
                  <p className="form-error">{errors.companyId}</p>
                ) : defaultCompanyId != null && form.companyId === String(defaultCompanyId) ? (
                  <p className="text-[11px] text-primary-darker mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="9" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
                    </svg>
                    {t('common.default_carrier_hint')}
                  </p>
                ) : null}
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
                <div>
                  <p className="text-sm font-medium text-neutral-950">{t('returnCreate.pickup_title')}</p>
                  <p className="text-xs text-neutral-400 mt-0.5">{t('returnCreate.pickup_desc')}</p>
                </div>
                <button
                  type="button"
                  className={`toggle-track ${form.pickup ? 'on' : 'off'}`}
                  onClick={() => setField('pickup', !form.pickup)}
                  aria-pressed={form.pickup}
                >
                  <div className="toggle-thumb" />
                </button>
              </div>
            </div>
          </div>

          {form.pickup ? (
            <div className="col-span-2">
              <div className="h-px bg-neutral-100 my-1" />
              <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-1">
                {t('returnCreate.section_pickup_address')}
              </p>
              <p className="text-xs text-neutral-400 mb-4">{t('returnCreate.pickup_address_hint')}</p>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="form-label">{t('returnAddressModal.province')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.pickupProvince}
                    placeholder={orig?.shipTo.province ?? ''}
                    onChange={(e) => setField('pickupProvince', e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">{t('returnAddressModal.district')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={form.pickupDistrict}
                    placeholder={orig?.shipTo.district ?? ''}
                    onChange={(e) => setField('pickupDistrict', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('returnCreate.section_notes')}</p>
            <div>
              <label className="form-label">
                {t('returnCreate.note')}{' '}
                <span className="font-normal normal-case text-neutral-400">{t('returnCreate.note_optional')}</span>
              </label>
              <textarea className="form-input" rows={3} value={form.note} onChange={(e) => setField('note', e.target.value)} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-100">
          <button className="secondary-btn" type="button" onClick={reset}>
            {t('returnCreate.reset')}
          </button>
          <button className="primary-btn" type="button" onClick={submit}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t('returnCreate.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
