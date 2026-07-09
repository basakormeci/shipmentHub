import { useState } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { TEMPLATE_TRIGGERS, TEMPLATE_VARS, type NotifyTemplate, type TemplateType } from '../../data/catalog'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'

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
        <td className="px-5 py-3.5 font-medium text-neutral-700">{tpl.name}</td>
        <td className="px-5 py-3.5">
          <span className={`badge ${tpl.type === 'sms' ? 'badge-info' : 'badge-passive'}`}>
            {tpl.type === 'sms' ? 'SMS' : 'Email'}
          </span>
        </td>
        <td className="px-5 py-3.5 text-neutral-500">{TEMPLATE_TRIGGERS[tpl.trigger]}</td>
        <td className="px-5 py-3.5">
          <span className={`badge ${tpl.active ? 'badge-active' : 'badge-passive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${tpl.active ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
            {tpl.active ? 'Aktif' : 'Pasif'}
          </span>
        </td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1.5 justify-end">
            <button className="action-btn btn-edit" type="button" onClick={() => setEditOpen(true)}>
              Düzenle
            </button>
            <button className={`action-btn ${tpl.active ? 'btn-passive' : 'btn-toggle'}`} type="button" onClick={toggle}>
              {tpl.active ? 'Pasife Al' : 'Aktife Al'}
            </button>
            <button className="action-btn btn-delete" type="button" onClick={remove}>
              Sil
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
