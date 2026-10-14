import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const KEY = 'rewosama-theme'
const EVENT = 'themechange'

export function currentTheme(): Theme {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** Sınıfı değiştirir, tercihi saklar, dinleyenleri uyarır. */
export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    /* özel mod */
  }
  window.dispatchEvent(new Event(EVENT))
}

/** Başka bir sekmede değişirse de güncellenir. */
export function useTheme(): [Theme, (t: Theme) => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  useEffect(() => {
    const onChange = () => setTheme(currentTheme())
    window.addEventListener(EVENT, onChange)
    window.addEventListener('storage', onChange)
    return () => {
      window.removeEventListener(EVENT, onChange)
      window.removeEventListener('storage', onChange)
    }
  }, [])

  return [theme, applyTheme]
}

/** Rengi açar (amount > 0) veya koyultur (amount < 0). 0..1 aralığı. */
export function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const mix = (c: number) =>
    Math.round(
      amount >= 0 ? c + (255 - c) * amount : Math.max(0, Math.min(255, c * (1 + amount))),
    )
  const r = mix((n >> 16) & 255)
  const g = mix((n >> 8) & 255)
  const b = mix(n & 255)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}