import { NavLink, useParams } from 'react-router-dom'
import { useDataStore } from '../../stores/dataStore'
import { getCompany, HEALTH_STATUS_META, ERROR_STATUS_META } from '../../data/catalog'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'

const TABS = [
  { key: 'health', label: 'Sağlık Durumu', to: '/monitoring/health' },
  { key: 'errors', label: 'Hata Yönetimi', to: '/monitoring/errors' },
  { key: 'webhooks', label: 'Webhook Kuyruğu', to: '/monitoring/webhooks' },
] as const

function HealthPanel() {
  const carrierHealth = useDataStore((s) => s.carrierHealth)

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-neutral-100 bg-neutral-50">
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ort. Yanıt</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Son Kontrol</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {carrierHealth.map((h) => {
            const co = getCompany(h.companyId)
            const meta = HEALTH_STATUS_META[h.status]
            return (
              <tr key={h.companyId} className="hover:bg-neutral-50/80">
                <td className="px-4 py-3 font-medium text-neutral-700">{co ? co.name : 'Bilinmiyor'}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
                    {meta.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-neutral-500">{h.avgResponseMs !== null ? `${h.avgResponseMs} ms` : '-'}</td>
                <td className="px-4 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(h.lastCheck)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function ErrorsPanel() {
  const errorLogs = useDataStore((s) => s.errorLogs)
  const retryErrorLog = useDataStore((s) => s.retryErrorLog)

  if (errorLogs.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Kayıtlı hata bulunmuyor.</div>
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-neutral-100 bg-neutral-50">
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Gönderi</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Hata Mesajı</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Zaman</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {errorLogs.map((e) => {
            const co = getCompany(e.companyId)
            const meta = ERROR_STATUS_META[e.status]
            return (
              <tr key={e.id} className="hover:bg-neutral-50/80">
                <td className="px-4 py-3 font-medium text-neutral-700">#{e.shipmentNo}</td>
                <td className="px-4 py-3 text-neutral-600">{co ? co.name : 'Bilinmiyor'}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-xs max-w-xs">{e.errorMessage}</td>
                <td className="px-4 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(e.time)}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${meta.badge}`}>{meta.label}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  {e.status !== 'resolved' ? (
                    <button
                      type="button"
                      className="text-xs text-primary hover:text-primary-darker font-medium"
                      onClick={() => {
                        retryErrorLog(e.id)
                        toast(`Gönderi #${e.shipmentNo} için yeniden deneme başlatıldı.`, 'info')
                      }}
                    >
                      Yeniden Dene
                    </button>
                  ) : null}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function WebhooksPanel() {
  const webhookQueue = useDataStore((s) => s.webhookQueue)

  if (webhookQueue.length === 0) {
    return <div className="py-16 text-center text-neutral-400 text-sm">Bekleyen webhook bulunmuyor.</div>
  }

  return (
    <div className="border border-neutral-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-neutral-100 bg-neutral-50">
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Olay Tipi</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Deneme</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sonraki Deneme</th>
            <th className="px-4 py-2.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlem</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {webhookQueue.map((w) => {
            const co = getCompany(w.companyId)
            return (
              <tr key={w.id} className="hover:bg-neutral-50/80">
                <td className="px-4 py-3 font-medium text-neutral-700">{co ? co.name : 'Bilinmiyor'}</td>
                <td className="px-4 py-3 text-neutral-500 font-mono text-xs">{w.eventType}</td>
                <td className="px-4 py-3">
                  <span className="badge badge-warning">{w.attempt}. deneme</span>
                </td>
                <td className="px-4 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(w.nextRetry)}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="text-xs text-primary hover:text-primary-darker font-medium"
                    onClick={() => toast('Webhook yeniden deneniyor...', 'info')}
                  >
                    Şimdi Dene
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export function MonitoringPage() {
  const { tab } = useParams<{ tab: string }>()

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex items-center gap-1.5 px-5 py-3 border-b border-neutral-100">
          {TABS.map((tb) => (
            <NavLink
              key={tb.key}
              to={tb.to}
              className={({ isActive }) => `filter-tab ${isActive || tab === tb.key ? 'active' : ''}`}
            >
              {tb.label}
            </NavLink>
          ))}
        </div>
        <div className="p-5">
          {tab === 'health' ? <HealthPanel /> : tab === 'errors' ? <ErrorsPanel /> : <WebhooksPanel />}
        </div>
      </div>
    </div>
  )
}
