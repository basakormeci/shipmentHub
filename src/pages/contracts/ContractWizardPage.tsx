import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import {
  contractFormFromContract,
  contractPayloadFromForm,
  emptyContractForm,
  validateContractStep,
} from '../../lib/contracts'
import { toast } from '../../lib/toast'
import { ContractStep1 } from './ContractStep1'
import { ContractStep2 } from './ContractStep2'
import { ContractStep3 } from './ContractStep3'
import { ContractNodeModal } from './ContractModals'
import type { ContractForm } from '../../data/catalog'

const STEPS = [
  { labelKey: 'wizard.step1_label', descKey: 'wizard.step1_desc' },
  { labelKey: 'wizard.step2_label', descKey: 'wizard.step2_desc' },
  { labelKey: 'wizard.step3_label', descKey: 'wizard.step3_desc' },
] as const

export function ContractWizardPage() {
  const t = useT()
  const navigate = useNavigate()
  const { contractId } = useParams()
  const routeEditingId = contractId ? Number(contractId) : null

  const contracts = useDataStore((s) => s.contracts)
  const upsertContract = useDataStore((s) => s.upsertContract)
  const wizard = useUiStore((s) => s.contractWizard)
  const setContractWizard = useUiStore((s) => s.setContractWizard)
  const resetContractWizard = useUiStore((s) => s.resetContractWizard)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [validating, setValidating] = useState(false)
  const [validationResults, setValidationResults] = useState<Record<number, 'ok' | 'error'>>({})
  const [showPass, setShowPass] = useState<Record<number, boolean>>({})
  const [nodeModalCredId, setNodeModalCredId] = useState<number | null>(null)

  const { step, editingId, f } = wizard
  const isEdit = editingId !== null

  useEffect(() => {
    if (wizard.editingId === routeEditingId) return

    if (routeEditingId != null) {
      const c = contracts.find((x) => x.id === routeEditingId)
      if (c) {
        setContractWizard({ step: 1, editingId: routeEditingId, f: contractFormFromContract(c) })
      }
    } else {
      setContractWizard({ step: 1, editingId: null, f: emptyContractForm() })
    }
    setErrors({})
    setValidationResults({})
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init only when route id changes
  }, [routeEditingId])

  function updateForm(patch: Partial<ContractForm>) {
    setContractWizard({ f: { ...f, ...patch } })
    const cleared = { ...errors }
    Object.keys(patch).forEach((k) => {
      delete cleared[k]
    })
    if (patch.orderShipping !== undefined || patch.returnShipping !== undefined) {
      delete cleared.shippingType
    }
    setErrors(cleared)
  }

  function nextStep() {
    const errs = validateContractStep(step, f, t)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setContractWizard({ step: step + 1 })
  }

  function prevStep() {
    setErrors({})
    setContractWizard({ step: step - 1 })
  }

  function saveContract() {
    setValidating(true)
    setValidationResults({})

    const creds = f.credentials
    if (creds.length === 0) {
      finalizeSave()
      return
    }

    let done = 0
    let allOk = true
    const results: Record<number, 'ok' | 'error'> = {}

    creds.forEach((cred) => {
      const delay = 800 + Math.random() * 1000
      const ok = Math.random() > 0.15
      setTimeout(() => {
        results[cred.id] = ok ? 'ok' : 'error'
        if (!ok) allOk = false
        done++
        setValidationResults({ ...results })
        if (done === creds.length) {
          setValidating(false)
          if (allOk) {
            finalizeSave()
          } else {
            toast(t('toast.credential_api_error'), 'error')
          }
        }
      }, delay)
    })
  }

  function finalizeSave() {
    const payload = contractPayloadFromForm(f, editingId, contracts)
    const saved = upsertContract({ ...payload, id: editingId ?? undefined })
    toast(
      editingId != null
        ? t('toast.contract_updated', { name: saved.name })
        : t('toast.contract_created', { name: saved.name }),
      'success',
    )
    resetContractWizard()
    navigate('/contracts')
  }

  function deleteCred(id: number) {
    const cred = f.credentials.find((c) => c.id === id)
    if (!cred) return
    if (cred.nodes.length > 0) {
      const ok = window.confirm(t('toast.confirm_delete_credential', { name: cred.name, n: cred.nodes.length }))
      if (!ok) return
    }
    updateForm({ credentials: f.credentials.filter((c) => c.id !== id) })
  }

  return (
    <div className="page-container">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/contracts" className="secondary-btn py-2 px-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('wizard.back_to_list')}
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 flex overflow-hidden" style={{ minHeight: 520 }}>
        <div className="w-60 flex-shrink-0 bg-neutral-50 border-r border-neutral-200 px-6 py-8 flex flex-col">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">
            {isEdit ? t('wizard.edit_title') : t('wizard.new_title_short')}
          </p>
          <div className="flex flex-col">
            {STEPS.map((s, i) => {
              const n = i + 1
              const st = n < step ? 'done' : n === step ? 'active' : 'pending'
              const isLast = i === STEPS.length - 1
              return (
                <div key={s.labelKey} className="flex gap-3.5">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`step-circle ${st}`}>
                      {st === 'done' ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        n
                      )}
                    </div>
                    {!isLast ? (
                      <div className={`w-px flex-1 my-2 ${st === 'done' ? 'bg-primary-light' : 'bg-neutral-200'}`} style={{ minHeight: 36 }} />
                    ) : null}
                  </div>
                  <div className={isLast ? 'pt-1' : 'pb-8 pt-1'}>
                    <p className={`text-sm font-semibold leading-snug ${st === 'pending' ? 'text-neutral-400' : st === 'active' ? 'text-primary-dark' : 'text-neutral-950'}`}>
                      {t(s.labelKey)}
                    </p>
                    <p className={`text-xs mt-0.5 leading-relaxed ${st === 'pending' ? 'text-neutral-300' : 'text-neutral-400'}`}>{t(s.descKey)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 px-8 py-8 overflow-y-auto">
            {step === 1 ? <ContractStep1 f={f} errors={errors} onChange={updateForm} /> : null}
            {step === 2 ? <ContractStep2 f={f} onChange={updateForm} /> : null}
            {step === 3 ? (
              <ContractStep3
                f={f}
                validationResults={validationResults}
                showPass={showPass}
                onChange={(credentials) => updateForm({ credentials })}
                onOpenNodeModal={setNodeModalCredId}
                onTogglePass={(id) => setShowPass((prev) => ({ ...prev, [id]: !prev[id] }))}
                onDeleteCred={deleteCred}
              />
            ) : null}
          </div>

          <div className="flex items-center justify-between px-8 py-4 border-t border-neutral-100 bg-neutral-50/60">
            <div>
              {step > 1 ? (
                <button className="secondary-btn" type="button" onClick={prevStep}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {t('common.back')}
                </button>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-400">{t('wizard.step_indicator', { n: step })}</span>
              {step < 3 ? (
                <button className="primary-btn" type="button" onClick={nextStep}>
                  {t('wizard.next')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button className="primary-btn" type="button" onClick={saveContract} disabled={validating}>
                  {validating ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t('wizard.validating')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {t('common.save')}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {nodeModalCredId != null ? (
        <ContractNodeModal
          credId={nodeModalCredId}
          f={f}
          onUpdate={(credentials) => updateForm({ credentials })}
          onClose={() => setNodeModalCredId(null)}
        />
      ) : null}
    </div>
  )
}
