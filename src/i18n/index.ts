import { createContext, useContext } from 'react'
import en from '../data/en.json'
import tr from '../data/tr.json'
import { LOCALES } from '../data/site'
import type { Content, Locale, ResolvedContent, UiStrings } from '../data/site'

/* Varsayılan dil İngilizce. Tercih localStorage'da tutulur; ilk girişte
   işletim sistemi dili yok sayılır, yani site daima İngilizce açılır. */

export const DICTIONARIES: Record<Locale, Content> = { en, tr }
export const LOCALE_KEY = 'rewosama-locale'
export const DEFAULT_LOCALE: Locale = 'en'

export type I18nValue = {
  locale: Locale
  setLocale: (l: Locale) => void
  /** hedef dil */
  other: Locale
  /** diğer dile geçiş */
  setOther: () => void
  /** arayüz metinleri */
  t: UiStrings
  /** sayfa içeriği */
  content: ResolvedContent
}

export function isLocale(v: unknown): v is Locale {
  return typeof v === 'string' && (LOCALES as readonly string[]).includes(v)
}

export function readLocale(): Locale {
  try {
    const saved = localStorage.getItem(LOCALE_KEY)
    if (isLocale(saved)) return saved
  } catch {
    /* özel mod */
  }
  return DEFAULT_LOCALE
}

/** `<html lang>` ve localStorage'ı günceller, dinleyenleri uyarır. */
export function applyLocale(locale: Locale) {
  document.documentElement.lang = locale
  try {
    localStorage.setItem(LOCALE_KEY, locale)
  } catch {
    /* özel mod */
  }
  window.dispatchEvent(new Event('localechange'))
}

export const I18nContext = createContext<I18nValue | null>(null)

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n, I18nProvider içinde kullanılmalı')
  return ctx
}

/** Arayüz metinleri (`t.nav.contact` gibi). */
export function useT(): UiStrings {
  return useI18n().t
}

/** Sayfa içeriği — dil değişince yeniden türetilir. */
export function useContent(): ResolvedContent {
  return useI18n().content
}

/** Dil değiştirmek için: `{ locale, other, setOther, setLocale }`. */
export function useLocale() {
  const { locale, other, setOther, setLocale } = useI18n()
  return { locale, other, setOther, setLocale }
}