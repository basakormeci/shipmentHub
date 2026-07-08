import { useUiStore } from '../stores/uiStore'
import { translate } from '../i18n'

export function useT() {
  const lang = useUiStore((s) => s.lang)
  return (key: string, vars?: Record<string, string | number>) => translate(lang, key, vars)
}
