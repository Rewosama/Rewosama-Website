import type { ReactNode } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { CassetteTile } from '@/components/three/CassetteTile'
import { ArrowUpRight } from '@/components/icons'
import { ARROW } from '@/components/interaction'
import { useContent, useT } from '@/i18n'

/** Adresi kısa biçime çevirir: https://github.com/x/y → github.com/x/y */
function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
}

/** Dış bağlantı satırı — kod deposu ve canlı demo için. */
function LinkRow({ href, label, children }: { href: string; label: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-6 border-b border-hair py-4 transition-colors hover:border-hair-strong"
    >
      <span className="flex items-baseline gap-4">
        <span className="label w-24 shrink-0 text-mute">{label}</span>
        <span className="truncate text-[16px] text-ink-soft transition-colors group-hover:text-ink">
          {children}
        </span>
      </span>
      <ArrowUpRight className={`shrink-0 text-mute group-hover:text-ink ${ARROW}`} />
    </a>
  )
}

/**
 * Tek kasetin detay sayfası.
 *
 * Her bölüm JSON'dan geliyor ve opsiyonel: alan yoksa o bölüm hiç
 * render edilmiyor. Sıra — özet, açıklama, özellikler, teknolojiler, bağlantılar.
 */
export default function ProjectDetail() {
  const { id } = useParams()
  const t = useT()
  const { projects } = useContent()

  const project = projects.find((x) => x.id === id)
  if (!project) return <Navigate to="/404" replace />

  const p = t.project
  const d = project.detail

  const has = (v?: { length?: number }) => Array.isArray(v) && v.length > 0
  const description = d?.description?.length ? d.description : [project.summary]
  const features = d?.features ?? []
  const stack = d?.stack ?? []
  const hasLinks = Boolean(d?.repo || d?.demo)

  return (
    <article>
      {/* ---------------- üst: kaset + kimlik kartı ---------------- */}
      <header className="grid min-h-[100svh] grid-cols-1 items-center gap-x-4 px-6 md:gap-x-8 lg:grid-cols-2 lg:gap-x-16 lg:px-10">
        <div className="flex flex-col justify-center pt-32 pb-10 lg:py-28">
          <Link
            to="/projects"
            className="group mb-8 inline-flex w-fit items-center gap-2 text-[15px] text-mute transition-colors hover:text-ink"
          >
            <span
              aria-hidden="true"
              className="transition-transform duration-300 group-hover:-translate-x-0.5"
            >
              ←
            </span>
            {p.back}
          </Link>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
            <span>{project.role}</span>
            <span aria-hidden="true">·</span>
            <span>{project.years}</span>
            <span aria-hidden="true">·</span>
            <span>{project.location}</span>
          </div>

          <h1 className="mt-6 text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.035em]">
            {project.name}
          </h1>

          {d?.lede && (
            <p className="mt-7 max-w-[44ch] text-[clamp(1.02rem,1.3vw,1.15rem)] leading-[1.5] tracking-[-0.01em] text-ink-soft">
              {d.lede}
            </p>
          )}

          {has(stack) && (
            <>
              <p className="label mt-9 text-mute">{p.stack}</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px] text-ink-soft">
                {stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="relative h-[46vh] w-full pb-10 sm:h-[56vh] lg:h-[62svh] lg:pb-0">
          <CassetteTile project={project} className="h-full" />
        </div>
      </header>

      {/* ---------------- gövde ---------------- */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* açıklama */}
        <section className="border-t border-hair py-20">
          <div className="grid gap-x-16 gap-y-6 md:grid-cols-[220px_1fr]">
            <h2 className="label text-mute">{p.overview}</h2>
            <div className="max-w-[62ch] space-y-6">
              {description.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 24)}
                  className="text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.45] tracking-[-0.02em]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* özellikler */}
        {has(features) && (
          <section className="border-t border-hair py-20">
            <h2 className="label text-mute">{p.features}</h2>
            <ul className="mt-10 columns-1 gap-x-16 sm:columns-2">
              {features.map((feature) => (
                <li
                  key={feature.slice(0, 24)}
                  className="flex gap-4 break-inside-avoid border-t border-hair py-5 text-[17px] leading-snug text-ink-soft"
                >
                  <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-mute" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* bağlantılar */}
        {hasLinks && (
          <section className="border-t border-hair py-16">
            <h2 className="label mb-6 text-mute">{p.links}</h2>
            {d?.repo && (
              <LinkRow href={d.repo} label={p.repo}>
                {prettyUrl(d.repo)}
              </LinkRow>
            )}
            {d?.demo && (
              <LinkRow href={d.demo} label={p.demo}>
                {prettyUrl(d.demo)}
              </LinkRow>
            )}
          </section>
        )}

      </div>
    </article>
  )
}