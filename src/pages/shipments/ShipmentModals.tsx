import { useState } from 'react'
import { SHIPMENT_STATUS, type Shipment, type ShipmentStatus } from '../../data/catalog'
import { useT } from '../../hooks/useT'
import { openShipmentBarcodePrint } from '../../lib/barcodePrint'
import { toast } from '../../lib/toast'
import { recipientAddressLine, recipientEmail, recipientPhone } from '../../lib/shipments'
import { Dropdown } from '../../components/ui/Dropdown'

export function CancelShipmentModal({
  shipment,
  onClose,
  onConfirm,
}: {
  shipment: Shipment | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!shipment) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#ffebec] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#fb3748]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-950 mb-1">{t('cancelShipmentModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('cancelShipmentModal.desc_before')}
              <strong className="text-neutral-700">#{shipment.shipmentNo}</strong>
              {t('cancelShipmentModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#fb3748' }} onClick={onConfirm}>
            {t('cancelShipmentModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function StatusUpdateModal({
  shipment,
  onClose,
  onConfirm,
}: {
  shipment: Shipment | null
  onClose: () => void
  onConfirm: (status: ShipmentStatus) => void
}) {
  const t = useT()
  const [value, setValue] = useState<ShipmentStatus>(shipment?.status ?? 'preparing')
  if (!shipment) return null

  const options = (Object.keys(SHIPMENT_STATUS) as ShipmentStatus[]).filter((k) => k !== 'cancelled')

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('statusModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('statusModal.desc_before')}
          <strong className="text-neutral-700">#{shipment.shipmentNo}</strong>
          {t('statusModal.desc_after')}
        </p>
        <Dropdown
          value={value}
          onChange={(v) => setValue(v as ShipmentStatus)}
          options={options.map((k) => ({ value: k, label: t(`status.${k}`) }))}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={() => onConfirm(value)}>
            {t('statusModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecallShipmentModal({
  shipment,
  onClose,
  onConfirm,
}: {
  shipment: Shipment | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!shipment) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-[#fff3eb] flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5" style={{ color: '#c2570e' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-950 mb-1">{t('recallShipmentModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('recallShipmentModal.desc_before')}
              <strong className="text-neutral-700">#{shipment.shipmentNo}</strong>
              {t('recallShipmentModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#c2570e' }} onClick={onConfirm}>
            {t('recallShipmentModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function EditShipmentModal({
  shipment,
  onClose,
  onSave,
}: {
  shipment: Shipment | null
  onClose: () => void
  onSave: (patch: {
    customerName: string
    district: string
    province: string
    addressLine: string
    phone: string
    email: string
    deliveryNote: string
  }) => void
}) {
  const t = useT()
  const [customerName, setCustomerName] = useState(shipment?.customerName ?? '')
  const [district, setDistrict] = useState(shipment?.shipTo.district ?? '')
  const [province, setProvince] = useState(shipment?.shipTo.province ?? '')
  const [addressLine, setAddressLine] = useState(shipment ? recipientAddressLine(shipment) : '')
  const [phone, setPhone] = useState(shipment ? recipientPhone(shipment) : '')
  const [email, setEmail] = useState(shipment ? recipientEmail(shipment) : '')
  const [deliveryNote, setDeliveryNote] = useState(shipment?.deliveryNote ?? '')

  if (!shipment) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-lg flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <h3 className="font-semibold text-neutral-950">{t('editShipmentModal.title')}</h3>
          <button className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg hover:bg-neutral-100 transition-colors" type="button" onClick={onClose}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="form-label">{t('editShipmentModal.customer_name')}</label>
            <input type="text" className="form-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('editShipmentModal.district')}</label>
              <input type="text" className="form-input" value={district} onChange={(e) => setDistrict(e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('editShipmentModal.province')}</label>
              <input type="text" className="form-input" value={province} onChange={(e) => setProvince(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">{t('editShipmentModal.address_line')}</label>
            <textarea className="form-input" rows={2} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">{t('editShipmentModal.recipient_phone')}</label>
              <input type="text" className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="form-label">{t('editShipmentModal.recipient_email')}</label>
              <input type="text" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div>
            <label className="form-label">{t('editShipmentModal.delivery_note')}</label>
            <textarea className="form-input" rows={3} value={deliveryNote} onChange={(e) => setDeliveryNote(e.target.value)} />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button
            className="primary-btn"
            type="button"
            disabled={!customerName.trim()}
            onClick={() =>
              onSave({
                customerName: customerName.trim(),
                district: district.trim(),
                province: province.trim(),
                addressLine: addressLine.trim(),
                phone: phone.trim(),
                email: email.trim(),
                deliveryNote,
              })
            }
          >
            {t('common.save')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function BarcodePrintModal({
  shipments,
  onClose,
}: {
  shipments: Shipment[]
  onClose: () => void
}) {
  const t = useT()
  if (shipments.length === 0) return null

  const subtitle =
    shipments.length === 1
      ? t('barcodeModal.single', { no: shipments[0].shipmentNo })
      : t('barcodeModal.bulk', { n: shipments.length })

  function handlePrint() {
    openShipmentBarcodePrint(shipments)
    toast(t('barcodeModal.opened', { n: shipments.length }), 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-sm p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('barcodeModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-2">{subtitle}</p>
        <p className="text-xs text-neutral-400 mb-4 font-mono">{shipments.map((s) => s.trackingNo).join(', ')}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={handlePrint}>
            {t('barcodeModal.print_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export { ColumnPanelModal } from '../../components/ui/ColumnPanelModal'
