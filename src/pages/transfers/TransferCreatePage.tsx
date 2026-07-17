import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { COMPANIES } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { toast } from '../../lib/toast'
import { getEligibleCompanyIds } from '../../lib/contracts'
import { Dropdown } from '../../components/ui/Dropdown'

type FormErrors = Partial<Record<'dispatchNo' | 'fromNodeId' | 'toNodeId' | 'companyId' | 'desi', string>>

function buildInitial() {
  return {
    dispatchNo: '',
    referenceId: '',
    fromNodeId: '',
    toNodeId: '',
    companyId: '',
    desi: '',
    packageNo: '',
    note: '',
  }
}

export function TransferCreatePage() {
  const t = useT()
  const navigate = useNavigate()
  const nodes = useDataStore((s) => s.nodes)
  const contracts = useDataStore((s) => s.contracts)
  const addTransfer = useDataStore((s) => s.addTransfer)

  const eligibleCompanyIds = new Set(getEligibleCompanyIds(contracts, 'transferShipping'))
  const companyOptions = COMPANIES.filter((c) => eligibleCompanyIds.has(c.id))
  const [form, setForm] = useState(() => buildInitial())
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
    if (!form.dispatchNo.trim()) errs.dispatchNo = t('transferCreate.err_dispatch_no')
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
      dispatchNo: +form.dispatchNo,
      referenceId: form.referenceId,
      fromNodeId: +form.fromNodeId,
      toNodeId: +form.toNodeId,
      companyId: +form.companyId,
      desi: +form.desi,
      packageNo: form.packageNo,
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
                  {t('transferCreate.company')} <span className="text-[#fb3748]">*</span>
                </label>
                <Dropdown
                  error={!!errors.companyId}
                  value={form.companyId}
                  onChange={(v) => setField('companyId', v)}
                  placeholder={t('transferCreate.company_placeholder')}
                  options={companyOptions.map((c) => ({ value: String(c.id), label: c.name }))}
                />
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
