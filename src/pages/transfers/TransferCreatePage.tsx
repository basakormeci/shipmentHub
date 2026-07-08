import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { COMPANIES } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'

type FormErrors = Partial<Record<'fromNodeId' | 'toNodeId' | 'companyId' | 'desi', string>>

const INITIAL = {
  fromNodeId: '',
  toNodeId: '',
  companyId: '',
  desi: '',
  note: '',
}

export function TransferCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const nodes = useDataStore((s) => s.nodes)
  const addTransfer = useDataStore((s) => s.addTransfer)

  const [form, setForm] = useState(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})

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
    if (!form.fromNodeId) errs.fromNodeId = t('transferCreate.err_from')
    if (!form.toNodeId) errs.toNodeId = t('transferCreate.err_to')
    if (form.fromNodeId && form.toNodeId && +form.fromNodeId === +form.toNodeId) {
      errs.toNodeId = t('transferCreate.err_same_node')
    }
    if (!form.companyId) errs.companyId = t('transferCreate.err_company')
    if (!form.desi || +form.desi <= 0) errs.desi = t('transferCreate.err_desi')
    return errs
  }

  function submit() {
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    const created = addTransfer({
      fromNodeId: +form.fromNodeId,
      toNodeId: +form.toNodeId,
      companyId: +form.companyId,
      desi: +form.desi,
      note: form.note,
    })
    toast(t('transferCreate.toast_created', { no: created.transferNo }), 'success')
    setForm(INITIAL)
    setErrors({})
    navigate(`/transfers/${created.id}`)
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="form-label">
              {t('transferCreate.from_node')} <span className="text-[#fb3748]">*</span>
            </label>
            <select
              className={`form-input ${errors.fromNodeId ? 'error' : ''}`}
              value={form.fromNodeId}
              onChange={(e) => setField('fromNodeId', e.target.value)}
            >
              <option value="">{t('transferCreate.node_placeholder')}</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            {errors.fromNodeId ? <p className="form-error">{errors.fromNodeId}</p> : null}
          </div>
          <div>
            <label className="form-label">
              {t('transferCreate.to_node')} <span className="text-[#fb3748]">*</span>
            </label>
            <select
              className={`form-input ${errors.toNodeId ? 'error' : ''}`}
              value={form.toNodeId}
              onChange={(e) => setField('toNodeId', e.target.value)}
            >
              <option value="">{t('transferCreate.node_placeholder')}</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.name}
                </option>
              ))}
            </select>
            {errors.toNodeId ? <p className="form-error">{errors.toNodeId}</p> : null}
          </div>
          <div>
            <label className="form-label">
              {t('transferCreate.company')} <span className="text-[#fb3748]">*</span>
            </label>
            <select
              className={`form-input ${errors.companyId ? 'error' : ''}`}
              value={form.companyId}
              onChange={(e) => setField('companyId', e.target.value)}
            >
              <option value="">{t('transferCreate.company_placeholder')}</option>
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
              {t('transferCreate.desi')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              className={`form-input ${errors.desi ? 'error' : ''}`}
              value={form.desi}
              onChange={(e) => setField('desi', e.target.value)}
            />
            {errors.desi ? <p className="form-error">{errors.desi}</p> : null}
          </div>
          <div className="col-span-2">
            <label className="form-label">
              {t('transferCreate.note')}{' '}
              <span className="font-normal normal-case text-neutral-400">{t('transferCreate.note_optional')}</span>
            </label>
            <textarea className="form-input" rows={3} value={form.note} onChange={(e) => setField('note', e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
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
