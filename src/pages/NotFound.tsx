import { CassetteTile } from '@/components/three/CassetteTile'
import { Action } from '@/components/ui'
import { useContent, useT } from '@/i18n'
import type { Project } from '@/data/site'

/**
 * Boş yuvada duran kaset.
 *
 * Etiketi ve kâğıt dokusu 404 için üretiliyor; oyun adı "404", rol "Not found".
 * Kabuk rengi gri — rafta duran ama oynatılmayan bir kaset gibi.
 */
const MISSING: Project = {
  id: '__missing__',
  featured: false,
  name: '404',
  role: 'Not found',
  years: '—',
  location: 'NO SLOT',
  shell: '#26262c',
  label: '#7d7d76',
  art: 'dots',
  summary: '',
  tags: [],
}

/** Var olmayan sayfa — yerine başka bir kaset konulmuş boş bir kutu. */
export default function NotFound() {
  const t = useT()
  const { site } = useContent()
  const n = t.notFound

  return (
    <section className="grid min-h-[100svh] grid-cols-1 items-center gap-x-4 px-6 md:gap-x-8 lg:grid-cols-2 lg:gap-x-16 lg:px-10">
      <div className="flex flex-col justify-center pt-32 pb-10 lg:py-28">
        <p className="label text-mute">{n.kicker}</p>

        <h1 className="mt-6 text-[clamp(3rem,9vw,7.5rem)] leading-[0.86] tracking-[-0.055em]">
          {n.code}
        </h1>

        <h2 className="mt-7 max-w-[22ch] text-[clamp(1.2rem,2.2vw,1.75rem)] leading-[1.24] tracking-[-0.025em]">
          {n.title}
        </h2>

        <p className="mt-5 max-w-[46ch] text-[17px] leading-relaxed text-ink-soft">{n.body}</p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Action href="/">{n.back}</Action>
          <Action href="/projects" variant="outline" arrow={false}>
            {n.projects}
          </Action>
        </div>

        {/* tek çizgili alt künye — sitenin geri kalanıyla aynı dil */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-hair pt-6 label text-mute">
          <span>{n.label}</span>
          <span className="h-3 w-px bg-hair-strong" aria-hidden="true" />
          <span>{site.location}</span>
        </div>
      </div>

      <div className="relative h-[46vh] w-full pb-10 sm:h-[54vh] lg:h-[62svh] lg:pb-0">
        <CassetteTile project={MISSING} className="h-full" />
      </div>
    </section>
  )
}