import { useT } from '../hooks/useT'

interface StubPageProps {
  titleKey: string
  descKey?: string
}

export function StubPage({ titleKey, descKey }: StubPageProps) {
  const t = useT()
  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center">
        <p className="text-sm font-semibold text-neutral-800 mb-1">{t(titleKey)}</p>
        {descKey ? <p className="text-sm text-neutral-500 mb-4">{t(descKey)}</p> : null}
        <p className="text-xs text-neutral-400">{t('coming_soon.desc')}</p>
      </div>
    </div>
  )
}
