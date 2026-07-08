import { useDataStore } from '../stores/dataStore'
import { USER_ROLES } from '../data/seed'
import type { UserRole } from '../data/seed'
import { PERMISSION_MATRIX_MODULES } from '../data/catalog'

export function PermissionsPage() {
  const permissionMatrix = useDataStore((s) => s.permissionMatrix)
  const togglePermission = useDataStore((s) => s.togglePermission)
  const roles = Object.keys(USER_ROLES) as UserRole[]

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
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
    </div>
  )
}
