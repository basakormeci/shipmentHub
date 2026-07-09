export interface DonutSegment {
  key: string
  label: string
  value: number
  color: string
}

/** Proportion-of-whole donut with a centered total and a percentage legend. */
export function Donut({
  segments,
  centerLabel,
  centerSub,
  size = 150,
}: {
  segments: DonutSegment[]
  centerLabel: string
  centerSub: string
  size?: number
}) {
  const total = segments.reduce((sum, s) => sum + s.value, 0)
  const radius = 70
  const circumference = 2 * Math.PI * radius
  let acc = 0
  const arcs = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const dash = total > 0 ? (s.value / total) * circumference : 0
      const offset = -acc
      acc += dash
      return { ...s, dash, offset }
    })

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 200 200" className="flex-shrink-0">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="#f2f5f8" strokeWidth="26" />
        <g transform="rotate(-90 100 100)">
          {arcs.map((a) => (
            <circle
              key={a.key}
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke={a.color}
              strokeWidth="26"
              strokeDasharray={`${a.dash} ${circumference}`}
              strokeDashoffset={a.offset}
            />
          ))}
        </g>
        <text x="100" y="97" textAnchor="middle" style={{ fontSize: 20, fontWeight: 800, fill: '#0e121b' }}>
          {centerLabel}
        </text>
        <text x="100" y="113" textAnchor="middle" style={{ fontSize: 8.5, fontWeight: 600, fill: '#99a0ae' }}>
          {centerSub}
        </text>
      </svg>
      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-sm flex-shrink-0" style={{ background: s.color }} />
            <span className="text-neutral-600 flex-1 min-w-0 truncate">{s.label}</span>
            <span className="font-semibold text-neutral-800" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {total > 0 ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
