import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPANIES, PROVINCES } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { SHIPMENT_CHANNELS } from '../../lib/shipments'
import { Dropdown } from '../../components/ui/Dropdown'

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

type FormErrors = Partial<
  Record<'orderNo' | 'companyId' | 'customerName' | 'shipFrom' | 'provinceId' | 'district' | 'addressLine' | 'phone', string>
>

const INITIAL = {
  orderNo: '',
  companyId: '',
  customerName: '',
  shipFrom: '',
  provinceId: '',
  district: '',
  addressLine: '',
  phone: '',
  email: '',
  deliveryNote: '',
  referenceId: '',
  packageNo: '',
  channel: 'Kendi Web Sitesi',
}

export function ShipmentCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const nodes = useDataStore((s) => s.nodes)
  const addShipment = useDataStore((s) => s.addShipment)

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})

  const province = form.provinceId ? getProvince(+form.provinceId) : undefined

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

  function reset() {
    setForm(INITIAL)
    setErrors({})
  }

  function validate() {
    const errs: FormErrors = {}
    if (!form.orderNo.trim()) errs.orderNo = t('shipmentCreate.err_order_no')
    if (!form.companyId) errs.companyId = t('shipmentCreate.err_company')
    if (!form.customerName.trim()) errs.customerName = t('shipmentCreate.err_customer')
    if (!form.shipFrom) errs.shipFrom = t('shipmentCreate.err_ship_from')
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
    const prov = getProvince(+form.provinceId)!
    const orderNoVal = Number.isNaN(Number(form.orderNo)) ? form.orderNo : Number(form.orderNo)
    const created = addShipment({
      orderNo: orderNoVal as number,
      companyId: +form.companyId,
      shipFrom: form.shipFrom,
      shipTo: {
        district: form.district,
        province: prov.name,
        addressLine: form.addressLine.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
      },
      cargoType: 'order',
      deliveryNote: form.deliveryNote.trim(),
      referenceId: form.referenceId,
      packageNo: form.packageNo,
      customerName: form.customerName.trim(),
      channel: form.channel,
    })
    toast(t('shipmentCreate.toast_created', { no: created.shipmentNo }), 'success')
    reset()
    navigate(`/shipments/${created.id}`)
  }

  return (
    <div className="page-container">
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
                  {t('shipmentCreate.customer_name')} <span className="text-[#fb3748]">*</span>
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
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('shipmentCreate.section_cargo')}</p>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="form-label">
                  {t('shipmentCreate.company')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.companyId}
                  value={form.companyId}
                  onChange={(v) => setField('companyId', v)}
                  placeholder={t('shipmentCreate.company_placeholder')}
                  options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
                />
                {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.ship_from')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.shipFrom}
                  value={form.shipFrom}
                  onChange={(v) => setField('shipFrom', v)}
                  placeholder={t('shipmentCreate.ship_from_placeholder')}
                  options={nodes.map((n) => ({ value: n.name, label: n.name }))}
                />
                {errors.shipFrom ? <p className="form-error">{errors.shipFrom}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.package_no')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.package_auto')}</span>
                </label>
                <input type="text" className="form-input" value={form.packageNo} onChange={(e) => setField('packageNo', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('shipmentCreate.section_address')}</p>
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
                  {t('shipmentCreate.address_line')} <span className="text-[#fb3748]">*</span>
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
                  {t('shipmentCreate.recipient_phone')} <span className="text-[#fb3748]">*</span>
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
                  {t('shipmentCreate.recipient_email')}{' '}
                  <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
                </label>
                <input type="text" className="form-input" value={form.email} onChange={(e) => setField('email', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('shipmentCreate.section_notes')}</p>
            <div>
              <label className="form-label">
                {t('shipmentCreate.delivery_note')}{' '}
                <span className="font-normal normal-case text-neutral-400">{t('shipmentCreate.reference_optional')}</span>
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={form.deliveryNote}
                onChange={(e) => setField('deliveryNote', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-neutral-100">
          <button className="secondary-btn" type="button" onClick={reset}>
            {t('shipmentCreate.reset')}
          </button>
          <button className="primary-btn" type="button" onClick={submit}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            {t('shipmentCreate.submit')}
          </button>
        </div>
      </div>
    </div>
  )
}
