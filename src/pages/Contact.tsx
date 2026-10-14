import { CassetteTile } from '@/components/three/CassetteTile'
import { ArrowUpRight } from '@/components/icons'
import { Action, RichText } from '@/components/ui'
import { ARROW } from '@/components/interaction'
import { useContent, useT } from '@/i18n'
import type { Project } from '@/data/site'

/** İletişim kaseti — "seni ara" teması yerine sitedeki dil. */
const CONTACT: Project = {
  id: '__contact__',
  featured: false,
  name: 'Write to me',
  role: 'Open channel',
  years: '—',
  location: 'REPLY',
  shell: '#1e2a22',
  label: '#4c7d59',
  art: 'scan',
  summary: '',
  tags: [],
}

/**
 * İletişim sayfası.
 *
 * E-posta birincil kanal; sosyal linkler ikincil. Aynı `Action` / `TextLink`
 * dili kullanılıyor, kopyalanmış buton stili yok.
 */
export default function Contact() {
  const t = useT()
  const { site } = useContent()
  const c = t.contact

  const facts: [string, string][] = [
    [c.availability, c.responseTime],
    [c.basedIn.replace('{location}', site.location), c.elsewhereNote],
  ]

  return (
    <article>
      {/* ---------------- üst: başlık + iletişim kaseti ---------------- */}
      <header className="grid min-h-[100svh] grid-cols-1 items-center gap-x-4 px-6 md:gap-x-8 lg:grid-cols-2 lg:gap-x-16 lg:px-10">
        <div className="flex flex-col justify-center pt-32 pb-10 lg:py-28">
          <p className="label text-mute">{c.kicker}</p>

          <h1 className="mt-6 max-w-[15ch] text-[clamp(2.2rem,5.2vw,4.5rem)] leading-[1.04] tracking-[-0.035em]">
            <RichText text={c.headline} />
          </h1>

          <p className="mt-7 max-w-[46ch] text-[clamp(1rem,1.25vw,1.12rem)] leading-[1.5] tracking-[-0.01em] text-ink-soft">
            {c.lead}
          </p>

          <div className="mt-10">
            <Action href={`mailto:${site.email}`}>{site.email}</Action>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="label text-mute">{c.availability}</span>
          </div>
        </div>

        <div className="relative h-[46vh] w-full pb-10 sm:h-[56vh] lg:h-[62svh] lg:pb-0">
          <CassetteTile project={CONTACT} className="h-full" />
        </div>
      </header>

      {/* ---------------- gövde ---------------- */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* kısa künye */}
        <section className="border-t border-hair py-16">
          <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-hair pt-6">
                <dt className="text-[16px] font-medium tracking-tight">{k}</dt>
                <dd className="mt-2 text-[16px] text-ink-soft">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* e-posta — sayfa üzerinde de erişilebilir kalsın */}
        <section className="grid gap-x-16 gap-y-4 border-t border-hair py-16 md:grid-cols-[220px_1fr]">
          <h2 className="label text-mute">{c.emailLabel}</h2>
          <div>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">
              {c.emailNote}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-5 inline-flex items-center gap-2 text-[clamp(1.15rem,2vw,1.6rem)] tracking-[-0.02em] transition-colors hover:text-ink-soft"
            >
              {site.email}
              <ArrowUpRight className={`text-mute group-hover:text-ink ${ARROW}`} />
            </a>
          </div>
        </section>

        {/* sosyal linkler */}
        <section className="grid gap-x-16 gap-y-4 border-t border-hair py-16 md:grid-cols-[220px_1fr]">
          <h2 className="label text-mute">{c.elsewhere}</h2>
          <div>
            <p className="max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">
              {c.elsewhereNote}
            </p>
            <ul className="mt-5">
              {site.socials.map((s) => (
                <li key={s.label} className="border-b border-hair last:border-b-0">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between gap-6 py-4"
                  >
                    <span className="text-[17px] text-ink-soft transition-colors group-hover:text-ink">
                      {s.label}
                    </span>
                    <ArrowUpRight className={`shrink-0 text-mute group-hover:text-ink ${ARROW}`} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>

      </div>
    </article>
  )
}