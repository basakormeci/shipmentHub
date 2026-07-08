export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { key: string; label: string }[]
  active: string
  onChange: (k: string) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      {tabs.map((tb) => (
        <button
          key={tb.key}
          type="button"
          className={`filter-tab ${active === tb.key ? 'active' : ''}`}
          onClick={() => onChange(tb.key)}
        >
          {tb.label}
        </button>
      ))}
    </div>
  )
}
