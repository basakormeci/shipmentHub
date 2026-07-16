import { useMemo } from 'react'
import { useDataStore } from '../stores/dataStore'
import { useUiStore } from '../stores/uiStore'
import {
  COMPANIES,
  PROVINCES,
  isDamagedFor,
  shipmentDeliveryDays,
  type Shipment,
} from '../data/catalog'
import { StatTile } from '../components/ui/StatTile'
import { Dropdown } from '../components/ui/Dropdown'

function shipmentCost(s: Shipment) {
  return 35 + (s.id % 7) * 8 + (s.cargoType === 'return' ? 15 : 0)
}

function getProvince(id: number) {
  return PROVINCES.find((p) => p.id === id)
}

export function ReportsPage() {
  const shipments = useDataStore((s) => s.shipments)
  const returns = useDataStore((s) => s.returns)
  const dateFrom = useUiStore((s) => s.reportsDateFrom)
  const dateTo = useUiStore((s) => s.reportsDateTo)
  const companyId = useUiStore((s) => s.reportsCompanyId)
  const provinceId = useUiStore((s) => s.reportsProvinceId)
  const setReportsFilter = useUiStore((s) => s.setReportsFilter)

  const filtered = useMemo(() => {
    return shipments.filter((s) => {
      const day = s.shipTime.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (companyId && s.companyId !== +companyId) return false
      if (provinceId) {
        const prov = getProvince(+provinceId)
        if (!prov || s.shipTo.province !== prov.name) return false
      }
      return true
    })
  }, [shipments, dateFrom, dateTo, companyId, provinceId])

  const filteredReturns = useMemo(() => {
    return returns.filter((x) => {
      const day = x.requestDate.slice(0, 10)
      if (dateFrom && day < dateFrom) return false
      if (dateTo && day > dateTo) return false
      if (companyId && x.companyId !== +companyId) return false
      return true
    })
  }, [returns, dateFrom, dateTo, companyId])

  const total = filtered.length
  const delivered = filtered.filter((s) => s.status === 'DeliveredToCustomer' || s.status === 'DeliveredToStore').length
  const returned = filtered.filter((s) => s.status === 'ReturnToSender').length
  const successRate = total ? (delivered / total) * 100 : 0
  const returnRate = total ? (returned / total) * 100 : 0
  const avgDays = total ? filtered.reduce((sum, s) => sum + shipmentDeliveryDays(s), 0) / total : 0
  const totalCost = filtered.reduce((sum, s) => sum + shipmentCost(s), 0)
  const returnCount = filteredReturns.length
  const deliveredList = filtered.filter(
    (s) => s.status === 'DeliveredToCustomer' || s.status === 'DeliveredToStore' || s.status === 'ReturnToSender',
  )
  const damagedCount = deliveredList.filter((s) => isDamagedFor(s.id)).length
  const damagedRate = deliveredList.length ? (damagedCount / deliveredList.length) * 100 : 0

  return (
    <div className="page-container">
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6 flex items-end gap-3 flex-wrap">
        <div>
          <label className="form-label">Başlangıç</label>
          <input
            type="date"
            className="form-input"
            value={dateFrom}
            onChange={(e) => setReportsFilter('reportsDateFrom', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Bitiş</label>
          <input
            type="date"
            className="form-input"
            value={dateTo}
            onChange={(e) => setReportsFilter('reportsDateTo', e.target.value)}
          />
        </div>
        <div style={{ minWidth: 180 }}>
          <label className="form-label">Kargo Firması</label>
          <Dropdown
            value={companyId}
            onChange={(v) => setReportsFilter('reportsCompanyId', v)}
            placeholder="Tümü"
            options={[{ value: '', label: 'Tümü' }, ...COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))]}
          />
        </div>
        <div style={{ minWidth: 160 }}>
          <label className="form-label">Bölge</label>
          <Dropdown
            value={provinceId}
            onChange={(v) => setReportsFilter('reportsProvinceId', v)}
            placeholder="Tümü"
            options={[{ value: '', label: 'Tümü' }, ...PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))]}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatTile label="Toplam Gönderi" value={total} />
        <StatTile label="Ort. Teslimat Süresi" value={avgDays.toFixed(1)} suffix=" gün" />
        <StatTile label="Teslimat Başarı Oranı" value={successRate.toFixed(1)} suffix="%" />
        <StatTile label="İade Oranı" value={returnRate.toFixed(1)} suffix="%" />
        <StatTile label="İade Sayısı" value={returnCount} />
        <StatTile label="Hasarlı Gönderi Oranı" value={damagedRate.toFixed(1)} suffix="%" />
        <StatTile label="Toplam Maliyet" value={`₺${totalCost.toLocaleString('tr-TR')}`} />
      </div>
    </div>
  )
}
