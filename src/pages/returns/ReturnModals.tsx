import { useState } from 'react'
import { COMPANIES, RETURN_STATUS, type ReturnItem, type ReturnStatus } from '../../data/catalog'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

export function CancelReturnModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ReturnItem | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

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
            <h3 className="font-semibold text-neutral-950 mb-1">{t('cancelReturnModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('cancelReturnModal.desc_before')}
              <strong className="text-neutral-700">#{item.returnNo}</strong>
              {t('cancelReturnModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#fb3748' }} onClick={onConfirm}>
            {t('cancelReturnModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function RecallReturnModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ReturnItem | null
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

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
            <h3 className="font-semibold text-neutral-950 mb-1">{t('recallReturnModal.title')}</h3>
            <p className="text-sm text-neutral-500">
              {t('recallReturnModal.desc_before')}
              <strong className="text-neutral-700">#{item.returnNo}</strong>
              {t('recallReturnModal.desc_after')}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" style={{ background: '#c2570e' }} onClick={onConfirm}>
            {t('recallReturnModal.confirm_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReturnStatusModal({
  item,
  onClose,
  onConfirm,
}: {
  item: ReturnItem | null
  onClose: () => void
  onConfirm: (status: ReturnStatus) => void
}) {
  const t = useT()
  const [value, setValue] = useState<ReturnStatus>(item?.status ?? 'ReturnCodeCreated')
  if (!item) return null

  const options = (Object.keys(RETURN_STATUS) as ReturnStatus[]).filter(
    (k) => k !== 'ReturnShipmentError' && k !== 'ReturnCodeExpired',
  )

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('returnStatusModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('returnStatusModal.desc_before')}
          <strong className="text-neutral-700">#{item.returnNo}</strong>
          {t('returnStatusModal.desc_after')}
        </p>
        <Dropdown
          value={value}
          onChange={(v) => setValue(v as ReturnStatus)}
          options={options.map((k) => ({ value: k, label: t(`returnStatus.${k}`) }))}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={() => onConfirm(value)}>
            {t('returnStatusModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReturnCarrierModal({
  item,
  companyId,
  onCompanyChange,
  onClose,
  onConfirm,
}: {
  item: ReturnItem | null
  companyId: number | ''
  onCompanyChange: (id: number) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('returnCarrierModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('returnCarrierModal.desc_before')}
          <strong className="text-neutral-700">#{item.returnNo}</strong>
          {t('returnCarrierModal.desc_after')}
        </p>
        <Dropdown
          value={companyId === '' ? '' : String(companyId)}
          onChange={(v) => onCompanyChange(+v)}
          options={COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))}
        />
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" onClick={onConfirm}>
            {t('returnCarrierModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}

export function ReturnAddressModal({
  item,
  district,
  province,
  onDistrictChange,
  onProvinceChange,
  onClose,
  onConfirm,
}: {
  item: ReturnItem | null
  district: string
  province: string
  onDistrictChange: (v: string) => void
  onProvinceChange: (v: string) => void
  onClose: () => void
  onConfirm: () => void
}) {
  const t = useT()
  if (!item) return null

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-1">{t('returnAddressModal.title')}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          {t('returnAddressModal.desc_before')}
          <strong className="text-neutral-700">#{item.returnNo}</strong>
          {t('returnAddressModal.desc_after')}
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="form-label">{t('returnAddressModal.district')}</label>
            <input type="text" className="form-input" value={district} onChange={(e) => onDistrictChange(e.target.value)} />
          </div>
          <div>
            <label className="form-label">{t('returnAddressModal.province')}</label>
            <input type="text" className="form-input" value={province} onChange={(e) => onProvinceChange(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            {t('common.cancel')}
          </button>
          <button className="primary-btn" type="button" disabled={!district.trim() || !province.trim()} onClick={onConfirm}>
            {t('returnAddressModal.update_btn')}
          </button>
        </div>
      </div>
    </div>
  )
}
