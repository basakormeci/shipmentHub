import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  INVOICE_STATUS,
  SHIPMENT_STATUS,
  actualTransferDate,
  getCompany,
  plannedTransferDate,
  type TransferItem,
} from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { copyToClipboard } from '../../lib/clipboard'
import { fmtDate, fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { desiKgFor, packageItemsFor } from '../../lib/shipments'
import { getNode } from '../../lib/transfers'
import { routingSummaryFields, RoutingDecisionSteps } from '../../components/routing/RoutingDecisionSection'
import {
  CancelTransferModal,
  RecallTransferModal,
  TransferBarcodePrintModal,
  TransferCarrierModal,
  TransferNodeModal,
} from './TransferModals'

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
}: {
  icon: ReactNode
  title: string
  fields: { label: string; value: ReactNode; copy?: string }[]
  expandable?: boolean
  expanded?: boolean
  onToggle?: () => void
  expandedContent?: ReactNode
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
        ) : null}
      </div>
      {expandable && expanded ? <div className="px-4 py-3.5 bg-neutral-50/60 border-t border-neutral-100">{expandedContent}</div> : null}
    </div>
  )
}

function ActionMenu({
  item,
  onNodes,
  onCarrier,
  onRecall,
  onCancel,
}: {
  item: TransferItem
  onNodes: () => void
  onCarrier: () => void
  onRecall: () => void
  onCancel: () => void
}) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const terminal = item.status === 'ShipmentCanceled' || item.status === 'DeliveredToStore' || item.status === 'OnTheWayBackToSender'
  // Carrier can only be reassigned before the courier has actually picked up the package.
  const carrierDisabled = !['DispatchLabelCreated', 'OnTheWayForPickUp', 'OnPickUpAddress'].includes(item.status)

  const items = [
    { label: t('transferDetail.update_nodes'), onClick: onNodes, disabled: terminal, danger: false },
    { label: t('transferDetail.update_carrier'), onClick: onCarrier, disabled: carrierDisabled, danger: false },
    { label: t('transferDetail.recall'), onClick: onRecall, disabled: item.status !== 'OnTheWay', danger: false },
    { divider: true as const },
    {
      label: t('transferDetail.cancel'),
      onClick: onCancel,
      disabled: item.status === 'ShipmentCanceled' || item.status === 'DeliveredToStore',
      danger: true,
    },
  ]

  return (
    <div className="relative inline-block">
      <button className="secondary-btn" type="button" onClick={() => setOpen((v) => !v)}>
        {t('transferDetail.other_actions')}
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

export function TransferDetailPage() {
  const t = useT()
  const navigate = useNavigate()
  const { transferId } = useParams()
  const id = Number(transferId)

  const transfers = useDataStore((s) => s.transfers)
  const nodes = useDataStore((s) => s.nodes)
  const carrierInvoices = useDataStore((s) => s.carrierInvoices)
  const updateTransfer = useDataStore((s) => s.updateTransfer)
  const cancelTransfer = useDataStore((s) => s.cancelTransfer)
  const recallTransfer = useDataStore((s) => s.recallTransfer)

  const item = transfers.find((tr) => tr.id === id)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [cancelOpen, setCancelOpen] = useState(false)
  const [recallOpen, setRecallOpen] = useState(false)
  const [carrierOpen, setCarrierOpen] = useState(false)
  const [nodeOpen, setNodeOpen] = useState(false)
  const [barcodeOpen, setBarcodeOpen] = useState(false)
  const [companyId, setCompanyId] = useState<number | ''>('')
  const [fromNodeId, setFromNodeId] = useState<number | ''>('')
  const [toNodeId, setToNodeId] = useState<number | ''>('')

  function toggleSection(key: string) {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  useEffect(() => {
    if (!transferId || Number.isNaN(id) || !item) {
      navigate('/transfers', { replace: true })
    }
  }, [transferId, id, item, navigate])

  if (!item) return null

  const from = getNode(nodes, item.fromNodeId)
  const to = getNode(nodes, item.toNodeId)
  const co = getCompany(item.companyId)
  const st = SHIPMENT_STATUS[item.status]
  const contentItems = packageItemsFor(item.id)
  const totalQty = contentItems.reduce((sum, it) => sum + it.qty, 0)
  const dk = item.desi != null ? { ...desiKgFor(item.id), desi: item.desi } : desiKgFor(item.id)
  const planned = plannedTransferDate(item)
  const actual = actualTransferDate(item)
  const statusLabel = (key: keyof typeof SHIPMENT_STATUS) => t(`status.${key}`)

  function openCarrierModal() {
    setCompanyId(item!.companyId)
    setCarrierOpen(true)
  }

  function openNodeModal() {
    setFromNodeId(item!.fromNodeId)
    setToNodeId(item!.toNodeId)
    setNodeOpen(true)
  }

  function applyCancel() {
    const updated = cancelTransfer(item!.id)
    if (updated) toast(t('toast.transfer_cancelled', { no: updated.transferNo }), 'info')
    setCancelOpen(false)
  }

  function applyRecall() {
    const updated = recallTransfer(item!.id)
    if (updated) toast(t('toast.transfer_recalled', { no: updated.transferNo }), 'info')
    setRecallOpen(false)
  }

  function applyCarrier() {
    if (companyId === '') return
    const updated = updateTransfer(item!.id, { companyId })
    const carrier = getCompany(companyId)
    if (updated) toast(t('toast.transfer_carrier_updated', { no: updated.transferNo, carrier: carrier?.name ?? '' }), 'success')
    setCarrierOpen(false)
  }

  function applyNodes() {
    if (fromNodeId === '' || toNodeId === '' || fromNodeId === toNodeId) return
    const updated = updateTransfer(item!.id, { fromNodeId, toNodeId })
    if (updated) toast(t('toast.transfer_nodes_updated', { no: updated.transferNo }), 'success')
    setNodeOpen(false)
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
            <p className={`text-sm font-semibold ${new Date(actual) <= new Date(planned) ? 'text-[#1a8245]' : 'text-[#ad1f2b]'}`}>
              {Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 3600000) >= 0 ? '+' : ''}
              {Math.round((new Date(actual).getTime() - new Date(planned).getTime()) / 3600000)} {t('shipmentDetail.hours')}
            </p>
          </div>
        </>
      ) : null}
    </div>
  )

  const transferExpanded = (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {(item.statusHistory ?? []).map((h, i) => (
        <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
          {i > 0 ? (
            <svg className="w-3 h-3 text-neutral-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          ) : null}
          <div className="flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-white flex-shrink-0">
            <span className={`badge ${SHIPMENT_STATUS[h.status].badge}`} style={{ fontSize: 11 }}>
              {statusLabel(h.status)}
            </span>
            <span className="text-[10px] text-neutral-400 whitespace-nowrap">{fmtDateTimeStr(h.at)}</span>
          </div>
        </div>
      ))}
    </div>
  )

  const routing = item.routingDecision
  const routingFields = routingSummaryFields(routing, t)
  const routingExpanded = routing && routing.mode === 'auto' ? <RoutingDecisionSteps routing={routing} t={t} /> : null

  const invoice = carrierInvoices.find((inv) => inv.transferNo === item.transferNo) ?? null
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
          <Link to="/transfers" className="hover:text-neutral-600">
            {t('transferDetail.breadcrumb')}
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{t('transferDetail.title', { no: item.transferNo })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/transfers" className="secondary-btn py-2 px-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('transferDetail.back')}
          </Link>
          <button className="secondary-btn" type="button" onClick={() => setBarcodeOpen(true)}>
            {t('transferDetail.print_barcode')}
          </button>
          <ActionMenu
            item={item}
            onNodes={openNodeModal}
            onCarrier={openCarrierModal}
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
        <span className="text-neutral-500">{fmtDateTimeStr(item.createdAt)}</span>
        <span className={`badge ${st.badge}`}>{statusLabel(item.status)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <DetailSection
          title={t('transferDetail.section_dispatch')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          fields={[
            {
              label: t('transferDetail.field_dispatch_no'),
              value: <span className="text-primary">{item.dispatchNo}</span>,
              copy: String(item.dispatchNo),
            },
          ]}
        />
        <DetailSection
          title={t('transferDetail.section_detail')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
              <path strokeLinecap="round" d="M9 13h6M9 17h6M13 3v5h5" />
            </svg>
          }
          fields={[
            { label: t('transferDetail.field_transfer_no'), value: <span className="text-primary">{item.transferNo}</span>, copy: String(item.transferNo) },
            { label: t('shipmentDetail.field_reference_id'), value: item.referenceId || '-', copy: item.referenceId || '-' },
            { label: t('transferDetail.field_note'), value: item.note || '-' },
          ]}
        />
        <DetailSection
          title={t('transferDetail.section_nodes')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="3" width="20" height="5" rx="1" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8v11a2 2 0 002 2h12a2 2 0 002-2V8" />
              <line x1="10" y1="12" x2="14" y2="12" strokeLinecap="round" />
            </svg>
          }
          fields={[
            {
              label: t('transferDetail.field_from'),
              value: (
                <>
                  <span className="font-semibold">{from ? from.name : '-'}</span>
                  {from ? <span className="text-neutral-400 font-mono text-xs ml-1">({from.code})</span> : null}
                </>
              ),
            },
            {
              label: t('transferDetail.field_to'),
              value: (
                <>
                  <span className="font-semibold">{to ? to.name : '-'}</span>
                  {to ? <span className="text-neutral-400 font-mono text-xs ml-1">({to.code})</span> : null}
                </>
              ),
            },
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
            { label: t('shipmentDetail.field_package_no'), value: item.packageNo, copy: item.packageNo },
            { label: 'Desi / Kilo', value: `${dk.desi} desi / ${dk.weight} kg` },
          ]}
          expandedContent={packageExpanded}
        />
        <DetailSection
          title={t('transferDetail.section_carrier')}
          expandable
          expanded={!!expanded.transfer}
          onToggle={() => toggleSection('transfer')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
          fields={[
            { label: t('transferDetail.field_carrier'), value: <span className="font-semibold">{co ? co.name : t('common.unknown')}</span> },
            { label: t('transferDetail.field_tracking'), value: <span className="font-mono text-xs">{item.trackingNo}</span>, copy: item.trackingNo },
            {
              label: '',
              value: (
                <>
                  {from ? from.name : '-'} <span className="text-neutral-300 mx-1">→</span> {to ? to.name : '-'}
                </>
              ),
            },
          ]}
          expandedContent={transferExpanded}
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

      {cancelOpen ? <CancelTransferModal item={item} onClose={() => setCancelOpen(false)} onConfirm={applyCancel} /> : null}
      {recallOpen ? <RecallTransferModal item={item} onClose={() => setRecallOpen(false)} onConfirm={applyRecall} /> : null}
      {carrierOpen ? (
        <TransferCarrierModal
          item={item}
          companyId={companyId}
          onCompanyChange={setCompanyId}
          onClose={() => setCarrierOpen(false)}
          onConfirm={applyCarrier}
        />
      ) : null}
      {nodeOpen ? (
        <TransferNodeModal
          item={item}
          fromNodeId={fromNodeId}
          toNodeId={toNodeId}
          nodes={nodes}
          onFromChange={setFromNodeId}
          onToChange={setToNodeId}
          onClose={() => setNodeOpen(false)}
          onConfirm={applyNodes}
        />
      ) : null}
      {barcodeOpen ? <TransferBarcodePrintModal transfers={[item]} onClose={() => setBarcodeOpen(false)} /> : null}
    </div>
  )
}
