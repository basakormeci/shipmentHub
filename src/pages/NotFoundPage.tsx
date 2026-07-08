import { Link } from 'react-router-dom'
import { useT } from '../hooks/useT'

export function NotFoundPage() {
  const t = useT()

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-10 text-center">
        <p className="text-5xl font-bold text-neutral-200 mb-3">404</p>
        <p className="text-sm font-semibold text-neutral-800 mb-1">{t('page.not_found')}</p>
        <p className="text-sm text-neutral-500 mb-6 max-w-md mx-auto">{t('page.not_found_desc')}</p>
        <Link to="/dashboard" className="primary-btn inline-flex">
          {t('page.not_found_action')}
        </Link>
      </div>
    </div>
  )
}
