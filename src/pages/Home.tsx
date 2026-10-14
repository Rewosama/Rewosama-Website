import { Link } from 'react-router-dom'
import { AtariScene } from '@/components/three/AtariScene'
import { CassetteTile } from '@/components/three/CassetteTile'
import { ArrowUpRight, MapPin } from '@/components/icons'
import { Action, RichText } from '@/components/ui'
import { ARROW, textLinkClass } from '@/components/interaction'
import {
  ContactCta,
  LinkList,
  MetaList,
  SectionHead,
  TextBlock,
} from '@/components/sections'
import { useContent, useT } from '@/i18n'

export default function Home() {
  const t = useT()
  const { about, feed, featured, funList, projects, site } = useContent()
  const lead = about[0].body[0]

  return (
    <>
      {/* ---------------- Hero — tam ekran, Atari sağda ---------------- */}
      <section className="grid min-h-[100svh] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-6 pt-32 pb-14 md:px-10 lg:col-start-1 lg:row-start-1 lg:py-28 lg:pr-14 xl:pr-24">
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-mute" />
            <span className="label text-mute">{site.location}</span>
          </div>
          <p className="label mt-8 text-mute">{site.title}</p>

          <h1 className="mt-6 max-w-[17ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.16] tracking-[-0.03em]">
            <RichText text={t.home.headline} />
          </h1>

          <p className="mt-10 max-w-[46ch] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.5] tracking-[-0.01em] text-ink-soft">
            {lead}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-3">
            <Action href="#work">{t.home.ctaPrimary}</Action>
            <Action href={`mailto:${site.email}`} variant="outline" arrow={false}>
              {t.home.ctaSecondary}
            </Action>
          </div>

          <div className="mt-12 flex items-center gap-3 label text-mute">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {t.home.availability}
          </div>
        </div>

        {/* 3B — büyük ekranda sağ yarıyı kaplar.
            Üstte navbar, altta başlık için pay bırakılıyor ki model
            hiçbir döndürme açısında ikisinin de üstüne binmesin. */}
        <div className="relative h-[50vh] w-full lg:col-start-2 lg:row-start-1 lg:h-auto">
          <div className="absolute inset-x-0 top-14 bottom-12 lg:top-20 lg:bottom-16">
            <AtariScene className="absolute inset-0" />
          </div>
          <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center font-mono text-[12px] uppercase tracking-[0.18em] text-mute">
            {t.home.sceneCaption}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-6 md:px-10">
        {/* ---------------- Hakkımda ---------------- */}
      <section className="border-t border-hair py-24">
        <SectionHead title={t.home.aboutHeading} />

        {/* 3 bölüm — Başlangıç, Yaptığım iş, Boşta */}
        <div className="mt-14 grid gap-x-16 gap-y-12 md:grid-cols-3">
          {about.map((section) => (
            <TextBlock key={section.heading} label={section.heading}>
              {section.body.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </TextBlock>
          ))}
        </div>

        {/* hızlı bilgiler */}
        <dl className="mt-20 grid grid-cols-2 gap-x-10 gap-y-8 border-t border-hair pt-10 sm:grid-cols-4">
          {t.home.quickFacts.map(([k, v]) => (
            <div key={k}>
              <dt className="label text-mute">{k}</dt>
              <dd className="mt-3 text-[16px] text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ---------------- Seçili işler: tam ekran, 3 kaset yan yana ---------------- */}
      <section
        id="work"
        className="flex min-h-[100svh] scroll-mt-16 flex-col justify-center border-t border-hair py-16"
      >
        <SectionHead
          title={t.home.selectedHeading}
          meta={
            <Link to="/projects" className={textLinkClass()}>
              {t.home.all.replace('{count}', String(projects.length))}
              <ArrowUpRight className={ARROW} />
            </Link>
          }
        />

        <div className="mt-10 grid grid-cols-3 gap-x-3 gap-y-12 sm:gap-x-6">
          {featured.map((p) => (
            <Link
              key={p.id}
              to={`/projects/${p.id}`}
              className="group flex flex-col items-center text-center"
            >
              <CassetteTile project={p} />
              <div className="mt-4 w-full sm:mt-5">
                <div className="flex items-baseline justify-center gap-1.5 sm:gap-2">
                  <h3 className="truncate text-[15px] font-medium tracking-tight sm:text-[20px]">
                    {p.name}
                  </h3>
                  <ArrowUpRight className={`hidden text-mute group-hover:text-ink sm:block ${ARROW}`} />
                </div>
                <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mute sm:text-[12px]">
                  {p.role} · {p.years}
                </p>
                <p className="mx-auto mt-3 hidden max-w-[34ch] text-[15px] leading-relaxed text-ink-soft sm:block">
                  {p.summary}
                </p>
                <ul className="mt-4 hidden flex-wrap justify-center gap-1.5 sm:flex">
                  {p.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-hair px-2.5 py-0.5 font-mono text-[11px] tracking-wide text-mute"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- Yetenekler ---------------- */}
      <section className="border-t border-hair py-24">
        <SectionHead title={t.home.skillsHeading} />
        <MetaList items={t.home.capabilities} />
      </section>

      {/* ---------------- Listeler ---------------- */}
      <div className="grid gap-12 border-t border-hair pt-16 sm:grid-cols-2 sm:gap-10">
        <LinkList title={t.home.funHeading} rows={funList} />
        <LinkList title={t.home.feedHeading} rows={feed} />
      </div>

      <ContactCta heading={t.home.contactHeading} email={site.email} />
      </div>
    </>
  )
}