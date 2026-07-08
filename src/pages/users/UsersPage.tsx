import { useState } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { USER_ROLES } from '../../data/seed'
import type { User, UserRole, UserStatus } from '../../data/seed'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'

function UserModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const users = useDataStore((s) => s.users)
  const upsertUser = useDataStore((s) => s.upsertUser)
  const existing = editId != null ? users.find((u) => u.id === editId) : null

  const [name, setName] = useState(existing?.name ?? '')
  const [email, setEmail] = useState(existing?.email ?? '')
  const [role, setRole] = useState<UserRole>(existing?.role ?? 'operation')
  const [status, setStatus] = useState<UserStatus>(existing?.status ?? 'active')

  if (!open) return null

  const canSave = name.trim() && email.trim()

  function save() {
    if (!canSave) return
    const user = upsertUser({ id: editId, name: name.trim(), email: email.trim(), role, status })
    toast(editId ? `"${user.name}" kullanıcısı güncellendi.` : `"${user.name}" kullanıcısı oluşturuldu.`, 'success')
    onClose()
  }

  return (
    <div
      className="overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="modal-box w-full max-w-md p-6">
        <h3 className="font-semibold text-neutral-950 mb-4">{editId ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı Ekle'}</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label className="form-label">
              Ad Soyad <span className="text-[#fb3748]">*</span>
            </label>
            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">
              E-posta <span className="text-[#fb3748]">*</span>
            </label>
            <input type="text" inputMode="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Rol</label>
            <select className="form-input" value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {(Object.keys(USER_ROLES) as UserRole[]).map((k) => (
                <option key={k} value={k}>
                  {USER_ROLES[k].label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
            <p className="text-sm font-medium text-neutral-950">Aktif Kullanıcı</p>
            <button
              type="button"
              className={`toggle-track ${status === 'active' ? 'on' : 'off'}`}
              onClick={() => setStatus(status === 'active' ? 'passive' : 'active')}
            >
              <div className="toggle-thumb" />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
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

function UserDeleteModal({ user, onClose }: { user: User | null; onClose: () => void }) {
  const removeUser = useDataStore((s) => s.removeUser)
  if (!user) return null

  function confirm() {
    const deleted = removeUser(user!.id)
    toast(deleted ? `"${deleted.name}" kullanıcısı silindi.` : 'Kullanıcı silindi.', 'info')
    onClose()
  }

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
            <h3 className="font-semibold text-neutral-950 mb-1">Kullanıcıyı Sil</h3>
            <p className="text-sm text-neutral-500">
              <strong className="text-neutral-700">{user.name}</strong> kullanıcısını silmek istediğinizden emin misiniz?
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button className="secondary-btn" type="button" onClick={onClose}>
            Vazgeç
          </button>
          <button className="primary-btn" style={{ background: '#fb3748' }} type="button" onClick={confirm}>
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  )
}

function UserRow({ user, index }: { user: User; index: number }) {
  const toggleUserStatus = useDataStore((s) => s.toggleUserStatus)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const role = USER_ROLES[user.role]
  const even = index % 2 === 0

  function toggleStatus() {
    const updated = toggleUserStatus(user.id)
    if (updated) {
      toast(`"${updated.name}" ${updated.status === 'active' ? 'aktif edildi' : 'pasife alındı'}.`, updated.status === 'active' ? 'success' : 'info')
    }
  }

  return (
    <>
      <tr className={`${even ? 'bg-white' : 'bg-neutral-50/50'} hover:bg-primary-lighter/20 transition-colors`}>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary-lighter flex items-center justify-center text-primary-darker font-bold text-xs flex-shrink-0">
              {user.name.slice(0, 1)}
            </div>
            <span className="font-medium text-neutral-700">{user.name}</span>
          </div>
        </td>
        <td className="px-5 py-3.5 text-neutral-500">{user.email}</td>
        <td className="px-5 py-3.5">
          <span className={`badge ${role.badge}`}>{role.label}</span>
        </td>
        <td className="px-5 py-3.5">
          <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-passive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
            {user.status === 'active' ? 'Aktif' : 'Pasif'}
          </span>
        </td>
        <td className="px-5 py-3.5 text-neutral-500 text-[13px]">{fmtDateTimeStr(user.lastLogin)}</td>
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1.5 justify-end">
            <button className="action-btn btn-edit" type="button" onClick={() => setEditOpen(true)}>
              Düzenle
            </button>
            <button
              className={`action-btn ${user.status === 'active' ? 'btn-passive' : 'btn-toggle'}`}
              type="button"
              onClick={toggleStatus}
            >
              {user.status === 'active' ? 'Pasife Al' : 'Aktife Al'}
            </button>
            <button className="action-btn btn-delete" type="button" onClick={() => setDeleteOpen(true)}>
              Sil
            </button>
          </div>
        </td>
      </tr>
      {editOpen ? <UserModal open editId={user.id} onClose={() => setEditOpen(false)} /> : null}
      {deleteOpen ? <UserDeleteModal user={user} onClose={() => setDeleteOpen(false)} /> : null}
    </>
  )
}

import { TabBar } from '../../components/ui/TabBar'
import { PERMISSION_MATRIX_MODULES } from '../../data/catalog'

export function UsersPage() {
  const users = useDataStore((s) => s.users)
  const permissionMatrix = useDataStore((s) => s.permissionMatrix)
  const togglePermission = useDataStore((s) => s.togglePermission)
  const roles = Object.keys(USER_ROLES) as UserRole[]

  const [activeTab, setActiveTab] = useState('users')
  const [createOpen, setCreateOpen] = useState(false)

  const tabs = [
    { key: 'users', label: 'Kullanıcı Listesi' },
    { key: 'permissions', label: 'Rol Bazlı Yetki Matrisi' },
  ]

  return (
    <div className="page-container flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <TabBar tabs={tabs} active={activeTab} onChange={setActiveTab} />
        {activeTab === 'users' && (
          <button className="primary-btn" type="button" onClick={() => setCreateOpen(true)}>
            Yeni Kullanıcı Ekle
          </button>
        )}
      </div>

      {activeTab === 'users' ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500">{users.length} kullanıcı tanımlı — rol bazlı yetkilendirme (RBAC)</p>
          </div>

          <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-neutral-100">
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Ad Soyad</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">E-posta</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rol</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Durum</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Son Giriş</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <UserRow key={u.id} user={u} index={i} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
          <div className="px-5 py-3.5 border-b border-neutral-100">
            <p className="text-sm font-semibold text-neutral-950">Rol Bazlı Yetki Matrisi</p>
            <p className="text-xs text-neutral-400 mt-0.5">Her rol için modül bazlı erişim yetkilerini yönetin</p>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-100">
                <th className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Modül</th>
                {roles.map((role) => (
                  <th key={role} className="px-5 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider text-center">
                    {USER_ROLES[role].label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {PERMISSION_MATRIX_MODULES.map((mod, mi) => (
                <tr key={mod}>
                  <td className="px-5 py-3 font-medium text-neutral-700">{mod}</td>
                  {roles.map((role) => (
                    <td key={role} className="px-5 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={permissionMatrix[role][mi]}
                        onChange={() => togglePermission(role, mi)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {createOpen ? <UserModal open editId={null} onClose={() => setCreateOpen(false)} /> : null}
    </div>
  )
}
