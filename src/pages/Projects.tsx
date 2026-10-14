import { Link } from 'react-router-dom'
import { CassetteTile } from '@/components/three/CassetteTile'
import { ArrowUpRight } from '@/components/icons'
import { ARROW } from '@/components/interaction'
import { RichText } from '@/components/ui'
import { ContactCta, SectionHead } from '@/components/sections'
import { useContent, useT } from '@/i18n'

export default function Projects() {
  const t = useT()
  const { projects, site } = useContent()

  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-10">
      <div className="lg:grid lg:grid-cols-[1fr_1.6fr] lg:gap-16">
        {/* ---------- Sol: başlık ---------- */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:py-40">
          <section className="pb-16 pt-32 lg:pt-40">
            <p className="label text-mute">{t.projects.kicker}</p>
            <h1 className="mt-6 max-w-[14ch] text-[clamp(1.9rem,4.1vw,3.1rem)] leading-[1.16] tracking-[-0.03em]">
              <RichText text={t.projects.headline} />
            </h1>
            <p className="mt-8 max-w-[38ch] text-[17px] leading-relaxed text-ink-soft">
              {t.projects.lead}
            </p>
          </section>
        </div>

        {/* ---------- Sağ: 3B kartlar ---------- */}
        <div className="pb-24">
          <div className="grid gap-x-10 gap-y-20 pt-32 sm:grid-cols-2 lg:pt-40">
            {projects.map((p) => (
              <article key={p.id}>
                <Link to={`/projects/${p.id}`} className="group block">
                  <CassetteTile project={p} />
                  <div className="mt-6 flex items-baseline justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="truncate text-[19px] font-medium tracking-tight">
                        {p.name}
                      </h2>
                      <p className="mt-1 truncate font-mono text-[12px] uppercase tracking-[0.14em] text-mute">
                        {p.role} · {p.years}
                      </p>
                    </div>
                    <ArrowUpRight className={`text-mute group-hover:text-ink ${ARROW}`} />
                  </div>
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-20 border-t border-hair pt-10">
            <SectionHead
              title={t.projects.moreHeading}
              meta={`${String(projects.length).padStart(2, '0')} ${t.projects.cassetteUnit}`}
            />
            <ContactCta heading={t.projects.contactHeading} email={site.email} />
          </div>
        </div>
      </div>
    </div>
  )
}