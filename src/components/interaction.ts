/* Sitedeki tek etkileşim dili. Üç rol, üç kural:
 *
 *  Action   — eylem. Hap şeklinde; dolu ve çerçeveli birbirinin aynası
 *             (dolu hover'da çerçeveli, çerçeveli hover'da dolu olur).
 *  TextLink — satır içi bağlantı. Alt çizgi ve ok birlikte hareket eder.
 *  NavItem  — navbar bağlantısı. Metin + soldan açılan ince çizgi.
 *
 * Hepsi aynı süreyi, aynı easing'i ve aynı ok hareketini paylaşır. */

export const EASE = 'ease-[cubic-bezier(0.16,1,0.3,1)]'
export const T = 'duration-300'

/** Ok her yerde aynı şekilde hareket eder. */
export const ARROW = `h-[1.05em] w-[1.05em] shrink-0 transition-transform ${T} ${EASE} group-hover:-translate-y-0.5 group-hover:translate-x-0.5`

export function textLinkClass(extra = '') {
  return `group inline-flex w-fit items-center gap-1.5 border-b border-hair-strong pb-0.5 transition-colors ${T} ${EASE} hover:border-ink hover:text-ink ${extra}`
}

export function navItemClass(active: boolean) {
  return `group relative py-1 transition-colors ${T} ${EASE} ${
    active ? 'text-ink' : 'text-mute hover:text-ink'
  }`
}

/** Tema düğmesi: nav ile aynı dil — sessiz ikon, hover'da yumuşak daire. */
export function iconButtonClass(extra = '') {
  return `grid h-9 w-9 shrink-0 place-items-center rounded-full text-mute transition-colors ${T} ${EASE} hover:bg-ink/[0.06] hover:text-ink dark:hover:bg-ink/[0.12] ${extra}`
}