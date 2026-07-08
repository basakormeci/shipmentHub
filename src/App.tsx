import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { Toasts } from './components/ui/Toasts'
import { useUiStore } from './stores/uiStore'
import { useEffect } from 'react'
import { translate } from './i18n'

export default function App() {
  const lang = useUiStore((s) => s.lang)

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = translate(lang, 'app.title')
  }, [lang])

  return (
    <>
      <RouterProvider router={router} />
      <Toasts />
    </>
  )
}
