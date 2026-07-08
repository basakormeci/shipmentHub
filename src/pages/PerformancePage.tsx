import { useMemo } from 'react'
import { useDataStore } from '../stores/dataStore'
import {
  getCompany,
  isDamagedFor,
  pickupTimeHoursFor,
  plannedDeliveryDate,
  actualDeliveryDate,
  type Shipment,
} from '../data/catalog'
import { StatTile } from '../components/ui/StatTile'

export function computeCarrierPerformance(
  shipments: Shipment[],
  carrierInvoices: { companyId: number; realCost: number; expectedCost: number }[],
) {
  const byCompany: Record<
    number,
    { total: number; delivered: number; damaged: number; onTime: number; pickupSum: number }
  > = {}

  shipments.forEach((s) => {
    if (!byCompany[s.companyId]) {
      byCompany[s.companyId] = { total: 0, delivered: 0, damaged: 0, onTime: 0, pickupSum: 0 }
    }
    const b = byCompany[s.companyId]
    b.total++
    b.pickupSum += pickupTimeHoursFor(s.id)
    if (s.status === 'delivered' || s.status === 'returned') {
      b.delivered++
      if (isDamagedFor(s.id)) b.damaged++
      const actual = actualDeliveryDate(s)
      if (actual && new Date(actual) <= new Date(plannedDeliveryDate(s))) b.onTime++
    }
  })

  return Object.keys(byCompany)
    .map((cid) => {
      const b = byCompany[+cid]
      const co = getCompany(+cid)
      const invoices = carrierInvoices.filter((i) => i.companyId === +cid)
      const costBalance = invoices.reduce((sum, i) => sum + (i.realCost - i.expectedCost), 0)
      const totalExpected = invoices.reduce((sum, i) => sum + i.expectedCost, 0)
      const costDiffPct = totalExpected ? (costBalance / totalExpected) * 100 : 0
      return {
        companyId: +cid,
        companyName: co ? co.name : 'Bilinmiyor',
        total: b.total,
        successRate: b.total ? b.delivered / b.total : 0,
        damagedRate: b.delivered ? b.damaged / b.delivered : 0,
        otdRate: b.delivered ? b.onTime / b.delivered : 0,
        avgPickupHours: b.total ? b.pickupSum / b.total : 0,
        costDiffPct,
      }
    })
    .sort((a, b) => b.total - a.total)
}

export function PerformancePage() {
  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)

  const rows = useMemo(
    () => computeCarrierPerformance(shipments, carrierInvoices),
    [shipments, carrierInvoices],
  )

  const totalShipments = shipments.length
  const totalDelivered = shipments.filter((s) => s.status === 'delivered' || s.status === 'returned').length
  const totalDamaged = shipments.filter(
    (s) => isDamagedFor(s.id) && (s.status === 'delivered' || s.status === 'returned'),
  ).length
  const totalOnTime = shipments.filter((s) => {
    if (s.status !== 'delivered' && s.status !== 'returned') return false
    const actual = actualDeliveryDate(s)
    return actual && new Date(actual) <= new Date(plannedDeliveryDate(s))
  }).length

  const overallSuccess = totalShipments ? (totalDelivered / totalShipments) * 100 : 0
  const overallDamaged = totalDelivered ? (totalDamaged / totalDelivered) * 100 : 0
  const overallOtd = totalDelivered ? (totalOnTime / totalDelivered) * 100 : 0
  const overallPickup = totalShipments
    ? shipments.reduce((sum, s) => sum + pickupTimeHoursFor(s.id), 0) / totalShipments
    : 0
  const overallCostBalance = carrierInvoices.reduce((sum, i) => sum + (i.realCost - i.expectedCost), 0)
  const overallExpected = carrierInvoices.reduce((sum, i) => sum + i.expectedCost, 0)
  const overallCostDiffPct = overallExpected ? (overallCostBalance / overallExpected) * 100 : 0

  return (
    <div className="page-container">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <StatTile label="Başarılı Teslimat Oranı" value={overallSuccess.toFixed(1)} suffix="%" />
        <StatTile label="Hasarlı Teslimat Oranı" value={overallDamaged.toFixed(1)} suffix="%" />
        <StatTile label="Zamanında Teslimat (OTD)" value={overallOtd.toFixed(1)} suffix="%" />
        <StatTile label="Ort. Toplama Süresi" value={overallPickup.toFixed(1)} suffix=" saat" />
        <StatTile
          label="Beklenen-Gerçek Fark"
          value={`${overallCostDiffPct >= 0 ? '+' : ''}${overallCostDiffPct.toFixed(1)}`}
          suffix="%"
        />
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="px-5 py-3.5 border-b border-neutral-100">
          <p className="text-sm font-semibold text-neutral-950">Kargo Firması Bazlı Performans Skoru</p>
        </div>
        {rows.length === 0 ? (
          <div className="py-10 text-center text-neutral-400 text-sm">Veri bulunmuyor.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-100">
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Hacim</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Başarılı Teslimat</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Hasar Oranı</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">OTD</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ort. Toplama</th>
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Maliyet Farkı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {rows.map((row) => (
                <tr key={row.companyId} className="hover:bg-neutral-50/80">
                  <td className="px-5 py-3 font-medium text-neutral-700">{row.companyName}</td>
                  <td className="px-5 py-3 text-neutral-600">{row.total}</td>
                  <td className="px-5 py-3 text-[#178c4e] font-medium">%{(row.successRate * 100).toFixed(1)}</td>
                  <td
                    className={`px-5 py-3 font-medium ${row.damagedRate > 0.1 ? 'text-[#ad1f2b]' : 'text-neutral-600'}`}
                  >
                    %{(row.damagedRate * 100).toFixed(1)}
                  </td>
                  <td
                    className={`px-5 py-3 font-medium ${row.otdRate < 0.8 ? 'text-[#c2570e]' : 'text-[#178c4e]'}`}
                  >
                    %{(row.otdRate * 100).toFixed(1)}
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{row.avgPickupHours.toFixed(1)} saat</td>
                  <td
                    className={`px-5 py-3 font-medium ${
                      row.costDiffPct > 0 ? 'text-[#ad1f2b]' : row.costDiffPct < 0 ? 'text-[#178c4e]' : 'text-neutral-600'
                    }`}
                  >
                    {row.costDiffPct >= 0 ? '+' : ''}%{row.costDiffPct.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
