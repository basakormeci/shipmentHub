import { NODE_GROUPS, type NodeForm } from '../../lib/nodes'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

function FulfillmentRow({ label, val, onToggle }: { label: string; val: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-neutral-100 last:border-b-0">
      <span className="text-sm font-medium text-neutral-700">{label}</span>
      <button type="button" className={`toggle-track ${val ? 'on' : 'off'}`} onClick={onToggle}>
        <div className="toggle-thumb" />
      </button>
    </div>
  )
}

export function NodeStep3({
  f,
  errors,
  onChange,
}: {
  f: NodeForm
  errors: Record<string, string>
  onChange: (patch: Partial<NodeForm>) => void
}) {
  const t = useT()

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="form-label">
          {t('nodeWizard.field_group')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown
          error={!!errors.group}
          value={f.group}
          onChange={(v) => onChange({ group: v })}
          placeholder={t('nodeWizard.group_placeholder')}
          options={NODE_GROUPS.map((g) => ({ value: g, label: g }))}
        />
        {errors.group ? <p className="form-error">{errors.group}</p> : null}
      </div>

      <div>
        <label className="form-label">{t('nodeWizard.field_daily_limit')}</label>
        <input
          type="text"
          inputMode="numeric"
          className="form-input"
          value={f.dailyAssignmentLimit}
          onChange={(e) => onChange({ dailyAssignmentLimit: e.target.value })}
        />
      </div>

      <div className="col-span-2">
        <div className="h-px bg-neutral-100 my-1" />
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mt-4 mb-2">{t('nodeWizard.section_fulfillment')}</p>
        <FulfillmentRow
          label={t('nodeWizard.fulfillment_pickup_store')}
          val={f.fulfillment.pickupFromStore}
          onToggle={() => onChange({ fulfillment: { ...f.fulfillment, pickupFromStore: !f.fulfillment.pickupFromStore } })}
        />
        <FulfillmentRow
          label={t('nodeWizard.fulfillment_pickup_point')}
          val={f.fulfillment.pickupPoint}
          onToggle={() => onChange({ fulfillment: { ...f.fulfillment, pickupPoint: !f.fulfillment.pickupPoint } })}
        />
        <FulfillmentRow
          label={t('nodeWizard.fulfillment_ship_from_store')}
          val={f.fulfillment.shipFromStore}
          onToggle={() => onChange({ fulfillment: { ...f.fulfillment, shipFromStore: !f.fulfillment.shipFromStore } })}
        />
      </div>
    </div>
  )
}
