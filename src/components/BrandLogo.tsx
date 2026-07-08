import logoUrl from '../assets/omnitive-logo.png'
import markUrl from '../assets/omnitive-mark.png'
import markBlackUrl from '../assets/omnitive-mark-black.png'

type BrandLogoProps = {
  /** Visual height in px */
  height?: number
  className?: string
  /** Show product label under Omnitive wordmark */
  showProductName?: boolean
  productName?: string
  align?: 'start' | 'center'
}

/** Omnitive lockup (mark + wordmark). Transparent PNG for light UI. */
export function BrandLogo({
  height = 28,
  className = '',
  showProductName = false,
  productName = 'Shipment Hub',
  align = 'start',
}: BrandLogoProps) {
  return (
    <div
      className={`flex flex-col gap-1 min-w-0 ${align === 'center' ? 'items-center' : 'items-start'} ${className}`}
    >
      <img
        src={logoUrl}
        alt="Omnitive"
        style={{ height, width: 'auto' }}
        className="block object-contain max-w-full"
        draggable={false}
      />
      {showProductName ? (
        <span className="text-[11px] font-semibold text-neutral-500 tracking-wide truncate">{productName}</span>
      ) : null}
    </div>
  )
}

type BrandMarkProps = {
  size?: number
  className?: string
  /** Sidebar / light UI: use black mark instead of brand green */
  tone?: 'green' | 'black'
}

/** Mark only (no Omnitive wordmark). */
export function BrandMark({ size = 32, className = '', tone = 'green' }: BrandMarkProps) {
  return (
    <img
      src={tone === 'black' ? markBlackUrl : markUrl}
      alt=""
      width={size}
      height={size}
      className={`block object-contain ${className}`}
      draggable={false}
    />
  )
}

/** App product lockup for sidebar: black mark + “Shipment Hub”. */
export function AppBrand({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      <BrandMark size={28} tone="black" className="flex-shrink-0" />
      <p className="text-[14.5px] font-bold text-ink-950 leading-tight truncate">Shipment Hub</p>
    </div>
  )
}
