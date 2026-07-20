/** Flat pill-shaped multi-select chip — active items fill with primary color + checkmark.
 * Used wherever several of a small option set can be selected at once (checkboxes felt too
 * "form-y" for this; chips read as a lighter, more scannable selection UI). */
export function ToggleChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-sm font-medium transition-colors ${
        active ? 'bg-primary border-primary text-white' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
      }`}
    >
      {active ? (
        <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      ) : null}
      {label}
    </button>
  )
}
