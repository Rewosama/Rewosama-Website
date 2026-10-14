import { useTheme } from '@/theme'
import { useT } from '@/i18n'
import { iconButtonClass } from './interaction'

function Sun({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 2.6v2.3M12 19.1v2.3M21.4 12h-2.3M4.9 12H2.6M18.6 5.4l-1.6 1.6M7 17l-1.6 1.6M18.6 18.6 17 17M7 7 5.4 5.4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Moon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 14.4A8.4 8.4 0 0 1 9.6 4a8.4 8.4 0 1 0 10.4 10.4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Tema düğmesi — çerçevesiz, sadece ikon. Üzerine gelince yumuşak bir
 * daire çıkar, ikonlar ölçeklenerek birbirinin yerine geçer.
 */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useTheme()
  const t = useT()
  const dark = theme === 'dark'
  const label = dark ? t.theme.toLight : t.theme.toDark
  const title = dark ? t.theme.darkTitle : t.theme.lightTitle

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={label}
      title={title}
      className={iconButtonClass(`relative ${className}`)}
    >
      <Sun
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dark ? 'scale-50 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        className={`absolute h-[18px] w-[18px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          dark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 rotate-90 opacity-0'
        }`}
      />
    </button>
  )
}