/**
 * İçerik şekli. `en.json` ve `tr.json` bu tiplere uyar; sağlayıcı
 * (`src/i18n.tsx`) dili değiştirdiğinde türetilmiş listeleri yeniden kurar.
 */

export const LOCALES = ['en', 'tr'] as const
export type Locale = (typeof LOCALES)[number]

export type Project = {
  id: string
  /** Ana sayfada öne çıkan kaset mi? */
  featured: boolean
  /** Kaset üzerindeki oyun adı */
  name: string
  /** Etiketin sol alt köşesi */
  role: string
  /** Etiketin sağ alt köşesi */
  years: string
  /** Etiketin sol alt köşesinin üst satırı */
  location: string
  /** Kabuk rengi (plastik) */
  shell: string
  /** Etiket zemin rengi */
  label: string
  /** Etiket kapağı için resim: `public/` altından yol ya da tam URL (opsiyonel) */
  image?: string
  /** Etiket dokusu: scan | beam | dots (resim yoksa kullanılır) */
  art: string
  summary: string
  tags: string[]
  link?: string
  /**
   * Detay sayfasının uzun içeriği.
   * `detail` yoksa sayfa yine açılır, sadece kısa özet gösterilir.
   * Her alan opsiyoneldir: boş olan bölüm hiç render edilmez.
   */
  detail?: {
    /** başlığın altındaki tek satır özet */
    lede?: string
    /** ana açıklama — bir veya birka�� paragraf */
    description?: string[]
    /** yapılan işlerin listesi */
    features?: string[]
    /** kullanılan teknolojiler */
    stack?: string[]
    /** kaynak kodu */
    repo?: string
    /** canlı demo */
    demo?: string
  }
}

export type LinkRow = {
  title: string
  note?: string
  meta?: string
  href?: string
}

export type AboutSection = {
  heading: string
  body: string[]
}

export type SiteInfo = {
  name: string
  fullName: string
  handle: string
  title: string
  city: string
  location: string
  email: string
  socials: { label: string; href: string }[]
}

export type UiStrings = {
  /** hedef dile geçişin açıklaması — ekran okuyucu ve tooltip için */
  switchTo: string
  nav: { home: string; projects: string; contact: string }
  home: {
    /** `**...**` ile kalın parçalar işaretlenir */
    headline: string
    ctaPrimary: string
    ctaSecondary: string
    availability: string
    sceneCaption: string
    aboutHeading: string
    selectedHeading: string
    /** `{count}` yerine tutucu */
    all: string
    skillsHeading: string
    funHeading: string
    feedHeading: string
    contactHeading: string
    capabilities: string[][]
    quickFacts: string[][]
  }
  projects: {
    kicker: string
    headline: string
    lead: string
    moreHeading: string
    cassetteUnit: string
    contactHeading: string
  }
  project: {
    back: string
    overview: string
    features: string
    stack: string
    links: string
    repo: string
    demo: string
  }
  contact: {
    kicker: string
    /** `**...**` ile kalın parçalar */
    headline: string
    lead: string
    emailLabel: string
    emailNote: string
    elsewhere: string
    elsewhereNote: string
    availability: string
    responseTime: string
    /** `{location}` yerine tutucu */
    basedIn: string
  }
  notFound: {
    code: string
    kicker: string
    title: string
    body: string
    back: string
    projects: string
    /** sahte kaset etiketinde görünen oyun adı */
    label: string
    sceneCaption: string
  }
  footer: { pages: string; else: string; builtWith: string }
  theme: {
    toDark: string
    toLight: string
    darkTitle: string
    lightTitle: string
  }
  link: { visit: string }
}

export type Content = {
  site: SiteInfo
  about: AboutSection[]
  cassettes: Project[]
  funList: LinkRow[]
  feed: LinkRow[]
  ui: UiStrings
}

/** Bir sözlükten türetilmiş, hazır içerik. */
export type ResolvedContent = {
  site: SiteInfo
  about: AboutSection[]
  projects: Project[]
  /** Ana sayfada gösterilen öne çıkan kasetler */
  featured: Project[]
  funList: LinkRow[]
  feed: LinkRow[]
}