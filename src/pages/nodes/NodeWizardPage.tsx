import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { useUiStore } from '../../stores/uiStore'
import { useT } from '../../hooks/useT'
import { emptyNodeForm, nodeFormFromNode, nodePayloadFromForm, validateNodeStep } from '../../lib/nodes'
import { toast } from '../../lib/toast'
import { NodeStep1 } from './NodeStep1'
import { NodeStep2 } from './NodeStep2'

const STEPS = [
  { labelKey: 'nodeWizard.step1_label', descKey: 'nodeWizard.step1_desc' },
  { labelKey: 'nodeWizard.step2_label', descKey: 'nodeWizard.step2_desc' },
] as const

export function NodeWizardPage() {
  const t = useT()
  const navigate = useNavigate()
  const { nodeId } = useParams()
  const routeEditingId = nodeId ? Number(nodeId) : null

  const nodes = useDataStore((s) => s.nodes)
  const upsertNode = useDataStore((s) => s.upsertNode)
  const wizard = useUiStore((s) => s.nodeWizard)
  const setNodeWizard = useUiStore((s) => s.setNodeWizard)
  const resetNodeWizard = useUiStore((s) => s.resetNodeWizard)

  const [errors, setErrors] = useState<Record<string, string>>({})

  const { step, editingId, f } = wizard
  const isEdit = editingId !== null

  useEffect(() => {
    if (wizard.editingId === routeEditingId) return

    if (routeEditingId != null) {
      const n = nodes.find((x) => x.id === routeEditingId)
      if (n) {
        setNodeWizard({ step: 1, editingId: routeEditingId, f: nodeFormFromNode(n) })
      }
    } else {
      setNodeWizard({ step: 1, editingId: null, f: emptyNodeForm() })
    }
    setErrors({})
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-init only when route id changes
  }, [routeEditingId])

  function updateForm(patch: Partial<typeof f>) {
    setNodeWizard({ f: { ...f, ...patch } })
    const cleared = { ...errors }
    Object.keys(patch).forEach((k) => {
      delete cleared[k]
    })
    setErrors(cleared)
  }

  function nextStep() {
    const errs = validateNodeStep(step, f, t)
    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }
    setErrors({})
    setNodeWizard({ step: step + 1 })
  }

  function prevStep() {
    setErrors({})
    setNodeWizard({ step: step - 1 })
  }

  function saveNode() {
    const payload = nodePayloadFromForm(f)
    const saved = upsertNode({ ...payload, id: editingId ?? undefined })
    toast(
      editingId != null ? t('toast.node_updated', { name: saved.name }) : t('nodes.toast_created', { name: saved.name }),
      'success',
    )
    resetNodeWizard()
    navigate('/nodes')
  }

  return (
    <div className="page-container">
      <div className="mb-5 flex items-center gap-3">
        <Link to="/nodes" className="secondary-btn py-2 px-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          {t('nodeWizard.back_to_list')}
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 flex overflow-hidden" style={{ minHeight: 520 }}>
        <div className="w-60 flex-shrink-0 bg-neutral-50 border-r border-neutral-200 px-6 py-8 flex flex-col">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-widest mb-6">
            {isEdit ? t('nodeWizard.edit_title') : t('nodeWizard.new_title_short')}
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
            {step === 1 ? <NodeStep1 f={f} errors={errors} onChange={updateForm} /> : null}
            {step === 2 ? <NodeStep2 f={f} onChange={updateForm} /> : null}
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
              <span className="text-sm text-neutral-400">{t('nodeWizard.step_indicator', { n: step })}</span>
              {step < STEPS.length ? (
                <button className="primary-btn" type="button" onClick={nextStep}>
                  {t('nodeWizard.next')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ) : (
                <button className="primary-btn" type="button" onClick={saveNode}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? t('common.save') : t('nodeWizard.create_btn')}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
