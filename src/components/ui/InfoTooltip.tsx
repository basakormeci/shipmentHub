/** Small "i" icon that reveals an explanatory tooltip on hover — pure CSS (group/group-hover),
 * no positioning JS needed since it's always used inline next to a short label. */
export function InfoTooltip({ text }: { text: string }) {
  return (
    <span className="relative inline-flex group align-middle ml-1">
      <span className="w-3.5 h-3.5 rounded-full bg-neutral-200 text-neutral-500 text-[10px] font-bold flex items-center justify-center cursor-help">
        i
      </span>
      <span
        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg bg-neutral-900 text-white text-xs leading-relaxed px-3 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity z-50"
        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
      >
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-neutral-900 rotate-45" />
      </span>
    </span>
  )
}
