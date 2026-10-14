/** Küçük kaset ikonu — logo ve liste işaretleri için. */
export function CassetteGlyph({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      {/* siluet: üstü dik, alt köşeleri pah */}
      <path
        d="M6 3.5h20a1.5 1.5 0 0 1 1.5 1.5v16.6l-5.2 5.4a1.5 1.5 0 0 1-1.1.5H10.8a1.5 1.5 0 0 1-1.1-.5L4.5 21.6V5A1.5 1.5 0 0 1 6 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* etiket */}
      <rect x="7.6" y="6.6" width="16.8" height="11" rx="1.1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8.8 6.6h14.4a1.1 1.1 0 0 1 1.1 1.1v1.9H7.7V7.7a1.1 1.1 0 0 1 1.1-1.1Z" fill="currentColor" />
      {/* tutuş tırtıkları */}
      <path d="M9.6 20.2v4M12.6 20.2v4M15.6 20.2v4M18.6 20.2v4M21.6 20.2v4"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/** Konum işareti — şehir/ülke satırlarında. */
export function MapPin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 14.5S13 10.2 13 6.9A5 5 0 1 0 3 6.9C3 10.2 8 14.5 8 14.5Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="6.9" r="1.7" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

export function ArrowUpRight({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={className} aria-hidden="true">
      <path
        d="M4.5 11.5 11.5 4.5M5.5 4.5h6v6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}