import { Link } from 'react-router-dom'
import { CassetteGlyph } from './icons'
import { NavUnderline } from './ui'
import { navItemClass } from './interaction'
import { useContent, useT } from '@/i18n'

const YEAR = new Date().getFullYear()

export function Footer() {
  const t = useT()
  const { site } = useContent()

  return (
    <footer className="mx-auto max-w-[1600px] px-6 pb-10 pt-16 md:px-10">
      <div className="border-t border-hair pt-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <CassetteGlyph className="h-6 w-6" />
            <p className="mt-4 max-w-xs text-[15px] leading-snug text-ink-soft">
              {site.title}, {site.location}.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="label text-mute">{t.footer.pages}</p>
              <ul className="mt-4 space-y-2 text-[15px]">
                <li>
                  <Link to="/" className={navItemClass(false)}>
                    {t.nav.home}
                    <NavUnderline active={false} />
                  </Link>
                </li>
                <li>
                  <Link to="/projects" className={navItemClass(false)}>
                    {t.nav.projects}
                    <NavUnderline active={false} />
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className={navItemClass(false)}>
                    {t.nav.contact}
                    <NavUnderline active={false} />
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="label text-mute">{t.footer.else}</p>
              <ul className="mt-4 space-y-2 text-[15px]">
                {site.socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className={navItemClass(false)}
                    >
                      {s.label}
                      <NavUnderline active={false} />
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${site.email}`} className={navItemClass(false)}>
                    {site.email}
                    <NavUnderline active={false} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 text-[13px] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {YEAR} {site.fullName}
          </p>
          <p>{t.footer.builtWith}</p>
        </div>
      </div>
    </footer>
  )
}