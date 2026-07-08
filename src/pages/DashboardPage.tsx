import { Link } from 'react-router-dom'
import { useDataStore } from '../stores/dataStore'
import { useUiStore } from '../stores/uiStore'
import { getCompany, SHIPMENT_STATUS, STATUS_CHART_COLORS, HEALTH_STATUS_META, shipmentDeliveryDays } from '../data/catalog'
import { fmtDateTimeStr } from '../lib/format'
import { StatTile } from '../components/ui/StatTile'
import { useT } from '../hooks/useT'

export function DashboardPage() {
  const t = useT()
  const shipments = useDataStore((s) => s.shipments)
  const returns = useDataStore((s) => s.returns)
  const health = useDataStore((s) => s.carrierHealth)
  const rules = useDataStore((s) => s.routingRules)
  const errors = useDataStore((s) => s.errorLogs)
  const dateFrom = useUiStore((s) => s.dashboardDateFrom)
  const dateTo = useUiStore((s) => s.dashboardDateTo)
  const setFrom = useUiStore((s) => s.setDashboardDateFrom)
  const setTo = useUiStore((s) => s.setDashboardDateTo)

  const filtered = shipments.filter((s) => {
    const day = s.shipTime.slice(0, 10)
    if (dateFrom && day < dateFrom) return false
    if (dateTo && day > dateTo) return false
    return true
  })

  const totalShipments = filtered.length || shipments.length
  const base = filtered.length ? filtered : shipments
  const delivered = base.filter((s) => s.status === 'delivered').length
  const successRate = base.length ? ((delivered / base.length) * 100).toFixed(1) : '0'
  const avgDays = base.length
    ? (base.reduce((sum, s) => sum + shipmentDeliveryDays(s), 0) / base.length).toFixed(1)
    : '0'
  const activeReturns = returns.filter((r) => r.status !== 'completed' && r.status !== 'cancelled').length
  const healthUp = health.filter((h) => h.status === 'up').length
  const activeRules = rules.filter((r) => r.active).length
  const criticalErrors = errors.filter((e) => e.status === 'manual').length
  const recent = [...base].sort((a, b) => +new Date(b.shipTime) - +new Date(a.shipTime)).slice(0, 5)
  const byStatus: Record<string, number> = {}
  base.forEach((s) => {
    byStatus[s.status] = (byStatus[s.status] || 0) + 1
  })
  const maxStatus = Math.max(1, ...Object.values(byStatus))
  const unhealthy = health.filter((h) => h.status !== 'up')

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 flex items-end gap-3 flex-wrap">
        <div>
          <label className="form-label">Başlangıç</label>
          <input type="date" className="form-input" value={dateFrom} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div>
          <label className="form-label">Bitiş</label>
          <input type="date" className="form-input" value={dateTo} onChange={(e) => setTo(e.target.value)} />
        </div>
        {(dateFrom || dateTo) && (
          <button
            type="button"
            className="text-xs text-primary hover:text-primary-darker font-medium mb-2.5"
            onClick={() => {
              setFrom('')
              setTo('')
            }}
          >
            Filtreyi Temizle
          </button>
        )}
        <span className="text-xs text-neutral-400 mb-2.5">Gönderi widget’ları seçilen tarih aralığına göre hesaplanır.</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatTile label="Toplam Gönderi" value={totalShipments} />
        <StatTile label="Teslimat Başarı Oranı" value={successRate} suffix="%" />
        <StatTile label="Ort. Teslimat Süresi" value={avgDays} suffix=" gün" />
        <StatTile label="Aktif İade Talebi" value={activeReturns} />
        <StatTile label="Taşıyıcı Sağlığı" value={`${healthUp}/${health.length}`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-950">Son Gönderiler</p>
            <Link className="text-xs text-primary hover:text-primary-darker font-medium" to="/shipments">
              Tümünü Gör →
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-100">
                <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase">Gönderi #</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase">Müşteri</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase">Kargo Firması</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase">Durum</th>
                <th className="px-5 py-2.5 text-xs font-semibold text-neutral-400 uppercase">Zaman</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {recent.map((s) => {
                const co = getCompany(s.companyId)
                return (
                  <tr key={s.id} className="hover:bg-neutral-50/80">
                    <td className="px-5 py-3">
                      <Link className="text-primary font-semibold" to={`/shipments/${s.id}`}>
                        #{s.shipmentNo}
                      </Link>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{s.customerName}</td>
                    <td className="px-5 py-3 text-neutral-500">{co?.name ?? t('common.unknown')}</td>
                    <td className="px-5 py-3">
                      <span className={`badge ${SHIPMENT_STATUS[s.status].badge}`}>{t(`status.${s.status}`)}</span>
                    </td>
                    <td className="px-5 py-3 text-neutral-400 text-xs">{fmtDateTimeStr(s.shipTime)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-5">
          <p className="text-sm font-semibold text-neutral-950 mb-4">Dikkat Gerektirenler</p>
          <div className="flex flex-col gap-2">
            {unhealthy.map((h) => {
              const co = getCompany(h.companyId)
              const meta = HEALTH_STATUS_META[h.status]
              return (
                <Link
                  key={h.companyId}
                  to="/monitoring/health"
                  className="flex items-center gap-2.5 p-2.5 rounded-lg bg-neutral-50/60 hover:bg-neutral-100 transition-colors"
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: meta.dot }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-neutral-700 truncate">{co?.name}</p>
                    <p className="text-[11px] text-neutral-400">{meta.label}</p>
                  </div>
                </Link>
              )
            })}
            {criticalErrors > 0 && (
              <Link to="/monitoring/errors" className="flex items-center gap-2.5 p-2.5 rounded-lg bg-[#ffebec] hover:bg-[#ffdde0] transition-colors">
                <p className="text-xs font-medium text-[#681219]">{criticalErrors} gönderi manuel müdahale bekliyor</p>
              </Link>
            )}
            {unhealthy.length === 0 && criticalErrors === 0 && (
              <p className="text-xs text-neutral-400 text-center py-4">Tüm sistemler normal çalışıyor</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-5">
          <p className="text-sm font-semibold text-neutral-950 mb-4">Gönderi Durum Dağılımı</p>
          <div className="flex flex-col gap-3">
            {Object.entries(byStatus).map(([key, count]) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-neutral-600 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS_CHART_COLORS[key as keyof typeof STATUS_CHART_COLORS] }} />
                    {t(`status.${key}`)}
                  </span>
                  <span className="text-xs font-semibold text-neutral-700">{count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(count / maxStatus) * 100}%`,
                      background: STATUS_CHART_COLORS[key as keyof typeof STATUS_CHART_COLORS],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-neutral-200 p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-semibold text-neutral-950">Akıllı Yönlendirme Kuralları</p>
            <Link className="text-xs text-primary hover:text-primary-darker font-medium" to="/routing/rules">
              Tümünü Gör →
            </Link>
          </div>
          <p className="text-xs text-neutral-400 mb-3">
            {activeRules} / {rules.length} kural aktif
          </p>
          <div className="flex flex-col gap-2">
            {[...rules]
              .sort((a, b) => a.priority - b.priority)
              .slice(0, 4)
              .map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50/60">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-bold flex items-center justify-center">
                      {rule.priority}
                    </span>
                    <span className="text-xs font-medium text-neutral-700 truncate">{rule.name}</span>
                  </div>
                  <span className={`badge ${rule.active ? 'badge-active' : 'badge-passive'}`}>{rule.active ? 'Aktif' : 'Pasif'}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
