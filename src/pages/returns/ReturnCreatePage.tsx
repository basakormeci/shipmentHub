import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES, PROVINCES, getCompany, type ShipmentRoutingDecision } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { SHIPMENT_CHANNELS } from '../../lib/shipments'
import { getEligibleCompanyIds } from '../../lib/contracts'
import { decideCarrier } from '../../lib/carrierRouting'
import { RETURN_REASONS, getPickupAvailability } from '../../lib/returns'
import { Dropdown } from '../../components/ui/Dropdown'
import { SegmentedToggle } from '../../components/ui/SegmentedToggle'
import { ProductTypePicker } from '../../components/ui/ProductTypePicker'

const AUTO_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 6l1.035-.259a3.375 3.375 0 002.456-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z"
    />
  </svg>
)
const MANUAL_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
  </svg>
)
const PICKUP_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h11v8H3V7zm11 3h4l3 3v2h-7v-5zM6 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm11 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
  </svg>
)
const DROPOFF_ICON = (
  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 9l1-5h16l1 5M3 9a2 2 0 002 2h1a2 2 0 002-2 2 2 0 002 2 2 2 0 002-2 2 2 0 002 2 2 2 0 002-2 2 2 0 002 2h1a2 2 0 002-2M4 9v10h16V9"
    />
  </svg>
)

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

type FormErrors = Partial<
  Record<
    'orderNo' | 'companyId' | 'customerName' | 'provinceId' | 'district' | 'addressLine' | 'phone' | 'pickupDate' | 'pickupSlot',
    string
  >
>

function buildInitial() {
  return {
    orderNo: '',
    routingMode: 'auto' as 'auto' | 'manual',
    companyId: '',
    desi: '',
    orderAmount: '',
    customerName: '',
    provinceId: '',
    district: '',
    addressLine: '',
    phone: '',
    email: '',
    referenceId: '',
    packageNo: '',
    channel: 'Kendi Web Sitesi',
    productType: '',
    reason: 'begenmedim',
    pickup: true,
    pickupDate: '',
    pickupSlot: '',
    note: '',
  }
}

export function ReturnCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const contracts = useDataStore((s) => s.contracts)
  const routingRules = useDataStore((s) => s.routingRules)
  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const carrierPricing = useDataStore((s) => s.carrierPricing)
  const routingWeights = useUiStore((s) => s.routingWeights)
  const addReturn = useDataStore((s) => s.addReturn)

  const eligibleCompanyIds = new Set(getEligibleCompanyIds(contracts, 'returnShipping'))
  const companyOptions = COMPANIES.filter((c) => eligibleCompanyIds.has(c.id))
  const [form, setForm] = useState(() => buildInitial())
  const [errors, setErrors] = useState<FormErrors>({})

  const province = form.provinceId ? getProvince(+form.provinceId) : undefined

  const canPreviewRouting = form.routingMode === 'auto' && !!form.provinceId

  const routingPreview = useMemo(() => {
    if (!canPreviewRouting) return null
    return decideCarrier({
      provinceId: +form.provinceId,
      desi: form.desi === '' ? 0 : +form.desi,
      amount: form.orderAmount === '' ? 0 : +form.orderAmount,
      contracts,
      routingRules,
      routingWeights,
      shipments,
      carrierInvoices,
      carrierPricing,
      shippingType: 'returnShipping',
      cargoType: 'return',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- canPreviewRouting already encodes the relevant form fields
  }, [canPreviewRouting, form.provinceId, form.desi, form.orderAmount, contracts, routingRules, routingWeights, shipments, carrierInvoices, carrierPricing])

  const effectiveCompanyId = form.routingMode === 'manual' ? (form.companyId ? +form.companyId : null) : routingPreview?.chosenCompanyId ?? null

  const pickupDays = useMemo(() => {
    if (!form.pickup || effectiveCompanyId == null) return []
    return getPickupAvailability(effectiveCompanyId)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- dummy availability only needs to change when the carrier changes
  }, [form.pickup, effectiveCompanyId])

  const selectedPickupDay = pickupDays.find((d) => d.date === form.pickupDate) ?? null

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

  function setDeliveryMethod(pickup: boolean) {
    setForm((f) => ({ ...f, pickup, companyId: '', pickupDate: '', pickupSlot: '' }))
    setErrors((e) => {
      const next = { ...e }
      delete next.companyId
      delete next.pickupDate
      delete next.pickupSlot
      return next
    })
  }

  function setProvince(val: string) {
    setForm((f) => ({ ...f, provinceId: val, district: '' }))
    if (errors.provinceId) {
      setErrors((e) => {
        const next = { ...e }
        delete next.provinceId
        return next
      })
    }
  }

  // If the carrier changes after a pickup day/slot was already chosen, drop the stale selection.
  useEffect(() => {
    if (form.pickupDate && !pickupDays.some((d) => d.date === form.pickupDate)) {
      setForm((f) => ({ ...f, pickupDate: '', pickupSlot: '' }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-check when the available day pool itself changes
  }, [pickupDays])

  function reset() {
    setForm(buildInitial())
    setErrors({})
  }

  function validate() {
    const errs: FormErrors = {}
    if (!form.orderNo.trim()) errs.orderNo = t('shipmentCreate.err_order_no')
    if (!form.customerName.trim()) errs.customerName = t('shipmentCreate.err_customer')
    if (form.pickup) {
      if (form.routingMode === 'manual' && !form.companyId) errs.companyId = t('shipmentCreate.err_company')
      if (!form.pickupDate) errs.pickupDate = t('returnCreate.err_pickup_date')
      if (form.pickupDate && !form.pickupSlot) errs.pickupSlot = t('returnCreate.err_pickup_slot')
    } else {
      if (!form.companyId) errs.companyId = t('shipmentCreate.err_company')
    }
    if (!form.provinceId) errs.provinceId = t('shipmentCreate.err_province')
    if (!form.district) errs.district = t('shipmentCreate.err_district')
    if (!form.addressLine.trim()) errs.addressLine = t('shipmentCreate.err_address_line')
    if (!form.phone.trim()) errs.phone = t('shipmentCreate.err_phone')
    return errs
  }

  function submit() {
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    let companyId: number
    let routingDecision: ShipmentRoutingDecision
    if (!form.pickup || form.routingMode === 'manual') {
      companyId = +form.companyId
      routingDecision = {
        mode: 'manual',
        contractEligibleCompanyIds: [],
        matchedRuleId: null,
        matchedRuleName: null,
        matchedRuleSummary: null,
        ruleNarrowedCompanyIds: null,
        weights: { cost: 0, deliveryTime: 0, successRate: 0, damagedRate: 0, avgPickupHours: 0, costDiffPct: 0 },
        scores: [],
        chosenCompanyId: companyId,
      }
    } else {
      const decision = decideCarrier({
        provinceId: +form.provinceId,
        desi: form.desi === '' ? 0 : +form.desi,
        amount: form.orderAmount === '' ? 0 : +form.orderAmount,
        contracts,
        routingRules,
        routingWeights,
        shipments,
        carrierInvoices,
        carrierPricing,
        shippingType: 'returnShipping',
        cargoType: 'return',
      })
      if (!decision) {
        setErrors({ companyId: t('shipmentCreate.err_no_eligible_carrier') })
        return
      }
      companyId = decision.chosenCompanyId
      routingDecision = decision
    }

    const prov = getProvince(+form.provinceId)!
    const orderNoVal = Number.isNaN(Number(form.orderNo)) ? form.orderNo : Number(form.orderNo)
    const created = addReturn({
      orderNo: orderNoVal as number,
      companyId,
      desi: form.desi === '' ? undefined : +form.desi,
      orderAmount: form.orderAmount === '' ? undefined : +form.orderAmount,
      routingDecision,
      shipFrom: form.pickup ? 'Adresten Teslim Alma' : 'Şubeden Teslim',
      shipTo: {
        district: form.district,
        province: prov.name,
        addressLine: form.addressLine.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      referenceId: form.referenceId,
      packageNo: form.packageNo,
      customerName: form.customerName.trim(),
      channel: form.channel,
      productType: form.productType || undefined,
      reason: form.reason,
      pickup: form.pickup,
      pickupDate: form.pickup ? form.pickupDate : undefined,
      pickupTimeSlot: form.pickup ? form.pickupSlot : undefined,
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
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">{t('shipmentCreate.section_order')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('shipmentCreate.order_no')} <span className="text-[#fb3748]">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.orderNo ? 'error' : ''}`}
                  value={form.orderNo}
                  placeholder="Örn. 61234599"
                  onChange={(e) => setField('orderNo', e.target.value)}
                />
                {errors.orderNo ? <p className="form-error">{errors.orderNo}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.reference_id')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <input type="text" className="form-input" value={form.referenceId} onChange={(e) => setField('referenceId', e.target.value)} />
              </div>
              <div>
                <label className="form-label">
                  {t('returnCreate.returner_name')} <span className="text-[#fb3748]">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.customerName ? 'error' : ''}`}
                  value={form.customerName}
                  onChange={(e) => setField('customerName', e.target.value)}
                />
                {errors.customerName ? <p className="form-error">{errors.customerName}</p> : null}
              </div>
              <div>
                <label className="form-label">{t('shipmentCreate.channel')}</label>
                <Dropdown
                  value={form.channel}
                  onChange={(v) => setField('channel', v)}
                  options={SHIPMENT_CHANNELS.map((c) => ({ value: c, label: c }))}
                />
              </div>
              <div>
                <label className="form-label">{t('returnCreate.reason')}</label>
                <Dropdown
                  value={form.reason}
                  onChange={(v) => setField('reason', v)}
                  options={RETURN_REASONS.map((k) => ({ value: k, label: t(`returnReason.${k}`) }))}
                />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('shipmentCreate.section_cargo')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('shipmentCreate.desi')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className="form-input"
                  value={form.desi}
                  onChange={(e) => setField('desi', e.target.value)}
                />
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.order_amount')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.order_amount_optional')}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">₺</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    className="form-input form-input-icon-left"
                    value={form.orderAmount}
                    onChange={(e) => setField('orderAmount', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.package_no')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.package_auto')}</span>
                </label>
                <input type="text" className="form-input" value={form.packageNo} onChange={(e) => setField('packageNo', e.target.value)} />
              </div>
              <div className="col-span-2">
                <label className="form-label">
                  {t('shipmentCreate.product_type_section')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <ProductTypePicker value={form.productType} onChange={(v) => setField('productType', v)} />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('returnCreate.section_returner')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('shipmentCreate.province')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.provinceId}
                  value={form.provinceId}
                  onChange={(v) => setProvince(v)}
                  placeholder={t('shipmentCreate.province_placeholder')}
                  options={PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))}
                />
                {errors.provinceId ? <p className="form-error">{errors.provinceId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.district')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.district}
                  value={form.district}
                  disabled={!province}
                  onChange={(v) => setField('district', v)}
                  placeholder={t('shipmentCreate.district_placeholder')}
                  options={(province?.districts ?? []).map((d) => ({ value: d, label: d }))}
                />
                {errors.district ? <p className="form-error">{errors.district}</p> : null}
              </div>
              <div className="col-span-2">
                <label className="form-label">
                  {t('returnCreate.returner_address_line')} <span className="text-[#fb3748]">*</span>
                </label>
                <textarea
                  className={`form-input ${errors.addressLine ? 'error' : ''}`}
                  rows={2}
                  value={form.addressLine}
                  placeholder={t('shipmentCreate.address_line_placeholder')}
                  onChange={(e) => setField('addressLine', e.target.value)}
                />
                {errors.addressLine ? <p className="form-error">{errors.addressLine}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('returnCreate.returner_phone')} <span className="text-[#fb3748]">*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.phone ? 'error' : ''}`}
                  value={form.phone}
                  placeholder="+90 5xx xxx xx xx"
                  onChange={(e) => setField('phone', e.target.value)}
                />
                {errors.phone ? <p className="form-error">{errors.phone}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('returnCreate.returner_email')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <input type="text" className="form-input" value={form.email} onChange={(e) => setField('email', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-3">{t('returnCreate.section_carrier')}</p>

            <div className="flex items-center gap-3 flex-wrap mb-4">
              <SegmentedToggle
                value={form.pickup ? 'pickup' : 'dropoff'}
                onChange={(v) => setDeliveryMethod(v === 'pickup')}
                options={[
                  { value: 'pickup', label: t('returnCreate.delivery_method_pickup'), icon: PICKUP_ICON },
                  { value: 'dropoff', label: t('returnCreate.delivery_method_dropoff'), icon: DROPOFF_ICON },
                ]}
              />
              <span className="text-xs text-neutral-400">
                {form.pickup ? t('returnCreate.delivery_method_pickup_desc') : t('returnCreate.delivery_method_dropoff_desc')}
              </span>
            </div>

            {!form.pickup ? (
              <div style={{ maxWidth: 420 }}>
                <label className="form-label">
                  {t('shipmentCreate.company')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.companyId}
                  value={form.companyId}
                  onChange={(v) => setField('companyId', v)}
                  placeholder={t('shipmentCreate.company_placeholder')}
                  options={companyOptions.map((c) => ({ value: String(c.id), label: c.name }))}
                />
                {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <SegmentedToggle
                    value={form.routingMode}
                    onChange={(v) => setField('routingMode', v)}
                    options={[
                      { value: 'auto', label: t('shipmentCreate.routing_mode_auto'), icon: AUTO_ICON },
                      { value: 'manual', label: t('shipmentCreate.routing_mode_manual'), icon: MANUAL_ICON },
                    ]}
                  />
                  <span className="text-xs text-neutral-400">
                    {form.routingMode === 'auto' ? t('shipmentCreate.routing_mode_auto_desc') : t('shipmentCreate.routing_mode_manual_desc')}
                  </span>
                </div>

                <div style={{ maxWidth: 420 }} className="mb-5">
                  <label className="form-label">
                    {t('shipmentCreate.company')} <span className="text-[#fb3748]">*</span>
                  </label>
                  {form.routingMode === 'manual' ? (
                    <>
                      <Dropdown
                        error={!!errors.companyId}
                        value={form.companyId}
                        onChange={(v) => setField('companyId', v)}
                        placeholder={t('shipmentCreate.company_placeholder')}
                        options={companyOptions.map((c) => ({ value: String(c.id), label: c.name }))}
                      />
                      {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
                    </>
                  ) : (
                    <>
                      <div className={`border rounded-lg p-3.5 bg-neutral-50/50 ${errors.companyId ? 'border-[#fb3748]' : 'border-neutral-200'}`}>
                        {!canPreviewRouting ? (
                          <p className="text-xs text-neutral-400">{t('shipmentCreate.auto_preview_placeholder')}</p>
                        ) : routingPreview === null ? (
                          <p className="text-xs text-[#ad1f2b]">{t('shipmentCreate.auto_preview_none')}</p>
                        ) : (
                          <>
                            <div className="flex items-center justify-between gap-2">
                              <div>
                                <p className="text-[11px] text-neutral-400 mb-0.5">{t('shipmentCreate.auto_preview_label')}</p>
                                <p className="text-sm font-semibold text-neutral-950">{getCompany(routingPreview.chosenCompanyId)?.name}</p>
                              </div>
                              <span className="badge badge-info flex-shrink-0">{t('shipmentCreate.auto_preview_badge')}</span>
                            </div>
                            <p className="text-xs text-neutral-500 mt-2">{t('shipmentCreate.auto_preview_reason_default')}</p>
                          </>
                        )}
                      </div>
                      {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
                    </>
                  )}
                </div>

                <div>
                  <label className="form-label">{t('returnCreate.pickup_schedule_label')}</label>
                  {effectiveCompanyId == null ? (
                    <p className="text-xs text-neutral-400">{t('returnCreate.pickup_schedule_hint')}</p>
                  ) : (
                    <div className="border border-neutral-200 rounded-lg p-3.5 bg-neutral-50/50">
                      <p className="text-[11px] text-neutral-400 mb-2">{t('returnCreate.pickup_day_label')}</p>
                      <div className="flex flex-wrap gap-1.5 mb-1">
                        {pickupDays.map((d) => (
                          <button
                            key={d.date}
                            type="button"
                            onClick={() => setField('pickupDate', d.date)}
                            className={`filter-tab ${form.pickupDate === d.date ? 'active' : ''}`}
                          >
                            {d.label}
                          </button>
                        ))}
                      </div>
                      {errors.pickupDate ? <p className="form-error mb-2">{errors.pickupDate}</p> : null}
                      {selectedPickupDay ? (
                        <div className="mt-3">
                          <p className="text-[11px] text-neutral-400 mb-2">{t('returnCreate.pickup_slot_label')}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPickupDay.slots.map((s) => (
                              <button
                                key={s.key}
                                type="button"
                                onClick={() => setField('pickupSlot', s.key)}
                                className={`filter-tab ${form.pickupSlot === s.key ? 'active' : ''}`}
                              >
                                {s.label}
                              </button>
                            ))}
                          </div>
                          {errors.pickupSlot ? <p className="form-error mt-2">{errors.pickupSlot}</p> : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

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
