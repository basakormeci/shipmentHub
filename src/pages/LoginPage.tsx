import { useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { useT } from '../hooks/useT'
import { BrandLogo } from '../components/BrandLogo'

export function LoginPage() {
  const t = useT()
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorKey, setErrorKey] = useState('')

  const from =
    (location.state as { from?: string } | null)?.from &&
    (location.state as { from: string }).from !== '/login'
      ? (location.state as { from: string }).from
      : '/dashboard'

  function submit() {
    const result = login(email, password)
    if (!result.ok) {
      setErrorKey(result.error)
      return
    }
    setErrorKey('')
    navigate(from, { replace: true })
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') submit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-6">
          <BrandLogo height={36} align="center" showProductName productName="Shipment Hub" />
        </div>
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h1 className="text-[15px] font-semibold text-neutral-950 mb-1">{t('login.title')}</h1>
          <p className="text-xs text-neutral-400 mb-5">{t('login.subtitle')}</p>
          <div className="flex flex-col gap-4">
            <div>
              <label className="form-label">{t('login.email')}</label>
              <input
                type="text"
                inputMode="email"
                className={`form-input ${errorKey ? 'error' : ''}`}
                placeholder="ornek@omnitive.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setErrorKey('')
                }}
                onKeyDown={onKeyDown}
              />
            </div>
            <div>
              <label className="form-label">{t('login.password')}</label>
              <input
                type="password"
                className={`form-input ${errorKey ? 'error' : ''}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setErrorKey('')
                }}
                onKeyDown={onKeyDown}
              />
            </div>
            {errorKey ? <p className="form-error">{t(errorKey)}</p> : null}
            <button className="primary-btn justify-center" style={{ width: '100%' }} type="button" onClick={submit}>
              {t('login.submit')}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
