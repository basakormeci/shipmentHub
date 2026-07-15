import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  CARRIER_METRIC_KEYS,
  CARRIER_METRIC_LABELS,
  INVOICE_STATUS,
  SHIPMENT_STATUS,
  actualDeliveryDate,
  getCompany,
  plannedDeliveryDate,
  type Shipment,
  type ShipmentStatus,
} from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { copyToClipboard } from '../../lib/clipboard'
import { fmtDate, fmtDateTimeStr, relativeTimeTr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { desiKgFor, packageItemsFor, recipientAddressLine, recipientEmail, recipientPhone } from '../../lib/shipments'
import {
  CancelShipmentModal,
  EditShipmentModal,
  RecallShipmentModal,
  StatusUpdateModal,
  BarcodePrintModal,
} from './ShipmentModals'

function CopyBtn({ text }: { text: string }) {
  const t = useT()
  return (
    <button
      type="button"
      className="w-6 h-6 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 flex items-center justify-center flex-shrink-0 transition-colors"
      onClick={() => copyToClipboard(String(text), t('toast.copied'))}
    >
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    </button>
  )
}

function DetailSection({
  icon,
  title,
  fields,
  expandable,
  expanded,
  onToggle,
  expandedContent,
  actionBtn,
}: {
  icon: ReactNode
  title: string
  fields: { label: string; value: ReactNode; copy?: string }[]
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  expandedContent?: ReactNode
  actionBtn?: ReactNode
}) {
  const headerClickable = expandable ? onToggle : undefined

  return (
    <div className={`bg-white border border-neutral-200 rounded-lg overflow-hidden ${expandable ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center gap-3.5 px-4 py-3.5" onClick={headerClickable} role={expandable ? 'button' : undefined}>
        <div className="w-7 h-7 rounded-md bg-neutral-100 flex items-center justify-center flex-shrink-0 text-neutral-500">{icon}</div>
        <p className="text-sm font-semibold text-neutral-950 w-28 flex-shrink-0">{title}</p>
        <div className="flex items-center gap-2 flex-1 flex-wrap min-w-0">
          {fields.map((f, i) => (
            <span key={i} className="contents">
              {i > 0 ? <span className="text-neutral-200 mx-1">|</span> : null}
              {f.label ? <span className="text-xs text-neutral-400 flex-shrink-0">{f.label}</span> : null}
              <span className="text-sm font-medium text-neutral-700 whitespace-nowrap">{f.value}</span>
              {f.copy !== undefined ? <CopyBtn text={f.copy} /> : null}
            </span>
          ))}
        </div>
        {expandable ? (
          <button
            type="button"
            className="w-7 h-7 rounded-md hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 flex items-center justify-center flex-shrink-0 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onToggle?.()
            }}
          >
            <svg
              className="w-4 h-4 transition-transform duration-150"
              style={{ transform: `rotate(${expanded ? 180 : 0}deg)` }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        ) : (
          actionBtn
        )}
      </div>
      {expandable && expanded ? <div className="px-4 py-3.5 bg-neutral-50/60 border-t border-neutral-100">{expandedContent}</div> : null}
    </div>
  )
}

function ActionMenu({
  shipment,
  onStatus,
  onEdit,
  onRecall,
  onCancel,
}: {
  shipment: Shipment
  onStatus: () => void
  onEdit: () => void
  onRecall: () => void
  onCancel: () => void
}) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const editDisabled = ['DeliveredToCustomer', 'DeliveredToStore', 'ShipmentCanceled', 'ReturnToSender', 'OnTheWayBackToSender'].includes(
    shipment.status,
  )
  const recallDisabled = shipment.status !== 'OnTheWay'
  const cancelDisabled = shipment.status === 'ShipmentCanceled'

  const items = [
    { label: t('shipmentDetail.status_update'), onClick: onStatus, disabled: false, danger: false },
    { label: t('shipmentDetail.edit_shipment'), onClick: onEdit, disabled: editDisabled, danger: false },
    { label: t('shipmentDetail.recall_shipment'), onClick: onRecall, disabled: recallDisabled, danger: false },
    { divider: true as const },
    { label: t('shipmentDetail.cancel_shipment'), onClick: onCancel, disabled: cancelDisabled, danger: true },
  ]

  return (
    <div className="relative inline-block">
      <button className="secondary-btn" type="button" onClick={() => setOpen((v) => !v)}>
        {t('shipmentDetail.other_actions')}
        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open ? (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 mt-1.5 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg py-1.5 z-20"
            style={{ boxShadow: '0 16px 32px -12px #0e121b1a' }}
          >
            {items.map((it, idx) =>
              'divider' in it ? (
                <div key={idx} className="my-1.5 border-t border-neutral-100" />
              ) : (
                <button
                  key={it.label}
                  type="button"
                  disabled={it.disabled}
                  className={`w-full text-left px-3.5 py-2 text-[13px] flex items-center gap-2.5 transition-colors ${
                    it.danger ? 'text-[#ad1f2b] hover:bg-[#fff5f5]' : 'text-neutral-600 hover:bg-neutral-50'
                  } ${it.disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : ''}`}
                  onClick={() => {
                    setOpen(false)
                    it.onClick()
                  }}
                >
                  {it.label}
                </button>
              ),
            )}
          </div>
        </>
      ) : null}
    </div>
  )
}

export function ShipmentDetailPage() {
  const t = useT()
  const navigate = useNavigate()
  const { shipmentId } = useParams()
  const id = Number(shipmentId)

  const shipments = useDataStore((s) => s.shipments)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const updateShipment = useDataStore((s) => s.updateShipment)
  const cancelShipment = useDataStore((s) => s.cancelShipment)
  const recallShipment = useDataStore((s) => s.recallShipment)

  const shipment = shipments.find((s) => s.id === id)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [statusOpen, setStatusOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [recallOpen, setRecallOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [barcodeOpen, setBarcodeOpen] = useState(false)

  useEffect(() => {
    if (!shipmentId || Number.isNaN(id) || !shipment) {
      navigate('/shipments', { replace: true })
    }
  }, [shipmentId, id, shipment, navigate])

  if (!shipment) return null

  const co = getCompany(shipment.companyId)
  const st = SHIPMENT_STATUS[shipment.status]
  const contentItems = packageItemsFor(shipment.id)
  const totalQty = contentItems.reduce((sum, it) => sum + it.qty, 0)
  const dk = shipment.desi != null ? { ...desiKgFor(shipment.id), desi: shipment.desi } : desiKgFor(shipment.id)
  const planned = plannedDeliveryDate(shipment)
  const actual = actualDeliveryDate(shipment)
  const statusLabel = (key: ShipmentStatus) => t(`status.${key}`)
  const cargoTypeLabel = (type: 'order' | 'return') => t(`cargoType.${type}`)

  function toggleSection(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  function applyStatus(status: ShipmentStatus) {
    const updated = updateShipment(shipment!.id, { status })
    if (updated) toast(t('toast.status_updated', { no: updated.shipmentNo, status: statusLabel(status) }), 'success')
    setStatusOpen(false)
  }

  function applyCancel() {
    const updated = cancelShipment(shipment!.id)
    if (updated) toast(t('toast.shipment_cancelled', { no: updated.shipmentNo }), 'info')
    setCancelOpen(false)
  }

  function applyRecall() {
    const updated = recallShipment(shipment!.id)
    if (updated) toast(t('toast.shipment_recalled', { no: updated.shipmentNo }), 'info')
    setRecallOpen(false)
  }

  function applyEdit(form: {
    customerName: string
    district: string
    province: string
    addressLine: string
    phone: string
    email: string
    deliveryNote: string
  }) {
    const updated = updateShipment(shipment!.id, {
      customerName: form.customerName,
      deliveryNote: form.deliveryNote,
      shipTo: { district: form.district, province: form.province, addressLine: form.addressLine, phone: form.phone, email: form.email },
    })
    if (updated) toast(t('toast.shipment_updated', { no: updated.shipmentNo }), 'success')
    setEditOpen(false)
  }

  const packageExpanded = (
    <div className="flex flex-col gap-2">
      {contentItems.map((it) => (
        <div key={it.sku} className="flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-3">
          <div className="w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: it.color }}>
            <svg className="w-6 h-6 text-white opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.59 13.41L11 3.83A2 2 0 009.59 3.24L3 3v6.59a2 2 0 00.59 1.41l9.58 9.58a2 2 0 002.83 0l4.59-4.59a2 2 0 000-2.83z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-950">
              {it.name} <span className="text-neutral-400 font-normal">× {it.qty}</span>
            </p>
            <p className="text-xs text-neutral-400 mt-0.5">{it.variant}</p>
            <p className="text-xs text-neutral-400 mt-1">
              SKU: <span className="font-mono text-neutral-500">{it.sku}</span> &nbsp;·&nbsp; Barkod:{' '}
              <span className="font-mono text-neutral-500">{it.barcode}</span>
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-neutral-400 mb-0.5">{t('shipmentDetail.total')}</p>
            {it.originalPrice !== it.price ? (
              <span className="text-xs text-neutral-300 line-through mr-1.5">₺{it.originalPrice}</span>
            ) : null}
            <span className="text-sm font-semibold text-neutral-950">₺{it.price * it.qty}</span>
          </div>
        </div>
      ))}
      <div className="flex items-center gap-4 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-lg p-3">
        <div className="flex-1 flex items-center gap-5 text-xs">
          <span className="text-neutral-400">
            Desi: <span className="font-semibold text-neutral-700">{dk.desi}</span>
          </span>
          <span className="text-neutral-400">
            Ağırlık: <span className="font-semibold text-neutral-700">{dk.weight} kg</span>
          </span>
          <span className="text-neutral-400">
            Toplam Ürün: <span className="font-semibold text-neutral-700">{totalQty}</span>
          </span>
        </div>
      </div>
    </div>
  )

  const deliveryExpanded = (
    <div className="flex items-center gap-6 bg-white border border-neutral-200 rounded-lg p-3.5">
      <div className="flex-1">
        <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.planned_delivery')}</p>
        <p className="text-sm font-semibold text-neutral-800">{fmtDateTimeStr(planned)}</p>
      </div>
      <div className="w-px h-8 bg-neutral-200" />
      <div className="flex-1">
        <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.actual_delivery')}</p>
        <p className={`text-sm font-semibold ${actual ? 'text-neutral-800' : 'text-neutral-300'}`}>
          {actual ? fmtDateTimeStr(actual) : t('shipmentDetail.not_delivered_yet')}
        </p>
      </div>
      {actual ? (
        <>
          <div className="w-px h-8 bg-neutral-200" />
          <div className="flex-1">
            <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.difference')}</p>
            <p
              className={`text-sm font-semibold ${new Date(actual) <= new Date(planned) ? 'text-[#1a8245]' : 'text-[#ad1f2b]'}`}
            >
              {Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 3600000) >= 0 ? '+' : ''}
              {Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 3600000)} {t('shipmentDetail.hours')}
            </p>
          </div>
        </>
      ) : null}
    </div>
  )

  const shipmentExpanded = (
    <div className="inline-flex flex-col gap-1 px-3 py-2 rounded-lg" style={{ background: '#fff3eb' }}>
      <span className="text-xs font-semibold" style={{ color: '#c2570e' }}>
        {statusLabel(shipment.status)}
      </span>
      <span className="text-[11px] text-neutral-400">{fmtDateTimeStr(shipment.shipTime)}</span>
    </div>
  )

  const routing = shipment.routingDecision
  const routingFields =
    !routing
      ? [{ label: '', value: <span className="text-neutral-400">{t('shipmentDetail.routing_legacy')}</span> }]
      : routing.mode === 'manual'
        ? [{ label: t('shipmentDetail.field_routing_mode'), value: <span className="font-semibold">{t('shipmentDetail.routing_mode_manual')}</span> }]
        : [
            { label: t('shipmentDetail.field_routing_mode'), value: <span className="font-semibold">{t('shipmentDetail.routing_mode_auto')}</span> },
            { label: '', value: t('shipmentDetail.routing_default_scoring') },
          ]

  const routingExpanded =
    routing && routing.mode === 'auto' ? (
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            1. {t('shipmentDetail.routing_step_eligibility')}
          </p>
          <p className="text-xs text-neutral-600">
            {t('shipmentDetail.routing_step_eligibility_desc', { n: routing.contractEligibleCompanyIds.length })}
          </p>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            2. {t('shipmentDetail.routing_step_rule')}
          </p>
          {routing.matchedRuleName ? (
            <p className="text-xs text-neutral-600">
              {t('shipmentDetail.routing_step_rule_matched', { name: routing.matchedRuleName, summary: routing.matchedRuleSummary ?? '' })}
              {routing.ruleNarrowedCompanyIds
                ? ' ' + t('shipmentDetail.routing_step_rule_narrowed', { n: routing.ruleNarrowedCompanyIds.length })
                : ''}
            </p>
          ) : (
            <p className="text-xs text-neutral-400">{t('shipmentDetail.routing_step_rule_none')}</p>
          )}
        </div>

        <div>
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1.5">
            3. {t('shipmentDetail.routing_step_scoring')}
          </p>
          <div className="bg-white border border-neutral-200 rounded-lg overflow-x-auto">
            <table className="w-full text-xs" style={{ minWidth: 640 }}>
              <thead>
                <tr className="border-b border-neutral-100 text-left">
                  <th className="px-3 py-2 text-neutral-400 font-semibold uppercase tracking-wider">{t('shipmentDetail.routing_th_carrier')}</th>
                  {CARRIER_METRIC_KEYS.map((k) => (
                    <th key={k} className="px-2 py-2 text-neutral-400 font-semibold uppercase tracking-wider text-right whitespace-nowrap">
                      {CARRIER_METRIC_LABELS[k]}
                      <span className="block font-normal normal-case text-neutral-300">%{Math.round(routing.weights[k] * 100)}</span>
                    </th>
                  ))}
                  <th className="px-3 py-2 text-neutral-400 font-semibold uppercase tracking-wider text-right">{t('shipmentDetail.routing_th_score')}</th>
                </tr>
              </thead>
              <tbody>
                {routing.scores.map((s) => (
                  <tr key={s.companyId} className={s.companyId === routing.chosenCompanyId ? 'bg-primary-lighter/30' : ''}>
                    <td className="px-3 py-2 font-medium text-neutral-700 whitespace-nowrap">
                      {s.companyName}
                      {s.companyId === routing.chosenCompanyId ? (
                        <span className="ml-1.5 text-primary text-[10px] font-semibold">{t('shipmentDetail.routing_chosen')}</span>
                      ) : null}
                    </td>
                    {CARRIER_METRIC_KEYS.map((k) => (
                      <td key={k} className="px-2 py-2 text-right text-neutral-500">
                        {(s.metrics[k] * 100).toFixed(0)}
                      </td>
                    ))}
                    <td className="px-3 py-2 text-right font-semibold text-neutral-800">{(s.combined * 100).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            4. {t('shipmentDetail.routing_step_result')}
          </p>
          <p className="text-xs text-neutral-600">
            {t('shipmentDetail.routing_step_result_desc', { name: getCompany(routing.chosenCompanyId)?.name ?? '' })}
            {routing.tieBreakUsedDefault ? ' ' + t('shipmentDetail.routing_tiebreak_note') : ''}
          </p>
        </div>
      </div>
    ) : null

  const invoice = carrierInvoices.find((inv) => inv.shipmentNo === shipment.shipmentNo) ?? null
  const costDiff = invoice ? invoice.realCost - invoice.expectedCost : 0
  const costDiffPct = invoice && invoice.expectedCost ? (costDiff / invoice.expectedCost) * 100 : 0

  const financeFields = !invoice
    ? [{ label: '', value: <span className="text-neutral-400">{t('shipmentDetail.finance_no_invoice')}</span> }]
    : [
        { label: t('shipmentDetail.finance_expected'), value: `₺${invoice.expectedCost.toLocaleString('tr-TR')}` },
        { label: t('shipmentDetail.finance_real'), value: `₺${invoice.realCost.toLocaleString('tr-TR')}` },
        {
          label: t('shipmentDetail.finance_diff'),
          value: (
            <span className={costDiff <= 0 ? 'font-semibold text-[#1a8245]' : 'font-semibold text-[#ad1f2b]'}>
              {costDiff >= 0 ? '+' : ''}
              ₺{costDiff.toLocaleString('tr-TR')} ({costDiffPct >= 0 ? '+' : ''}
              {costDiffPct.toFixed(1)}%)
            </span>
          ),
        },
      ]

  const financeExpanded = invoice ? (
    <div className="flex items-center gap-6 bg-white border border-neutral-200 rounded-lg p-3.5 flex-wrap">
      <div className="flex-1" style={{ minWidth: 120 }}>
        <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.finance_invoice_no')}</p>
        <p className="text-sm font-semibold text-neutral-800 font-mono">{invoice.invoiceNo}</p>
      </div>
      <div className="w-px h-8 bg-neutral-200" />
      <div className="flex-1" style={{ minWidth: 120 }}>
        <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.finance_invoice_date')}</p>
        <p className="text-sm font-semibold text-neutral-800">{fmtDate(invoice.invoiceDate)}</p>
      </div>
      <div className="w-px h-8 bg-neutral-200" />
      <div className="flex-1" style={{ minWidth: 120 }}>
        <p className="text-xs text-neutral-400 mb-1">{t('shipmentDetail.finance_status')}</p>
        <span className={`badge ${INVOICE_STATUS[invoice.status].badge}`}>{INVOICE_STATUS[invoice.status].label}</span>
      </div>
    </div>
  ) : null

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/shipments" className="hover:text-neutral-600">
            {t('shipmentDetail.breadcrumb')}
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{t('shipmentDetail.title', { no: shipment.shipmentNo })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/shipments" className="secondary-btn py-2 px-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('shipmentDetail.back')}
          </Link>
          <button className="secondary-btn" type="button" onClick={() => setBarcodeOpen(true)}>
            {t('shipmentDetail.print_label')}
          </button>
          <ActionMenu
            shipment={shipment}
            onStatus={() => setStatusOpen(true)}
            onEdit={() => setEditOpen(true)}
            onRecall={() => setRecallOpen(true)}
            onCancel={() => setCancelOpen(true)}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5 mb-5 text-sm">
        <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
        </svg>
        <span className="text-neutral-500">
          {fmtDateTimeStr(shipment.shipTime)} · {relativeTimeTr(shipment.shipTime)}
        </span>
        <span className={`badge ${st.badge}`}>{statusLabel(shipment.status)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <DetailSection
          title={t('shipmentDetail.section_order')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          fields={[
            { label: t('shipmentDetail.field_order_no'), value: <span className="text-primary">{shipment.orderNo}</span>, copy: String(shipment.orderNo) },
            { label: t('shipmentDetail.field_channel'), value: shipment.channel },
          ]}
        />
        <DetailSection
          title={t('shipmentDetail.section_detail')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
              <path strokeLinecap="round" d="M9 13h6M9 17h6M13 3v5h5" />
            </svg>
          }
          fields={[
            { label: t('shipmentDetail.field_reference_id'), value: shipment.referenceId || '-', copy: shipment.referenceId || '-' },
            { label: t('shipmentDetail.field_cargo_type'), value: <span className="font-semibold">{cargoTypeLabel(shipment.cargoType)}</span> },
            { label: t('shipmentDetail.field_delivery_note'), value: shipment.deliveryNote || '-' },
          ]}
        />
        <DetailSection
          title={t('shipmentDetail.section_customer')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          }
          fields={[
            { label: '', value: <span className="font-semibold">{shipment.customerName}</span> },
            { label: t('shipmentDetail.field_email'), value: recipientEmail(shipment) },
            { label: t('shipmentDetail.field_phone'), value: recipientPhone(shipment) },
            { label: t('shipmentDetail.field_address_line'), value: recipientAddressLine(shipment), copy: recipientAddressLine(shipment) },
          ]}
        />
        <DetailSection
          title={t('shipmentDetail.section_package')}
          expandable
          expanded={!!expanded.paket}
          onToggle={() => toggleSection('paket')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
          fields={[
            { label: t('shipmentDetail.field_product_count'), value: String(totalQty) },
            { label: t('shipmentDetail.field_package_no'), value: shipment.packageNo, copy: shipment.packageNo },
            { label: 'Desi / Kilo', value: `${dk.desi} desi / ${dk.weight} kg` },
          ]}
          expandedContent={packageExpanded}
        />
        <DetailSection
          title={t('shipmentDetail.section_shipment')}
          expandable
          expanded={!!expanded.gonderi}
          onToggle={() => toggleSection('gonderi')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
          fields={[
            { label: t('shipmentDetail.field_carrier'), value: <span className="font-semibold">{co ? co.name : t('common.unknown')}</span> },
            { label: t('shipmentDetail.field_tracking_no'), value: <span className="font-mono text-xs">{shipment.trackingNo}</span>, copy: shipment.trackingNo },
            {
              label: '',
              value: (
                <>
                  {shipment.shipFrom} <span className="text-neutral-300 mx-1">→</span> {shipment.shipTo.district} / {shipment.shipTo.province}
                </>
              ),
            },
          ]}
          expandedContent={shipmentExpanded}
        />
        <DetailSection
          title={t('shipmentDetail.section_delivery')}
          expandable
          expanded={!!expanded.teslimat}
          onToggle={() => toggleSection('teslimat')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
            </svg>
          }
          fields={[
            { label: t('shipmentDetail.planned_delivery'), value: fmtDateTimeStr(planned) },
            {
              label: t('shipmentDetail.actual_delivery'),
              value: actual ? fmtDateTimeStr(actual) : <span className="text-neutral-300">{t('shipmentDetail.not_delivered_yet')}</span>,
            },
          ]}
          expandedContent={deliveryExpanded}
        />
        <DetailSection
          title={t('shipmentDetail.section_routing')}
          expandable={!!routingExpanded}
          expanded={!!expanded.rotalama}
          onToggle={() => toggleSection('rotalama')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          }
          fields={routingFields}
          expandedContent={routingExpanded}
        />
        <DetailSection
          title={t('shipmentDetail.section_finance')}
          expandable={!!invoice}
          expanded={!!expanded.finans}
          onToggle={() => toggleSection('finans')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 2v8m0 0v2m0-2c-1.11 0-2.08-.402-2.599-1" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          }
          fields={financeFields}
          expandedContent={financeExpanded}
        />
      </div>

      {statusOpen ? (
        <StatusUpdateModal shipment={shipment} onClose={() => setStatusOpen(false)} onConfirm={applyStatus} />
      ) : null}
      {cancelOpen ? <CancelShipmentModal shipment={shipment} onClose={() => setCancelOpen(false)} onConfirm={applyCancel} /> : null}
      {recallOpen ? <RecallShipmentModal shipment={shipment} onClose={() => setRecallOpen(false)} onConfirm={applyRecall} /> : null}
      {editOpen ? <EditShipmentModal shipment={shipment} onClose={() => setEditOpen(false)} onSave={applyEdit} /> : null}
      {barcodeOpen ? <BarcodePrintModal shipments={[shipment]} onClose={() => setBarcodeOpen(false)} /> : null}
    </div>
  )
}
