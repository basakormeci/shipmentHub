import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES, getCompany, type ShipmentRoutingDecision } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { getEligibleCompanyIds } from '../../lib/contracts'
import { decideCarrier } from '../../lib/carrierRouting'
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

type FormErrors = Partial<Record<'dispatchNo' | 'fromNodeId' | 'toNodeId' | 'companyId', string>>

function buildInitial() {
  return {
    dispatchNo: '',
    referenceId: '',
    fromNodeId: '',
    toNodeId: '',
    routingMode: 'auto' as 'auto' | 'manual',
    companyId: '',
    desi: '',
    packageNo: '',
    productType: '',
    note: '',
  }
}

export function TransferCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const nodes = useDataStore((s) => s.nodes)
  const contracts = useDataStore((s) => s.contracts)
  const routingRules = useDataStore((s) => s.routingRules)
  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const carrierPricing = useDataStore((s) => s.carrierPricing)
  const routingWeights = useUiStore((s) => s.routingWeights)
  const addTransfer = useDataStore((s) => s.addTransfer)

  const eligibleCompanyIds = new Set(getEligibleCompanyIds(contracts, 'transferShipping'))
  const companyOptions = COMPANIES.filter((c) => eligibleCompanyIds.has(c.id))
  const [form, setForm] = useState(() => buildInitial())
  const [errors, setErrors] = useState<FormErrors>({})

  const toNode = form.toNodeId ? nodes.find((n) => n.id === +form.toNodeId) : undefined
  const toProvinceId = toNode?.provinceId ?? null

  const canPreviewRouting = form.routingMode === 'auto' && toProvinceId != null

  const routingPreview = useMemo(() => {
    if (!canPreviewRouting || toProvinceId == null) return null
    return decideCarrier({
      provinceId: toProvinceId,
      desi: form.desi === '' ? 0 : +form.desi,
      amount: 0,
      contracts,
      routingRules,
      routingWeights,
      shipments,
      carrierInvoices,
      carrierPricing,
      shippingType: 'transferShipping',
      cargoType: 'transfer',
      productType: form.productType || undefined,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- canPreviewRouting already encodes the relevant form fields
  }, [
    canPreviewRouting,
    toProvinceId,
    form.desi,
    form.productType,
    contracts,
    routingRules,
    routingWeights,
    shipments,
    carrierInvoices,
    carrierPricing,
  ])

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

  function validate() {
    const errs: FormErrors = {}
    if (!form.dispatchNo.trim()) errs.dispatchNo = t('transferCreate.err_dispatch_no')
    if (!form.fromNodeId) errs.fromNodeId = t('transferCreate.err_from')
    if (!form.toNodeId) errs.toNodeId = t('transferCreate.err_to')
    if (form.fromNodeId && form.toNodeId && +form.fromNodeId === +form.toNodeId) {
      errs.toNodeId = t('transferCreate.err_same_node')
    }
    if (form.routingMode === 'manual' && !form.companyId) errs.companyId = t('shipmentCreate.err_company')
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
    if (form.routingMode === 'auto' && toProvinceId != null) {
      const decision = decideCarrier({
        provinceId: toProvinceId,
        desi: form.desi === '' ? 0 : +form.desi,
        amount: 0,
        contracts,
        routingRules,
        routingWeights,
        shipments,
        carrierInvoices,
        carrierPricing,
        shippingType: 'transferShipping',
        cargoType: 'transfer',
        productType: form.productType || undefined,
      })
      if (!decision) {
        setErrors({ companyId: t('shipmentCreate.err_no_eligible_carrier') })
        toast(t('shipmentCreate.err_no_eligible_carrier'), 'error')
        return
      }
      companyId = decision.chosenCompanyId
      routingDecision = decision
    } else if (form.routingMode === 'manual') {
      companyId = +form.companyId
      routingDecision = {
        mode: 'manual',
        contractEligibleCompanyIds: [],
        matchedRuleId: null,
        matchedRuleName: null,
        matchedRuleSummary: null,
        ruleNarrowedCompanyIds: null,
        excludedCompanyIds: [],
        excludedByRuleNames: [],
        weights: { cost: 0, deliveryTime: 0, successRate: 0, damagedRate: 0, avgPickupHours: 0, costDiffPct: 0 },
        scores: [],
        chosenCompanyId: companyId,
      }
    } else {
      setErrors({ companyId: t('shipmentCreate.err_no_eligible_carrier') })
      toast(t('shipmentCreate.err_no_eligible_carrier'), 'error')
      return
    }

    const created = addTransfer({
      dispatchNo: +form.dispatchNo,
      referenceId: form.referenceId,
      fromNodeId: +form.fromNodeId,
      toNodeId: +form.toNodeId,
      companyId,
      desi: form.desi === '' ? undefined : +form.desi,
      routingDecision,
      packageNo: form.packageNo,
      productType: form.productType || undefined,
      note: form.note,
    })
    toast(t('transferCreate.toast_created', { no: created.transferNo }), 'success')
    setForm(buildInitial())
    setErrors({})
    navigate(`/transfers/${created.id}`)
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/transfers" className="hover:text-neutral-600">
            {t('transferDetail.breadcrumb')}
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{t('transfers.create_btn')}</span>
        </div>
        <Link to="/transfers" className="secondary-btn py-2 px-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('transferDetail.back')}
        </Link>
      </div>
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">{t('transferCreate.section_dispatch')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('transferCreate.dispatch_no')} <span className="text-[#fb3748]">*</span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  className={`form-input ${errors.dispatchNo ? 'error' : ''}`}
                  value={form.dispatchNo}
                  placeholder="Örn. 5100081"
                  onChange={(e) => setField('dispatchNo', e.target.value)}
                />
                {errors.dispatchNo ? <p className="form-error">{errors.dispatchNo}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.reference_id')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <input type="text" className="form-input" value={form.referenceId} onChange={(e) => setField('referenceId', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('transferCreate.section_transfer')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('transferCreate.from_node')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.fromNodeId}
                  value={form.fromNodeId}
                  onChange={(v) => setField('fromNodeId', v)}
                  placeholder={t('transferCreate.node_placeholder')}
                  options={nodes.map((n) => ({ value: String(n.id), label: n.name }))}
                />
                {errors.fromNodeId ? <p className="form-error">{errors.fromNodeId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('transferCreate.to_node')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.toNodeId}
                  value={form.toNodeId}
                  onChange={(v) => setField('toNodeId', v)}
                  placeholder={t('transferCreate.node_placeholder')}
                  options={nodes.map((n) => ({ value: String(n.id), label: n.name }))}
                />
                {errors.toNodeId ? <p className="form-error">{errors.toNodeId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('transferCreate.desi')}{' '}
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
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-3">{t('shipmentCreate.routing_mode_label')}</p>
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
            <div style={{ maxWidth: 420 }}>
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
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('transferCreate.section_notes')}</p>
            <div>
              <label className="form-label">
                {t('transferCreate.note')}{' '}
                <span className="font-normal normal-case text-neutral-400">{t('transferCreate.note_optional')}</span>
              </label>
              <textarea className="form-input" rows={3} value={form.note} onChange={(e) => setField('note', e.target.value)} />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-100">
          <button className="secondary-btn" type="button" onClick={() => navigate('/transfers')}>
            {t('transferCreate.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={submit}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t('transferCreate.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
