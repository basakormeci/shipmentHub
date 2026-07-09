interface KpiDelta {
  text: string
  tone: 'good' | 'bad' | 'neutral'
  direction: 'up' | 'down'
}

export function KpiTile({
  label,
  value,
  unit,
  valueColor,
  delta,
  note,
}: {
  label: string
  value: string
  unit?: string
  valueColor?: string
  delta?: KpiDelta
  note?: string
}) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 px-4 py-3.5">
      <p className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <span className="text-[22px] font-bold tracking-tight" style={{ color: valueColor ?? '#0e121b' }}>
          {value}
        </span>
        {unit ? <span className="text-[13px] text-neutral-500 font-medium">{unit}</span> : null}
      </div>
      {delta ? (
        <div
          className="flex items-center gap-1 text-[11px] font-bold mt-1.5"
          style={{ color: delta.tone === 'good' ? '#178c4e' : delta.tone === 'bad' ? '#ad1f2b' : '#99a0ae' }}
        >
          <svg className="w-2.5 h-2.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            {delta.direction === 'up' ? (
              <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
          {delta.text}
        </div>
      ) : note ? (
        <p className="text-[11px] text-neutral-400 font-medium mt-1.5">{note}</p>
      ) : null}
    </div>
  )
}
