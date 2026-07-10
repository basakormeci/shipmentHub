import { PROVINCES } from '../../data/catalog'
import { NODE_TYPES, type NodeForm } from '../../lib/nodes'
import { useT } from '../../hooks/useT'
import { Dropdown } from '../../components/ui/Dropdown'

function getProvince(id: number | '') {
  if (id === '') return undefined
  return PROVINCES.find((p) => p.id === id)
}

export function NodeStep1({
  f,
  errors,
  onChange,
}: {
  f: NodeForm
  errors: Record<string, string>
  onChange: (patch: Partial<NodeForm>) => void
}) {
  const t = useT()
  const province = getProvince(f.provinceId)

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <label className="form-label">
          {t('nodeWizard.field_id')} <span className="text-[#fb3748]">*</span>
        </label>
        <input
          type="text"
          className={`form-input ${errors.id ? 'error' : ''}`}
          value={f.id}
          placeholder={t('nodeWizard.id_placeholder')}
          onChange={(e) => onChange({ id: e.target.value })}
        />
        {errors.id ? <p className="form-error">{errors.id}</p> : null}
      </div>

      <div>
        <label className="form-label">
          {t('nodeWizard.field_name')} <span className="text-[#fb3748]">*</span>
        </label>
        <input
          type="text"
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={f.name}
          placeholder={t('nodeWizard.name_placeholder')}
          onChange={(e) => onChange({ name: e.target.value })}
        />
        {errors.name ? <p className="form-error">{errors.name}</p> : null}
      </div>

      <div>
        <label className="form-label">
          {t('nodeWizard.field_type')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown
          value={f.type}
          onChange={(v) => onChange({ type: v as NodeForm['type'] })}
          options={NODE_TYPES.map((o) => ({ value: o.value, label: t(o.labelKey) }))}
        />
      </div>

      <div>
        <label className="form-label">
          {t('nodeWizard.field_country')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown value={f.country} onChange={(v) => onChange({ country: v })} options={[{ value: f.country, label: f.country }]} />
      </div>

      <div>
        <label className="form-label">
          {t('nodeWizard.field_city')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown
          error={!!errors.provinceId}
          value={f.provinceId === '' ? '' : String(f.provinceId)}
          onChange={(v) => onChange({ provinceId: v ? +v : '', district: '' })}
          placeholder={t('nodeWizard.city_placeholder')}
          options={PROVINCES.map((p) => ({ value: String(p.id), label: p.name }))}
        />
        {errors.provinceId ? <p className="form-error">{errors.provinceId}</p> : null}
      </div>

      <div>
        <label className="form-label">
          {t('nodeWizard.field_district')} <span className="text-[#fb3748]">*</span>
        </label>
        <Dropdown
          error={!!errors.district}
          value={f.district}
          disabled={!province}
          onChange={(v) => onChange({ district: v })}
          placeholder={t('nodeWizard.district_placeholder')}
          options={(province?.districts ?? []).map((d) => ({ value: d, label: d }))}
        />
        {errors.district ? <p className="form-error">{errors.district}</p> : null}
      </div>

      <div className="col-span-2">
        <label className="form-label">
          {t('nodeWizard.field_address')} <span className="text-[#fb3748]">*</span>
        </label>
        <input
          type="text"
          className={`form-input ${errors.address ? 'error' : ''}`}
          value={f.address}
          placeholder={t('nodeWizard.address_placeholder')}
          onChange={(e) => onChange({ address: e.target.value })}
        />
        {errors.address ? <p className="form-error">{errors.address}</p> : null}
      </div>
    </div>
  )
}
