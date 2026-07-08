import { toast } from './toast'

function fallbackCopy(text: string, onDone: () => void) {
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.position = 'fixed'
  ta.style.left = '-9999px'
  document.body.appendChild(ta)
  ta.select()
  try {
    document.execCommand('copy')
    onDone()
  } finally {
    document.body.removeChild(ta)
  }
}

/** Copy text and show success toast (monolith parity). */
export function copyToClipboard(text: string, successMessage = 'Kopyalandı.') {
  const finish = () => toast(successMessage, 'success')
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(String(text)).then(finish).catch(() => fallbackCopy(text, finish))
    return
  }
  fallbackCopy(text, finish)
}
