import { useState, type ReactNode } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { TEMPLATE_TRIGGERS, TEMPLATE_VARS, type NotifyTemplate, type TemplateType } from '../../data/catalog'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'

const TEMPLATE_TYPE_ICONS: Record<TemplateType, ReactNode> = {
  sms: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
      />
    </svg>
  ),
  email: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  ),
}

function templatePreview(body: string) {
  const sample: Record<string, string> = {
    musteri_adi: 'Ayşe Yılmaz',
    siparis_no: '61234501',
    takip_no: 'YK-2026-0091823-TR',
    kargo_firmasi: 'Yurtiçi Kargo',
  }
  let out = body
  TEMPLATE_VARS.forEach((v) => {
    out = out.split(`{{${v}}}`).join(sample[v])
  })
  return out
}

function TemplateModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const templates = useDataStore((s) => s.templates)
  const upsertTemplate = useDataStore((s) => s.upsertTemplate)
  const existing = editId != null ? templates.find((t) => t.id === editId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [type, setType] = useState<TemplateType>(existing?.type ?? 'sms')
  const [trigger, setTrigger] = useState(existing?.trigger ?? 'created')
  const [subject, setSubject] = useState(existing?.subject ?? '')
  const [body, setBody] = useState(existing?.body ?? '')
  const [active, setActive] = useState(existing?.active ?? true)

  if (!open) return null

  const canSave = name.trim()

  function save() {
    if (!canSave) return
    upsertTemplate({ id: editId, name: name.trim(), type, trigger, subject, body, active })
    toast(editId ? 'Şablon güncellendi.' : 'Yeni şablon oluşturuldu.', 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-xl flex flex-col" style={{ maxHeight: '85vh' }}>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Tip</label>
              <Dropdown
                value={type}
                onChange={(v) => setType(v as TemplateType)}
                options={[
                  { value: 'sms', label: 'SMS' },
                  { value: 'email', label: 'Email' },
                ]}
              />
            </div>
            <div>
              <label className="form-label">Tetikleyici Olay</label>
              <Dropdown
                value={trigger}
                onChange={(v) => setTrigger(v)}
                options={Object.keys(TEMPLATE_TRIGGERS).map((k) => ({ value: k, label: TEMPLATE_TRIGGERS[k] }))}
              />
            </div>
          </div>
          {type === 'email' ? (
            <div>
              <label className="form-label">Konu</label>
              <input type="text" className="form-input" value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          ) : null}
          <div>
            <label className="form-label">İçerik</label>
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {TEMPLATE_VARS.map((v) => (
                <button
                  key={v}
                  type="button"
                  className="text-[11px] font-mono bg-primary-lighter text-primary-darker px-2 py-1 rounded-md"
                  onClick={() => setBody((b) => `${b}{{${v}}}`)}
                >
                  {`{{${v}}}`}
                </button>
              ))}
            </div>
            <textarea className="form-input" rows={4} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">Önizleme</p>
            <div className="border border-dashed border-neutral-200 rounded-lg p-3 text-sm text-neutral-600 bg-neutral-50/50 whitespace-pre-line">
              {templatePreview(body) || 'İçerik girildikçe burada görünecek'}
            </div>
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

function TemplateRow({ tpl, index }: { tpl: NotifyTemplate; index: number }) {
  const toggleTemplateActive = useDataStore((s) => s.toggleTemplateActive)
  const removeTemplate = useDataStore((s) => s.removeTemplate)
  const [editOpen, setEditOpen] = useState(false)
  const even = index % 2 === 0

  function toggle() {
    toggleTemplateActive(tpl.id)
    toast(`"${tpl.name}" ${tpl.active ? 'pasife alındı' : 'aktif edildi'}.`, 'info')
  }

  function remove() {
    removeTemplate(tpl.id)
    toast(`"${tpl.name}" silindi.`, 'info')
  }

  return (
    <>
      <tr className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
        <td className="px-5 py-3.5 font-medium text-neutral-700">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-100 text-neutral-500 flex items-center justify-center flex-shrink-0">
              {TEMPLATE_TYPE_ICONS[tpl.type]}
            </div>
            {tpl.name}
          </div>
        </td>
        <td className="px-5 py-3.5 text-neutral-500">{tpl.type === 'sms' ? 'SMS' : 'Email'}</td>
        <td className="px-5 py-3.5 text-neutral-500">{TEMPLATE_TRIGGERS[tpl.trigger]}</td>
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
      {editOpen ? <TemplateModal open editId={tpl.id} onClose={() => setEditOpen(false)} /> : null}
    </>
  )
}

export function TemplatesPage() {
  const templates = useDataStore((s) => s.templates)
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <div className="page-container">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-neutral-500">
          {templates.length} şablon tanımlı — SMS ve e-posta bildirimleri için parametrik metinler
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
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tip</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Tetikleyici Olay</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
              <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((tpl, i) => (
              <TemplateRow key={tpl.id} tpl={tpl} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {createOpen ? <TemplateModal open editId={null} onClose={() => setCreateOpen(false)} /> : null}
    </div>
  )
}
