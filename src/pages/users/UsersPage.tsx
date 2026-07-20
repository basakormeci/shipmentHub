import { useState, type ReactNode } from 'react'
import { useDataStore } from '../../stores/dataStore'
import { useUsersStore } from '../../stores/usersStore'
import { USER_ROLES } from '../../data/seed'
import type { User, UserRole, UserStatus } from '../../data/seed'
import { fmtDateTimeStr } from '../../lib/format'
import { toast } from '../../lib/toast'
import { Dropdown } from '../../components/ui/Dropdown'

function UserModal({
  open,
  editId,
  onClose,
}: {
  open: boolean
  editId: number | null
  onClose: () => void
}) {
  const users = useUsersStore((s) => s.users)
  const upsertUser = useUsersStore((s) => s.upsertUser)
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
            <Dropdown
              value={role}
              onChange={(v) => setRole(v as UserRole)}
              options={(Object.keys(USER_ROLES) as UserRole[]).map((k) => ({ value: k, label: USER_ROLES[k].label }))}
            />
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
  const removeUser = useUsersStore((s) => s.removeUser)
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

const ROLE_ICONS: Record<UserRole, { icon: ReactNode; color: string }> = {
  admin: {
    color: '#ad1f2b',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 4.556-3.04 8.408-7.2 9.632a1.9 1.9 0 01-1.6 0C7.04 20.408 4 16.556 4 12V7.236a2 2 0 011.106-1.789l6-3a2 2 0 011.789 0l6 3A2 2 0 0121 7.236V12z" />
      </svg>
    ),
  },
  operation: {
    color: '#2547d0',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
  reporting: {
    color: '#6b7280',
    icon: (
      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.5l4.5-4.5 3.75 3.75L20.25 4.5M20.25 4.5h-5.25M20.25 4.5v5.25M3 19.5h18" />
      </svg>
    ),
  },
}

function RoleChip({ role }: { role: UserRole }) {
  const meta = ROLE_ICONS[role]
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap" style={{ color: meta.color }}>
      {meta.icon}
      {USER_ROLES[role].label}
    </span>
  )
}

function UserRow({ user, index }: { user: User; index: number }) {
  const toggleUserStatus = useUsersStore((s) => s.toggleUserStatus)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const even = index % 2 === 0
  const hasLoggedIn = !!user.lastLogin && user.lastLogin !== '-'

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
          <RoleChip role={user.role} />
        </td>
        <td className="px-5 py-3.5">
          <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-passive'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-[#1fc16b]' : 'bg-neutral-400'}`} />
            {user.status === 'active' ? 'Aktif' : 'Pasif'}
          </span>
        </td>
        <td className="px-5 py-3.5 text-neutral-500 text-[13px]">
          {hasLoggedIn ? fmtDateTimeStr(user.lastLogin) : <span className="text-neutral-400">Henüz giriş yapmadı</span>}
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
                user.status === 'active' ? 'hover:text-[#e16614] hover:bg-[#fff3eb]' : 'hover:text-[#178c4e] hover:bg-[#e3f7ec]'
              }`}
              type="button"
              title={user.status === 'active' ? 'Pasife Al' : 'Aktife Al'}
              onClick={toggleStatus}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-[#ad1f2b] hover:bg-[#ffebec] transition-colors flex-shrink-0"
              type="button"
              title="Sil"
              onClick={() => setDeleteOpen(true)}
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
      {editOpen ? <UserModal open editId={user.id} onClose={() => setEditOpen(false)} /> : null}
      {deleteOpen ? <UserDeleteModal user={user} onClose={() => setDeleteOpen(false)} /> : null}
    </>
  )
}

import { TabBar } from '../../components/ui/TabBar'
import { PERMISSION_MATRIX_MODULES } from '../../data/catalog'

export function UsersPage() {
  const users = useUsersStore((s) => s.users)
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
