import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RETURN_REASONS, SHIPMENT_STATUS, getCompany } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { getOriginalShipment } from '../../lib/returns'
import { Dropdown } from '../../components/ui/Dropdown'

const INITIAL = {
  originalShipmentId: '',
  reason: 'begenmedim',
  pickup: true,
  note: '',
}

export function ReturnCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const shipments = useDataStore((s) => s.shipments)
  const addReturn = useDataStore((s) => s.addReturn)

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState<{ originalShipmentId?: string }>({})

  const orig = form.originalShipmentId ? getOriginalShipment(shipments, +form.originalShipmentId) : null
  const statusLabel = (key: string) => t(`status.${key}`)

  function setField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'originalShipmentId' && errors.originalShipmentId) {
      setErrors({})
    }
  }

  function reset() {
    setForm(INITIAL)
    setErrors({})
  }

  function submit() {
    if (!form.originalShipmentId) {
      setErrors({ originalShipmentId: t('returnCreate.err_shipment') })
      return
    }
    const created = addReturn({
      originalShipmentId: +form.originalShipmentId,
      reason: form.reason,
      pickup: form.pickup,
      note: form.note,
    })
    toast(t('returnCreate.toast_created', { no: created.returnNo }), 'success')
    reset()
    navigate(`/returns/${created.id}`)
  }

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 p-6 max-w-2xl">
        <div className="flex flex-col gap-5">
          <div>
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

          {orig ? (
            <div className="border border-neutral-100 rounded-lg p-4 bg-neutral-50/50 grid grid-cols-2 gap-3 text-sm">
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

          <div>
            <label className="form-label">{t('returnCreate.reason')}</label>
            <Dropdown
              value={form.reason}
              onChange={(v) => setField('reason', v)}
              options={Object.keys(RETURN_REASONS).map((k) => ({ value: k, label: t(`returnReason.${k}`) }))}
            />
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

          <div>
            <label className="form-label">
              {t('returnCreate.note')}{' '}
              <span className="font-normal normal-case text-neutral-400">{t('returnCreate.note_optional')}</span>
            </label>
            <textarea className="form-input" rows={3} value={form.note} onChange={(e) => setField('note', e.target.value)} />
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
