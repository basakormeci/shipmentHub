export interface StackedBarSegment {
  key: string
  value: number
  color: string
}

export interface StackedBarRow {
  key: string
  name: string
  total: number
  segments: StackedBarSegment[]
}

/** Ranked horizontal stacked-bar list — e.g. per-carrier volume broken down by status. */
export function StackedBarList({ rows }: { rows: StackedBarRow[] }) {
  if (rows.length === 0) {
    return <p className="text-xs text-neutral-400 text-center py-8">Seçili dönemde veri yok</p>
  }
  return (
    <div className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <div key={r.key} className="grid items-center gap-2.5" style={{ gridTemplateColumns: '112px 1fr 46px' }}>
          <span className="text-xs font-semibold text-neutral-700 truncate">{r.name}</span>
          <div className="flex h-3.5 rounded overflow-hidden bg-neutral-100" style={{ gap: 2 }}>
            {r.segments
              .filter((s) => s.value > 0)
              .map((s) => (
                <span
                  key={s.key}
                  style={{ width: `${r.total > 0 ? (s.value / r.total) * 100 : 0}%`, background: s.color }}
                />
              ))}
          </div>
          <span className="text-xs font-bold text-neutral-700 text-right" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {r.total}
          </span>
        </div>
      ))}
    </div>
  )
}
