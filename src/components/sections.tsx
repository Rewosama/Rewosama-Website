import type { ReactNode } from 'react'
import { TextLink } from './ui'
import { useT } from '@/i18n'
import type { LinkRow, Project } from '@/data/site'

/** Bölüm başlığı + sağda sayaç/bağlantı. */
export function SectionHead({ title, meta }: { title: string; meta?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6">
      <h2 className="text-[22px] font-medium tracking-tight">{title}</h2>
      {meta && <span className="font-mono text-[13px] text-mute">{meta}</span>}
    </div>
  )
}

/** Künye satırı: solda başlık, sağda açıklama. */
export function MetaRow({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="border-b border-hair py-7">
      <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:gap-14">
        <p className="shrink-0 text-[17px] font-medium tracking-tight md:w-52">
          {title}
        </p>
        <p className="max-w-[56ch] text-[17px] leading-relaxed text-ink-soft">{desc}</p>
      </div>
    </li>
  )
}

/** Künye listesi — ince çizgilerle ayrılmış satırlar. */
export function MetaList({ items }: { items: string[][] }) {
  return (
    <ul className="mt-10 border-t border-hair">
      {items.map(([title, desc]) => (
        <MetaRow key={title} title={title} desc={desc} />
      ))}
    </ul>
  )
}

/** Etiket üstte, metin altında — dar sütunlarda sıkışmaz. */
export function TextBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="label text-mute">{label}</p>
      <div className="mt-6 max-w-[44ch] space-y-5 text-[17px] leading-relaxed text-ink-soft">
        {children}
      </div>
    </div>
  )
}

/** Proje satırı — yedek bileşen. */
export function ProjectRow({
  project,
  index,
  active = true,
}: {
  project: Project
  index: number
  active?: boolean
}) {
  const t = useT()

  return (
    <article
      className="border-b border-hair py-14 transition-opacity duration-500"
      style={{ opacity: active ? 1 : 0.42 }}
    >
      <div className="flex items-center gap-3 font-mono text-[13px] text-mute">
        <span>{String(index + 1).padStart(2, '0')}</span>
        <span className="h-px w-8 bg-hair-strong" />
        <span>{project.years}</span>
        <span className="ml-auto uppercase tracking-[0.14em]">{project.location}</span>
      </div>

      <h3 className="mt-5 text-[clamp(1.9rem,4.2vw,3.1rem)] leading-none tracking-[-0.035em]">
        {project.name}
      </h3>

      <p className="mt-3 label text-mute">{project.role}</p>
      <p className="mt-6 max-w-[44ch] text-[17px] leading-relaxed text-ink-soft">
        {project.summary}
      </p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {project.tags.map((t) => (
          <li
            key={t}
            className="rounded-full border border-hair px-3 py-1 font-mono text-[12px] tracking-wide text-mute"
          >
            {t}
          </li>
        ))}
      </ul>

      {project.link && (
        <TextLink
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="mt-8 text-[16px]"
        >
          {t.link.visit}
        </TextLink>
      )}
    </article>
  )
}

/** "Eğleniyorum" / "Günlük" gibi bağlantı listeleri. */
export function LinkList({ title, rows }: { title: string; rows: LinkRow[] }) {
  return (
    <section>
      <h2 className="text-[22px] font-medium tracking-tight">{title}</h2>
      <ul className="mt-6">
        {rows.map((r) => (
          <li key={r.title} className="border-b border-hair">
            <a
              href={r.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-baseline gap-2.5 py-3 text-[16px] transition-opacity duration-300 hover:opacity-55"
            >
              <span className="truncate">{r.title}</span>
              {r.note && <span className="truncate text-mute">{r.note}</span>}
              {r.meta && <span className="ml-auto shrink-0 text-mute">{r.meta}</span>}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Sayfa sonundaki iletişim bloğu. */
export function ContactCta({ heading, email }: { heading: string; email: string }) {
  return (
    <section className="pt-24">
      <h2 className="max-w-[16ch] text-[clamp(2rem,4.4vw,3.4rem)] leading-[1.1] tracking-[-0.035em]">
        {heading}
      </h2>
      <TextLink
        href={`mailto:${email}`}
        className="mt-8 text-[clamp(1.05rem,1.8vw,1.4rem)]"
      >
        {email}
      </TextLink>
    </section>
  )
}