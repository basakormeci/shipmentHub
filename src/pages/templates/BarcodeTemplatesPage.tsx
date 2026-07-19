import { useState } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { COMPANIES, getCompany, BARCODE_TEMPLATE_FIELDS, PRINT_RESOLUTIONS, type BarcodeTemplate } from '../../data/catalog'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'
import { PrinterTypePicker, BARCODE_FORMAT_ICONS } from '../../components/ui/PrinterTypePicker'

function BarcodeTemplateModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const barcodeTemplates = useDataStore((s) => s.barcodeTemplates)
  const upsertBarcodeTemplate = useDataStore((s) => s.upsertBarcodeTemplate)
  const existing = editId != null ? barcodeTemplates.find((t) => t.id === editId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [companyId, setCompanyId] = useState<number | ''>(existing?.companyId ?? '')
  const [format, setFormat] = useState(existing?.format ?? 'pdf')
  const [resolution, setResolution] = useState(existing?.resolution ?? '203')
  const [requiredFields, setRequiredFields] = useState<string[]>(existing?.requiredFields ?? [])
  const [active, setActive] = useState(existing?.active ?? true)

  if (!open) return null

  const canSave = name.trim() && requiredFields.length > 0

  function toggleField(key: string) {
    setRequiredFields((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  }

  function save() {
    if (!canSave) return
    upsertBarcodeTemplate({
      id: editId,
      name: name.trim(),
      companyId: companyId === '' ? null : companyId,
      format,
      resolution,
      requiredFields,
      active,
    })
    toast(editId ? 'Barkod şablonu güncellendi.' : 'Yeni barkod şablonu oluşturuldu.', 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-lg flex flex-col" style={{ maxHeight: '85vh' }}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 flex-shrink-0">
          <h3 className="font-semibold text-neutral-950">{editId ? 'Şablonu Düzenle' : 'Yeni Şablon Ekle'}</h3>
          <button type="button" className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="form-label">
              Şablon Adı <span className="text-[#fb3748]">*</span>
            </label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Kargo Firması</label>
            <Dropdown
              value={companyId === '' ? '' : String(companyId)}
              onChange={(v) => setCompanyId(v === '' ? '' : +v)}
              placeholder="Tüm Firmalar"
              options={[{ value: '', label: 'Tüm Firmalar' }, ...COMPANIES.map((c) => ({ value: String(c.id), label: c.name }))]}
            />
          </div>
          <div>
            <label className="form-label">Yazıcı Türü</label>
            <PrinterTypePicker value={format} onChange={setFormat} />
          </div>
          <div>
            <label className="form-label">Çözünürlük</label>
            <Dropdown value={resolution} onChange={setResolution} options={PRINT_RESOLUTIONS.map((r) => ({ value: r.key, label: r.label }))} />
          </div>
          <div>
            <label className="form-label">
              Zorunlu Alanlar <span className="text-[#fb3748]">*</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {Object.keys(BARCODE_TEMPLATE_FIELDS).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`filter-tab ${requiredFields.includes(key) ? 'active' : ''}`}
                  onClick={() => toggleField(key)}
                >
                  {BARCODE_TEMPLATE_FIELDS[key]}
                </button>
              ))}
            </div>
            {requiredFields.length === 0 ? (
              <p className="form-error mt-1.5">En az bir zorunlu alan seçilmelidir.</p>
            ) : null}
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
            <p className="text-sm font-medium text-neutral-950">Aktif</p>
            <button
              type="button"
              className={`toggle-track ${active ? 'on' : 'off'}`}
              onClick={() => setActive(!active)}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex-shrink-0">
          <button className="secondary-btn" type="button" onClick={onClose}>
            Vazgeç
          </button>
          <button className="primary-btn" type="button" onClick={save} disabled={!canSave}>
            Kaydet
          </button>
        </div>
      </div>
    </div>
  )
}

function BarcodeTemplateRow({ tpl, index }: { tpl: BarcodeTemplate; index: number }) {
  const toggleBarcodeTemplateActive = useDataStore((s) => s.toggleBarcodeTemplateActive)
  const removeBarcodeTemplate = useDataStore((s) => s.removeBarcodeTemplate)
  const [editOpen, setEditOpen] = useState(false)
  const co = tpl.companyId ? getCompany(tpl.companyId) : null
  const even = index % 2 === 0

  function toggle() {
    toggleBarcodeTemplateActive(tpl.id)
    toast(`"${tpl.name}" ${tpl.active ? 'pasife alındı' : 'aktif edildi'}.`, 'info')
  }

  function remove() {
    removeBarcodeTemplate(tpl.id)
    toast(`"${tpl.name}" silindi.`, 'info')
  }

  return (
    <>
      <tr className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
        <td className="px-5 py-3.5 font-medium text-neutral-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center flex-shrink-0">
              {BARCODE_FORMAT_ICONS[tpl.format]}
            </div>
            {tpl.name}
          </div>
        </td>
        <td className="px-5 py-3.5 text-neutral-500">{co ? co.name : 'Tüm Firmalar'}</td>
        <td className="px-5 py-3.5 text-neutral-500 text-xs">
          {tpl.format.toUpperCase()} · {tpl.resolution} dpi
        </td>
        <td className="px-5 py-3.5 text-neutral-500 text-xs">
          {tpl.requiredFields.map((f) => BARCODE_TEMPLATE_FIELDS[f]).join(', ')}
        </td>
        <td className="px-5 py-3.5">
          <span className={`badge ${tpl.active ? 'badge-active' : 'badge-passive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tpl.active ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
            {tpl.active ? 'Aktif' : 'Pasif'}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1 justify-end">
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-primary hover:bg-neutral-100 transition-colors flex-shrink-0"
              type="button"
              title="Düzenle"
              onClick={() => setEditOpen(true)}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487z"
                />
              </svg>
            </button>
            <button
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 transition-colors flex-shrink-0 ${
                tpl.active ? 'hover:text-[#e16614] hover:bg-[#fff3eb]' : 'hover:text-[#178c4e] hover:bg-[#e3f7ec]'
              }`}
              type="button"
              title={tpl.active ? 'Pasife Al' : 'Aktife Al'}
              onClick={toggle}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
              type="button"
              title="Sil"
              onClick={remove}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9M19.228 5.79a48.437 48.437 0 00-7.227-.437 48.55 48.55 0 00-7.228.437m14.456 0a48.61 48.61 0 013.334.416m-3.334-.416L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.058.68-.113 1.02-.166m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
            </button>
          </div>
        </td>
      </tr>
      {editOpen ? <BarcodeTemplateModal open editId={tpl.id} onClose={() => setEditOpen(false)} /> : null}
    </>
  )
}

export function BarcodeTemplatesPage() {
  const barcodeTemplates = useDataStore((s) => s.barcodeTemplates)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          {barcodeTemplates.length} şablon tanımlı — kargo firmasına göre barkod etiket formatı ve zorunlu alanlar
        </p>
        <button className="primary-btn" type="button" onClick={() => setCreateOpen(true)}>
          Yeni Şablon Ekle
        </button>
      </div>

      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-neutral-100">
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Şablon Adı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Kargo Firması</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Yazıcı</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Zorunlu Alanlar</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {barcodeTemplates.map((tpl, i) => (
              <BarcodeTemplateRow key={tpl.id} tpl={tpl} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {createOpen ? <BarcodeTemplateModal open editId={null} onClose={() => setCreateOpen(false)} /> : null}
    </div>
  )
}
