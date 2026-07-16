import { getCompany, type ContractCredential, type ContractForm } from '../../data/catalog'
import { useT } from '../../hooks/useT'

function CredCard({
  cred,
  companyId,
  vr,
  showPw,
  onTogglePass,
  onUpdate,
  onDelete,
  onOpenNodes,
}: {
  cred: ContractCredential
  companyId: number | ''
  vr?: 'ok' | 'error'
  showPw: boolean
  onTogglePass: () => void
  onUpdate: (field: keyof ContractCredential, val: string) => void
  onDelete: () => void
  onOpenNodes: () => void
}) {
  const t = useT()
  const co = companyId ? getCompany(+companyId) : undefined
  const fields: string[] = co ? [...co.fields] : []

  const statusBadge =
    vr === 'ok' ? (
      <span className="badge" style={{ background: '#e3f7ec', color: '#178c4e' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        {t('step3.connection_ok')}
      </span>
    ) : vr === 'error' ? (
      <span className="badge" style={{ background: '#ffebec', color: '#681219' }}>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        {t('step3.connection_error')}
      </span>
    ) : null

  const eyeIcon = showPw ? (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  )

  return (
    <div className={`cred-card mb-4 ${vr === 'error' ? 'border-[#ffc0c5]' : ''}`}>
      <div className="flex items-center justify-between px-5 py-3.5 bg-neutral-50 border-b border-neutral-100">
        <div className="flex items-center gap-3 flex-1 min-w-0 mr-3">
          <div className="w-8 h-8 rounded-lg bg-primary-lighter flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-neutral-400 font-medium mb-0.5">{t('step3.credential_name_label')}</p>
            <input
              type="text"
              className="w-full text-sm font-semibold text-neutral-950 bg-transparent outline-none border-b-2 border-transparent hover:border-neutral-300 focus:border-primary transition-colors pb-0.5 placeholder-neutral-300"
              value={cred.name}
              placeholder={t('step3.credential_name_placeholder')}
              onChange={(e) => onUpdate('name', e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {statusBadge}
          <button type="button" className="text-neutral-400 hover:text-[#fb3748] transition-colors p-1" title={t('step3.delete_credential_tooltip')} onClick={onDelete}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      <div className="px-5 py-4 grid grid-cols-2 gap-4">
        {fields.includes('password') ? (
          <div>
            <label className="form-label">{t('step3.password_label')}</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input form-input-icon-right"
                value={cred.password || ''}
                placeholder="••••••••"
                onChange={(e) => onUpdate('password', e.target.value)}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600" onClick={onTogglePass}>
                {eyeIcon}
              </button>
            </div>
          </div>
        ) : null}
        {fields.includes('apiKey') ? (
          <div>
            <label className="form-label">
              {t('step3.api_key_label')} <span className="text-[#fb3748]">*</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="form-input form-input-icon-right"
                value={cred.apiKey || ''}
                placeholder="••••••••••••"
                onChange={(e) => onUpdate('apiKey', e.target.value)}
              />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600" onClick={onTogglePass}>
                {eyeIcon}
              </button>
            </div>
          </div>
        ) : null}
        {fields.includes('customerId') ? (
          <div>
            <label className="form-label">
              {t('step3.customer_id_label')} <span className="text-[#fb3748]">*</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={cred.customerId || ''}
              placeholder={t('step3.customer_id_label')}
              onChange={(e) => onUpdate('customerId', e.target.value)}
            />
          </div>
        ) : null}
      </div>
      {vr === 'error' ? (
        <div className="px-5 pb-4">
          <div className="flex items-center gap-2 bg-[#ffebec] border border-[#ffc0c5] text-[#681219] text-xs px-3 py-2 rounded-lg">
            <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t('step3.connection_error_msg')}
          </div>
        </div>
      ) : null}
      <div className="px-5 pb-4 border-t border-neutral-100 pt-3">
        <button
          type="button"
          className="w-full flex items-center justify-center gap-2 text-sm font-medium text-primary bg-primary-lighter hover:bg-primary-light border border-primary-light rounded-lg py-2.5 transition-colors"
          onClick={onOpenNodes}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M12 5l7 7-7 7" />
          </svg>
          {t('step3.manage_nodes')}
          <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{cred.nodes.length}</span>
        </button>
      </div>
    </div>
  )
}

export function ContractStep3({
  f,
  validationResults,
  showPass,
  onChange,
  onOpenNodeModal,
  onTogglePass,
  onDeleteCred,
}: {
  f: ContractForm
  validationResults: Record<number, 'ok' | 'error'>
  showPass: Record<number, boolean>
  onChange: (credentials: ContractCredential[]) => void
  onOpenNodeModal: (credId: number) => void
  onTogglePass: (credId: number) => void
  onDeleteCred: (credId: number) => void
}) {
  const t = useT()

  function updateCred(id: number, field: keyof ContractCredential, val: string) {
    onChange(f.credentials.map((c) => (c.id === id ? { ...c, [field]: val } : c)))
  }

  return (
    <div>
      <p className="text-sm text-neutral-500 mb-5">{t('step3.desc')}</p>

      {f.credentials.length === 0 ? (
        <div className="text-center py-10 text-neutral-400 border border-dashed border-neutral-200 rounded-lg mb-4">
          <svg className="w-10 h-10 mx-auto mb-2 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          <p className="text-sm">{t('step3.no_credentials')}</p>
        </div>
      ) : (
        f.credentials.map((cred) => (
          <CredCard
            key={cred.id}
            cred={cred}
            companyId={f.companyId}
            vr={validationResults[cred.id]}
            showPw={!!showPass[cred.id]}
            onTogglePass={() => onTogglePass(cred.id)}
            onUpdate={(field, val) => updateCred(cred.id, field, val)}
            onDelete={() => onDeleteCred(cred.id)}
            onOpenNodes={() => onOpenNodeModal(cred.id)}
          />
        ))
      )}

      <button
        type="button"
        className="w-full mt-3 py-3 border-2 border-dashed border-primary-light rounded-lg text-primary hover:border-primary hover:bg-primary-lighter/50 transition-all text-sm font-medium flex items-center justify-center gap-2"
        onClick={() => {
          const id = Math.max(0, ...f.credentials.map((c) => c.id)) + 1
          onChange([
            ...f.credentials,
            {
              id,
              name: `Credential ${f.credentials.length + 1}`,
              password: '',
              apiKey: '',
              customerId: '',
              nodes: [],
            },
          ])
        }}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        {t('step3.add_credential')}
      </button>
    </div>
  )
}
