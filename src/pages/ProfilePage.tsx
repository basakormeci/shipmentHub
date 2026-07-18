import { useAuthStore } from '../stores/authStore'
import { useUsersStore } from '../stores/usersStore'
import { USER_ROLES } from '../data/seed'
import { useT } from '../hooks/useT'

export function ProfilePage() {
  const t = useT()
  const userId = useAuthStore((s) => s.userId)
  const users = useUsersStore((s) => s.users)
  const user = users.find((u) => u.id === userId) ?? null

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center text-neutral-500">
          {t('common.unknown')}
        </div>
      </div>
    )
  }

  const roleMeta = USER_ROLES[user.role]
  const initials = user.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="max-w-3xl mx-auto px-6 py-6 flex flex-col gap-6">
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-primary-lighter text-primary-darker flex items-center justify-center text-lg font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <h2 className="text-base font-semibold text-neutral-950">{user.name}</h2>
            <p className="text-xs text-neutral-400 mt-0.5">{roleMeta.label}</p>
          </div>
        </div>

        <div className="p-6 flex flex-col gap-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">{t('login.email')}</p>
              <p className="text-neutral-700 font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Durum</p>
              <span className={`badge ${user.status === 'active' ? 'badge-active' : 'badge-passive'} mt-1`}>
                {user.status === 'active' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>

          <div className="h-px bg-neutral-100 my-2" />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Kullanıcı Rolü</p>
              <p className="text-neutral-700 font-medium">{roleMeta.label}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Son Giriş Tarihi</p>
              <p className="text-neutral-700 font-medium">
                {user.lastLogin !== '-' ? new Date(user.lastLogin).toLocaleString('tr-TR') : '-'}
              </p>
            </div>
          </div>

          <div className="h-px bg-neutral-100 my-2" />

          <div>
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider mb-1">Sistem Yetkileri</p>
            <p className="text-neutral-500 text-xs mt-1 leading-relaxed">
              Bu kullanıcı hesabı <strong>{roleMeta.label}</strong> rolüne sahip olduğu için sistemdeki ilgili operasyonel ve yönetsel yetkilere sahiptir. Yetki tanımlamalarınızı düzenlemek için sistem yöneticinizle iletişime geçebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
