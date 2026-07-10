import { TIME_OPTIONS, WEEKDAYS, type NodeForm } from '../../lib/nodes'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

const TIME_DROPDOWN_OPTIONS = TIME_OPTIONS.map((t) => ({ value: t, label: t }))
const DEADLINE_DROPDOWN_OPTIONS = [{ value: '', label: '--:--' }, ...TIME_DROPDOWN_OPTIONS]

export function NodeStep2({ f, onChange }: { f: NodeForm; onChange: (patch: Partial<NodeForm>) => void }) {
  const t = useT()

  function updateDay(day: number, patch: Partial<NodeForm['workingHours'][number]>) {
    onChange({
      workingHours: f.workingHours.map((w) => (w.day === day ? { ...w, ...patch } : w)),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      {WEEKDAYS.map(({ day, labelKey }) => {
        const row = f.workingHours.find((w) => w.day === day)!
        return (
          <div key={day} className="flex items-center gap-6 py-2 border-b border-neutral-100 last:border-b-0">
            <div className="w-32 flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                className={`toggle-track ${row.enabled ? 'on' : 'off'}`}
                onClick={() => updateDay(day, { enabled: !row.enabled, start: !row.enabled ? row.start || '06:00' : row.start, end: !row.enabled ? row.end || '20:00' : row.end })}
              >
                <div className="toggle-thumb" />
              </button>
              <span className="text-sm font-medium text-neutral-700">{t(labelKey)}</span>
            </div>
            {row.enabled ? (
              <div className="flex items-center gap-5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 whitespace-nowrap">{t('nodeWizard.start_time')}:</span>
                  <Dropdown
                    wrapperStyle={{ width: 110 }}
                    value={row.start}
                    onChange={(v) => updateDay(day, { start: v })}
                    options={TIME_DROPDOWN_OPTIONS}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 whitespace-nowrap">{t('nodeWizard.end_time')}:</span>
                  <Dropdown
                    wrapperStyle={{ width: 110 }}
                    value={row.end}
                    onChange={(v) => updateDay(day, { end: v })}
                    options={TIME_DROPDOWN_OPTIONS}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400 whitespace-nowrap">{t('nodeWizard.shipping_deadline')}:</span>
                  <Dropdown
                    wrapperStyle={{ width: 110 }}
                    value={row.shippingDeadline}
                    onChange={(v) => updateDay(day, { shippingDeadline: v })}
                    options={DEADLINE_DROPDOWN_OPTIONS}
                  />
                </div>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
