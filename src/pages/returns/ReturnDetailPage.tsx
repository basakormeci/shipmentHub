import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RETURN_STATUS, getCompany, type ReturnItem, type ReturnStatus } from '../../data/catalog'
import { useDataStore } from '../../stores/dataStore'
import { useT } from '../../hooks/useT'
import { copyToClipboard } from '../../lib/clipboard'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { getOriginalShipment, getReturnCompanyId } from '../../lib/returns'
import {
  CancelReturnModal,
  RecallReturnModal,
  ReturnAddressModal,
  ReturnCarrierModal,
  ReturnStatusModal,
} from './ReturnModals'

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
  actionBtn,
}: {
  icon: ReactNode
  title: string
  fields: { label: string; value: ReactNode; copy?: string }[]
  actionBtn?: ReactNode
}) {
  return (
    <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
      <div className="flex items-center gap-3.5 px-4 py-3.5">
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
        {actionBtn}
      </div>
    </div>
  )
}

function ActionMenu({
  item,
  onStatus,
  onCarrier,
  onAddress,
  onRecall,
  onCancel,
}: {
  item: ReturnItem
  onStatus: () => void
  onCarrier: () => void
  onAddress: () => void
  onRecall: () => void
  onCancel: () => void
}) {
  const t = useT()
  const [open, setOpen] = useState(false)
  const terminal = item.status === 'cancelled' || item.status === 'completed' || item.status === 'recalled'

  const items = [
    { label: t('returnDetail.status_update'), onClick: onStatus, disabled: false, danger: false },
    { label: t('returnDetail.update_carrier'), onClick: onCarrier, disabled: terminal, danger: false },
    { label: t('returnDetail.update_address'), onClick: onAddress, disabled: terminal, danger: false },
    { label: t('returnDetail.recall'), onClick: onRecall, disabled: item.status !== 'picked_up', danger: false },
    { divider: true as const },
    { label: t('returnDetail.cancel'), onClick: onCancel, disabled: item.status === 'cancelled' || item.status === 'completed', danger: true },
  ]

  return (
    <div className="relative inline-block">
      <button className="secondary-btn" type="button" onClick={() => setOpen((v) => !v)}>
        {t('returnDetail.other_actions')}
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

export function ReturnDetailPage() {
  const t = useT()
  const navigate = useNavigate()
  const { returnId } = useParams()
  const id = Number(returnId)

  const returns = useDataStore((s) => s.returns)
  const shipments = useDataStore((s) => s.shipments)
  const updateReturn = useDataStore((s) => s.updateReturn)
  const cancelReturn = useDataStore((s) => s.cancelReturn)
  const recallReturn = useDataStore((s) => s.recallReturn)

  const item = returns.find((r) => r.id === id)

  const [statusOpen, setStatusOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [recallOpen, setRecallOpen] = useState(false)
  const [carrierOpen, setCarrierOpen] = useState(false)
  const [addressOpen, setAddressOpen] = useState(false)
  const [carrierId, setCarrierId] = useState<number | ''>('')
  const [district, setDistrict] = useState('')
  const [province, setProvince] = useState('')

  useEffect(() => {
    if (!returnId || Number.isNaN(id) || !item) {
      navigate('/returns', { replace: true })
    }
  }, [returnId, id, item, navigate])

  if (!item) return null

  const orig = getOriginalShipment(shipments, item.originalShipmentId)
  const companyId = getReturnCompanyId(item, shipments)
  const co = companyId != null ? getCompany(companyId) : null
  const pickupAddr = item.pickupAddress ?? (orig ? orig.shipTo : null)
  const st = RETURN_STATUS[item.status]
  const statusLabel = (key: ReturnStatus) => t(`returnStatus.${key}`)
  const reasonLabel = (key: string) => t(`returnReason.${key}`)

  function openCarrierModal() {
    setCarrierId(companyId ?? '')
    setCarrierOpen(true)
  }

  function openAddressModal() {
    setDistrict(pickupAddr?.district ?? '')
    setProvince(pickupAddr?.province ?? '')
    setAddressOpen(true)
  }

  function applyStatus(status: ReturnStatus) {
    const updated = updateReturn(item!.id, { status })
    if (updated) toast(t('toast.return_status_updated', { no: updated.returnNo, status: statusLabel(status) }), 'success')
    setStatusOpen(false)
  }

  function applyCancel() {
    const updated = cancelReturn(item!.id)
    if (updated) toast(t('toast.return_cancelled', { no: updated.returnNo }), 'info')
    setCancelOpen(false)
  }

  function applyRecall() {
    const updated = recallReturn(item!.id)
    if (updated) toast(t('toast.return_recalled', { no: updated.returnNo }), 'info')
    setRecallOpen(false)
  }

  function applyCarrier() {
    if (carrierId === '') return
    const updated = updateReturn(item!.id, { companyId: carrierId })
    const carrier = getCompany(carrierId)
    if (updated) toast(t('toast.return_carrier_updated', { no: updated.returnNo, carrier: carrier?.name ?? '' }), 'success')
    setCarrierOpen(false)
  }

  function applyAddress() {
    const updated = updateReturn(item!.id, { pickupAddress: { district: district.trim(), province: province.trim() } })
    if (updated) toast(t('toast.return_address_updated', { no: updated.returnNo }), 'success')
    setAddressOpen(false)
  }

  return (
    <div className="page-container">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Link to="/returns" className="hover:text-neutral-600">
            {t('returnDetail.breadcrumb')}
          </Link>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
          <span className="text-neutral-600 font-medium">{t('returnDetail.title', { no: item.returnNo })}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/returns" className="secondary-btn py-2 px-3">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('returnDetail.back')}
          </Link>
          <button className="secondary-btn" type="button" onClick={() => toast(t('returns.barcode_soon'), 'info')}>
            {t('returnDetail.print_barcode')}
          </button>
          <ActionMenu
            item={item}
            onStatus={() => setStatusOpen(true)}
            onCarrier={openCarrierModal}
            onAddress={openAddressModal}
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
        <span className="text-neutral-500">{fmtDateTimeStr(item.requestDate)}</span>
        <span className={`badge ${st.badge}`}>{statusLabel(item.status)}</span>
      </div>

      <div className="flex flex-col gap-3">
        <DetailSection
          title={t('returnDetail.section_detail')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          }
          fields={[
            { label: t('returnDetail.field_return_no'), value: <span className="text-primary">{item.returnNo}</span>, copy: String(item.returnNo) },
            { label: t('returnDetail.field_reason'), value: reasonLabel(item.reason) },
            { label: t('returnDetail.field_request_date'), value: fmtDateTimeStr(item.requestDate) },
          ]}
        />
        <DetailSection
          title={t('returnDetail.section_original')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" />
            </svg>
          }
          fields={
            orig
              ? [
                  { label: t('returnDetail.field_shipment_no'), value: <span className="font-semibold">#{orig.shipmentNo}</span>, copy: String(orig.shipmentNo) },
                  { label: t('returnDetail.field_order_no'), value: orig.orderNo },
                  { label: t('returnDetail.field_customer'), value: orig.customerName },
                ]
              : [{ label: '', value: t('returnDetail.original_not_found') }]
          }
          actionBtn={
            orig ? (
              <Link
                to={`/shipments/${orig.id}`}
                className="w-8 h-8 rounded-lg bg-primary-lighter hover:bg-primary-light text-primary flex items-center justify-center flex-shrink-0 transition-colors"
                title={t('returnDetail.go_shipment')}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
                </svg>
              </Link>
            ) : undefined
          }
        />
        <DetailSection
          title={t('returnDetail.section_pickup')}
          icon={
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
          }
          fields={[
            { label: t('returnDetail.field_carrier'), value: <span className="font-semibold">{co ? co.name : t('common.unknown')}</span> },
            {
              label: t('returnDetail.field_pickup'),
              value: item.pickup ? (
                <span className="text-[#178c4e] font-semibold">{t('returnDetail.pickup_yes')}</span>
              ) : (
                <span className="text-neutral-400">{t('returnDetail.pickup_no')}</span>
              ),
            },
            { label: '', value: pickupAddr ? `${pickupAddr.district} / ${pickupAddr.province}` : '-' },
          ]}
        />
        {item.note ? (
          <DetailSection
            title={t('returnDetail.section_note')}
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

      {statusOpen ? <ReturnStatusModal item={item} onClose={() => setStatusOpen(false)} onConfirm={applyStatus} /> : null}
      {cancelOpen ? <CancelReturnModal item={item} onClose={() => setCancelOpen(false)} onConfirm={applyCancel} /> : null}
      {recallOpen ? <RecallReturnModal item={item} onClose={() => setRecallOpen(false)} onConfirm={applyRecall} /> : null}
      {carrierOpen ? (
        <ReturnCarrierModal
          item={item}
          companyId={carrierId}
          onCompanyChange={setCarrierId}
          onClose={() => setCarrierOpen(false)}
          onConfirm={applyCarrier}
        />
      ) : null}
      {addressOpen ? (
        <ReturnAddressModal
          item={item}
          district={district}
          province={province}
          onDistrictChange={setDistrict}
          onProvinceChange={setProvince}
          onClose={() => setAddressOpen(false)}
          onConfirm={applyAddress}
        />
      ) : null}
    </div>
  )
}
