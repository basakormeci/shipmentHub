import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPANIES, PROVINCES } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { SHIPMENT_CHANNELS } from '../../lib/shipments'

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

type FormErrors = Partial<Record<'orderNo' | 'companyId' | 'customerName' | 'shipFrom' | 'provinceId' | 'district', string>>

const INITIAL = {
  orderNo: '',
  companyId: '',
  cargoType: 'order' as 'order' | 'return',
  customerName: '',
  shipFrom: '',
  provinceId: '',
  district: '',
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
      shipTo: { district: form.district, province: prov.name },
      cargoType: form.cargoType,
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
                <select className="form-input" value={form.channel} onChange={(e) => setField('channel', e.target.value)}>
                  {SHIPMENT_CHANNELS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
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
                <select
                  className={`form-input ${errors.companyId ? 'error' : ''}`}
                  value={form.companyId}
                  onChange={(e) => setField('companyId', e.target.value)}
                >
                  <option value="">{t('shipmentCreate.company_placeholder')}</option>
                  {COMPANIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.companyId ? <p className="form-error">{errors.companyId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.ship_from')} <span className="text-[#fb3748]">*</span>
                </label>
                <select
                  className={`form-input ${errors.shipFrom ? 'error' : ''}`}
                  value={form.shipFrom}
                  onChange={(e) => setField('shipFrom', e.target.value)}
                >
                  <option value="">{t('shipmentCreate.ship_from_placeholder')}</option>
                  {nodes.map((n) => (
                    <option key={n.id} value={n.name}>
                      {n.name}
                    </option>
                  ))}
                </select>
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
                <select
                  className={`form-input ${errors.provinceId ? 'error' : ''}`}
                  value={form.provinceId}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="">{t('shipmentCreate.province_placeholder')}</option>
                  {PROVINCES.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                {errors.provinceId ? <p className="form-error">{errors.provinceId}</p> : null}
              </div>
              <div>
                <label className="form-label">
                  {t('shipmentCreate.district')} <span className="text-[#fb3748]">*</span>
                </label>
                <select
                  className={`form-input ${errors.district ? 'error' : ''}`}
                  value={form.district}
                  disabled={!province}
                  onChange={(e) => setField('district', e.target.value)}
                >
                  <option value="">{t('shipmentCreate.district_placeholder')}</option>
                  {(province?.districts ?? []).map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
                {errors.district ? <p className="form-error">{errors.district}</p> : null}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            <div className="h-px bg-neutral-100 my-1" />
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-4">{t('shipmentCreate.section_type')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className={`p-4 rounded-lg border text-left transition-colors ${form.cargoType === 'order' ? 'border-primary bg-primary-lighter' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
                onClick={() => setField('cargoType', 'order')}
              >
                <p className={`text-sm font-medium ${form.cargoType === 'order' ? 'text-primary-darker' : 'text-neutral-700'}`}>
                  {t('shipmentCreate.type_order')}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{t('shipmentCreate.type_order_desc')}</p>
              </button>
              <button
                type="button"
                className={`p-4 rounded-lg border text-left transition-colors ${form.cargoType === 'return' ? 'border-primary bg-primary-lighter' : 'border-neutral-200 bg-white hover:bg-neutral-50'}`}
                onClick={() => setField('cargoType', 'return')}
              >
                <p className={`text-sm font-medium ${form.cargoType === 'return' ? 'text-primary-darker' : 'text-neutral-700'}`}>
                  {t('shipmentCreate.type_return')}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">{t('shipmentCreate.type_return_desc')}</p>
              </button>
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
