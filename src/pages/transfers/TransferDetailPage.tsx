import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CARRIER_METRIC_KEYS, CARRIER_METRIC_LABELS, SHIPMENT_STATUS, getCompany, type TransferItem } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { copyToClipboard } from '../../lib/clipboard'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { getNode } from '../../lib/transfers'
import { CancelTransferModal, RecallTransferModal, TransferCarrierModal, TransferNodeModal } from './TransferModals'

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

  const items = [
    { label: t('transferDetail.update_nodes'), onClick: onNodes, disabled: terminal, danger: false },
    { label: t('transferDetail.update_carrier'), onClick: onCarrier, disabled: terminal, danger: false },
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
  const updateTransfer = useDataStore((s) => s.updateTransfer)
  const cancelTransfer = useDataStore((s) => s.cancelTransfer)
  const recallTransfer = useDataStore((s) => s.recallTransfer)

  const item = transfers.find((tr) => tr.id === id)

  const [cancelOpen, setCancelOpen] = useState(false)
  const [recallOpen, setRecallOpen] = useState(false)
  const [carrierOpen, setCarrierOpen] = useState(false)
  const [nodeOpen, setNodeOpen] = useState(false)
  const [companyId, setCompanyId] = useState<number | ''>('')
  const [fromNodeId, setFromNodeId] = useState<number | ''>('')
  const [toNodeId, setToNodeId] = useState<number | ''>('')
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})

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
  const statusLabel = (key: keyof typeof SHIPMENT_STATUS) => t(`status.${key}`)

  const routing = item.routingDecision
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
          title={t('transferDetail.section_detail')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h13M8 7l4-4M8 7l4 4M16 17H3m13 0l-4 4m4-4l-4-4" />
            </svg>
          }
          fields={[
            { label: t('transferDetail.field_transfer_no'), value: <span className="text-primary">{item.transferNo}</span>, copy: String(item.transferNo) },
            { label: t('transferDetail.field_desi'), value: String(item.desi) },
            { label: t('transferDetail.field_created'), value: fmtDateTimeStr(item.createdAt) },
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
          title={t('transferDetail.section_carrier')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
          fields={[
            { label: t('transferDetail.field_carrier'), value: <span className="font-semibold">{co ? co.name : t('common.unknown')}</span> },
            { label: t('transferDetail.field_tracking'), value: <span className="font-mono text-xs">{item.trackingNo}</span>, copy: item.trackingNo },
          ]}
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
        {item.note ? (
          <DetailSection
            title={t('transferDetail.section_note')}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v13a1 1 0 01-1 1H7a1 1 0 01-1-1V4a1 1 0 011-1z" />
                <path strokeLinecap="round" d="M9 13h6M9 17h6M13 3v5h5" />
              </svg>
            }
            fields={[{ label: '', value: item.note }]}
          />
        ) : null}
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
    </div>
  )
}
