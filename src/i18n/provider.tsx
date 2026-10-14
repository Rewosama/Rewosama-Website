import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { DICTIONARIES, I18nContext, applyLocale, readLocale } from './index'
import type { I18nValue } from './index'
import type { Locale } from '@/data/site'

/** Uygulamayı sarar: dil durumunu tutar ve türetilmiş içeriği üretir. */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)

  useEffect(() => {
    applyLocale(locale)
  }, [locale])

  // sekme başlığı da dile uysun
  useEffect(() => {
    const { fullName, title } = DICTIONARIES[locale].site
    document.title = `${fullName} — ${title}`
  }, [locale])

  // başka sekmede değişirse takip et
  useEffect(() => {
    const sync = () => {
      const next = readLocale()
      setLocaleState(next)
      document.documentElement.lang = next
    }
    window.addEventListener('storage', sync)
    window.addEventListener('localechange', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('localechange', sync)
    }
  }, [])

  const setLocale = useCallback((l: Locale) => setLocaleState(l), [])
  const other: Locale = locale === 'en' ? 'tr' : 'en'
  const setOther = useCallback(() => setLocaleState(other), [other])

  const value = useMemo<I18nValue>(() => {
    const dict = DICTIONARIES[locale]
    return {
      locale,
      setLocale,
      other,
      setOther,
      t: dict.ui,
      content: {
        site: dict.site,
        about: dict.about,
        projects: dict.cassettes,
        featured: dict.cassettes.filter((p) => p.featured),
        funList: dict.funList,
        feed: dict.feed,
      },
    }
  }, [locale, setLocale, other, setOther])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}