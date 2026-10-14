import { Link, NavLink, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { CassetteGlyph } from './icons'
import { ThemeToggle } from './ThemeToggle'
import { NavUnderline } from './ui'
import { navItemClass } from './interaction'
import { useContent, useLocale, useT } from '@/i18n'

/**
 * Tek bir navbar öğesi. İç bağlantı, harici bağlantı ve düğme aynı
 * görünümü paylaşır; sadece davranış değişir.
 */
function NavItem({
  to,
  href,
  active = false,
  onClick,
  title,
  children,
}: {
  to?: string
  href?: string
  active?: boolean
  onClick?: () => void
  title?: string
  children: ReactNode
}) {
  const className = navItemClass(active)
  const underline = <NavUnderline active={active} />

  if (onClick) {
    return (
      <button type="button" onClick={onClick} title={title} className={className}>
        {children}
        {underline}
      </button>
    )
  }

  if (to) {
    return (
      <NavLink to={to} title={title} className={className}>
        {children}
        {underline}
      </NavLink>
    )
  }

  return (
    <a href={href} title={title} className={className}>
      {children}
      {underline}
    </a>
  )
}

export function Nav() {
  const t = useT()
  const { site } = useContent()
  const { other, setLocale } = useLocale()
  const { pathname } = useLocation()
  const isActive = (to: string) => (to === '/' ? pathname === '/' : pathname.startsWith(to))

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-paper via-paper/95 to-paper/0 backdrop-blur-[2px]" />

      <div className="relative mx-auto flex max-w-[1600px] items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-6 sm:py-5 md:px-10">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
          aria-label={site.fullName}
        >
          <CassetteGlyph className="h-5 w-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6" />
          <span className="text-[14px] font-medium tracking-tight sm:text-[15px]">{site.fullName}</span>
        </Link>

        <nav className="flex items-center gap-3 text-[13.5px] sm:gap-7 sm:text-[15px]">
          <NavItem to="/" active={isActive('/')}>
            {t.nav.home}
          </NavItem>
          <NavItem to="/projects" active={isActive('/projects')}>
            {t.nav.projects}
          </NavItem>
          <NavItem to="/contact" active={isActive('/contact')}>
            {t.nav.contact}
          </NavItem>

          <span className="h-4 w-px bg-hair" aria-hidden="true" />

          {/* dil düğmesi — hedef dilin kodunu gösterir, aktif nav gibi görünür */}
          <NavItem onClick={() => setLocale(other)} title={t.switchTo}>
            <span aria-hidden="true">{other.toUpperCase()}</span>
          </NavItem>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}