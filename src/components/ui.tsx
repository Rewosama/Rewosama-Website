import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from './icons'
import { ARROW, EASE, T, textLinkClass } from './interaction'

/* Sitedeki eylem/bağlantı bileşenleri. Dil kuralları `interaction.ts`
   içinde; orada tanımlı. */

/** Eylem butonu. `solid` ve `outline` birbirinin aynasıdır. */
type ActionProps = {
  variant?: 'solid' | 'outline'
  /** oka ihtiyaç yoksa kapat */
  arrow?: boolean
} & ComponentPropsWithoutRef<'a'>

export function Action({
  variant = 'solid',
  arrow = true,
  className = '',
  children,
  href,
  ...rest
}: ActionProps) {
  const skin =
    variant === 'solid'
      ? 'bg-ink text-paper ring-ink hover:bg-transparent hover:text-ink'
      : 'ring-hair-strong text-ink hover:bg-ink hover:text-paper hover:ring-ink'

  const classes = `group inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[16px] ring-1 ring-inset transition-colors ${T} ${EASE} ${skin} ${className}`

  if (href && href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link to={href} className={classes}>
        {children}
        {arrow && <ArrowUpRight className={ARROW} />}
      </Link>
    )
  }

  return (
    <a
      href={href}
      {...rest}
      className={classes}
    >
      {children}
      {arrow && <ArrowUpRight className={ARROW} />}
    </a>
  )
}

/** Satır içi bağlantı — alt çizgi ve ok birlikte hareket eder. */
type TextLinkProps = { children: ReactNode } & ComponentPropsWithoutRef<'a'>

export function TextLink({ className = '', children, href, ...rest }: TextLinkProps) {
  const classes = textLinkClass(className)

  if (href && href.startsWith('/') && !href.startsWith('//')) {
    return (
      <Link to={href} className={classes}>
        {children}
        <ArrowUpRight className={ARROW} />
      </Link>
    )
  }

  return (
    <a href={href} {...rest} className={classes}>
      {children}
      <ArrowUpRight className={ARROW} />
    </a>
  )
}

/** Aktifse hep açık, değilse hover'da soldan açılır. */
export function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      className={`absolute -bottom-0.5 left-0 h-px bg-current transition-all ${T} ${EASE} ${
        active ? 'w-full' : 'w-0 group-hover:w-full'
      }`}
    />
  )
}

/**
 * Metindeki `**kalın**` parçaları <strong> yapar.
 * Başlıklar iki dile de doğal görünsün diye JSX'i JSON'a taşıyoruz.
 */
export function RichText({ text }: { text: string }) {
  const parts = text.split('**')

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold">
            {part}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  )
}