import type { ReactNode } from 'react'
import { PROVINCES } from '../../data/catalog'
import { NODE_TYPES, WEEKDAYS, type NodeForm } from '../../lib/nodes'
import { useT } from '../../hooks/useT'

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-neutral-400 mb-1">{label}</p>
      <p className="text-sm font-semibold text-neutral-950">{value}</p>
    </div>
  )
}

function FulfillmentBadge({ active }: { active: boolean }) {
  return <span className={`badge ${active ? 'badge-active' : 'badge-passive'}`}>{active ? 'ACTIVE' : 'INACTIVE'}</span>
}

export function NodeStep4({ f }: { f: NodeForm }) {
  const t = useT()
  const province = f.provinceId === '' ? undefined : PROVINCES.find((p) => p.id === f.provinceId)
  const typeLabel = NODE_TYPES.find((o) => o.value === f.type)

  return (
    <div className="flex flex-col gap-6">
      <p className="text-base font-semibold text-neutral-950">{f.name || '-'}</p>

      <div className="grid grid-cols-2 gap-5">
        <Field label={t('nodeWizard.field_id')} value={f.id || '-'} />
        <Field label={t('nodeWizard.field_type')} value={typeLabel ? t(typeLabel.labelKey) : '-'} />
        <Field label={t('nodeWizard.field_country')} value={f.country || '-'} />
        <Field label={t('nodeWizard.field_city')} value={province?.name || '-'} />
        <Field label={t('nodeWizard.field_district')} value={f.district || '-'} />
        <Field label={t('nodeWizard.field_address')} value={f.address || '-'} />
        <Field label={t('nodeWizard.field_group')} value={f.group || '-'} />
        <Field label={t('nodeWizard.field_daily_limit')} value={f.dailyAssignmentLimit || '0'} />
      </div>

      <div>
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-3">{t('nodeWizard.step2_label')}</p>
        <div className="flex flex-col gap-1.5">
          {WEEKDAYS.map(({ day, labelKey }) => {
            const row = f.workingHours.find((w) => w.day === day)!
            return (
              <div key={day} className="flex items-center justify-between text-sm">
                <span className="text-neutral-500">{t(labelKey)}</span>
                <span className="font-medium text-neutral-800">{row.enabled ? `${row.start} - ${row.end}` : '-'}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-3">{t('nodeWizard.section_fulfillment')}</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700 font-medium">{t('nodeWizard.fulfillment_pickup_store')}</span>
            <FulfillmentBadge active={f.fulfillment.pickupFromStore} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700 font-medium">{t('nodeWizard.fulfillment_pickup_point')}</span>
            <FulfillmentBadge active={f.fulfillment.pickupPoint} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-700 font-medium">{t('nodeWizard.fulfillment_ship_from_store')}</span>
            <FulfillmentBadge active={f.fulfillment.shipFromStore} />
          </div>
        </div>
      </div>
    </div>
  )
}
