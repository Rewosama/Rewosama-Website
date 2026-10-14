import { copyFileSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

/** Sondaki eğik çizgiyi atıp protokolü tamamlar. */
function normalizeSite(value?: string) {
  const raw = value?.trim()
  if (!raw) return ''
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProto.replace(/\/+$/, '')
}

/**
 * Paylaşım görseli etiketlerini mutlak URL'ye çevirir.
 *
 * `og:image` göreli yolla da çalışır ama Slack, WhatsApp ve Facebook gibi
 * bazı platformlar göreli adresi çözemeyip görseli atlayabiliyor. Site adresi
 * build ortamından gelir — kodda hiçbir yer yazmana gerek yok:
 *
 *   Vercel  → VERCEL_PROJECT_PRODUCTION_URL, onu bulamazsa VERCEL_URL
 *              ikisi de Vercel tarafından otomatik verilir
 *   yerel   → SITE_URL=... ile; hiçbiri yoksa göreli yol olduğu gibi kalır
 *
 * Alan adı sonradan değişirse tek yapman gereken: Vercel'de ortam
 * değişkeni olarak `SITE_URL` tanımlamak. Öncelik sırası bu yüzden
 * SITE_URL > VERCEL_PROJECT_PRODUCTION_URL > VERCEL_URL.
 */
function absoluteOgUrls(): Plugin {
  const site = normalizeSite(
    process.env.SITE_URL ??
      process.env.VERCEL_PROJECT_PRODUCTION_URL ??
      process.env.VERCEL_URL ??
      'https://rewosama.vercel.app',
  )

  return {
    name: 'og-absolute-urls',
    // Sadece üretimde: geliştirmede gereksiz iş
    apply: 'build',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        if (!site) return html
        return html
          .replaceAll('content="/og.png"', `content="${site}/og.png"`)
          .replaceAll('property="og:url" content="/"', `property="og:url" content="${site}/"`)
      },
    },
  }
}

/**
 * SPA derlemesinde `404.html` üretir.
 *
 * Vercel (ve Netlify) bilinmeyen adreslerde `index.html`'i değil `404.html`'i
 * arıyor. O dosya olmazsa sunucunun kendi hata sayfası dönüyor ve React
 * hiç çalışmıyor — bu yüzden kendi 404 sayfamız yerine Vercel'in kutusu
 * görünüyor.
 *
 * Aynı dosya kopyalandığı için uygulama içindeki `path="*"` rotası da aynı
 * sayfayı gösteriyor; sunucu 404 kodu dönerken sayfa doğru render ediliyor.
 */
function spaFallbackHtml(): Plugin {
  return {
    name: 'spa-404-html',
    apply: 'build',
    // Vite 8'de closeBundle build sırasında çalışmıyor; writeBundle güvenilir.
    writeBundle(options, bundle) {
      const outDir = options.dir ?? resolve(dirname(fileURLToPath(import.meta.url)), 'dist')
      const index = resolve(outDir, 'index.html')
      // index.html bu bundle'da değilse tekrar dene
      const fromBundle = Object.values(bundle).find((c) => c.fileName === 'index.html')
      if (!existsSync(index)) {
        if (!fromBundle) return
        copyFileSync(resolve(outDir, fromBundle.fileName), index)
      }
      copyFileSync(index, resolve(outDir, '404.html'))
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), absoluteOgUrls(), spaFallbackHtml()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes('node_modules/three') ||
            id.includes('node_modules/@react-three') ||
            id.includes('node_modules/three-stdlib')
          ) {
            return 'three-vendor'
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})