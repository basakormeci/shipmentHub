export function StatTile({ label, value, suffix = '' }: { label: string; value: string | number; suffix?: string }) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 px-4 py-3">
      <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl font-semibold text-neutral-950 tracking-tight">
        {value}
        {suffix ? <span className="text-sm font-medium text-neutral-500">{suffix}</span> : null}
      </p>
    </div>
  )
}

export function PageCard({
  title,
  action,
  children,
}: {
  title?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
      {(title || action) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-neutral-100">
          {title ? <p className="text-sm font-semibold text-neutral-950">{title}</p> : <span />}
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
