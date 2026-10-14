/**
 * `public/og.png` üretir — paylaşım görseli.
 *
 * Neden build-time: isim ya da metin `src/data/en.json` içinde değişince
 * görsel de değişsin. Tarayıcı ya da edge runtime gerekmez; sadece Node.
 * Vercel, Netlify, kendi sunucun — hepsinde `npm run build` sırasında çalışır.
 *
 * Çalıştırma:  npm run og
 * (build sırasında da otomatik çağrılır)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import content from '../src/data/en.json'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
// public/ altına yazıyoruz: dev sunucusu oradan servis ediyor,
// `vite build` de public/ içeriğini dist/'e kopyalıyor.
const OUT = process.argv[2] ?? resolve(ROOT, 'public/og.png')

/* Sitenin paleti — src/index.css ile aynı değerler */
const PAPER = '#e8e7e3'
const INK = '#17171b'
const MUTE = '#87878f'
const HAIR = 'rgba(23, 23, 27, 0.14)'

/**
 * `**kalın**` işaretlemesini satori düğümlerine çevirir.
 *
 * satori sarma işlemini yalnızca flex öğeleri arasında yapar; bu yüzden
 * kelimeleri tek tek öğe yapıp satır sonunu doğal bırakıyoruz. Sondaki
 * boşluğu kırptığı için aralığı margin ile veriyoruz.
 */
const PUNCT = /^[,.;:!?)\]\u2014\u2013-]+$/

function richText(text: string) {
  // önce kelimeleri ve kalınlıklarını düz bir listeye indir
  const tokens: { text: string; bold: boolean }[] = []
  text.split('**').forEach((segment, i) => {
    const bold = i % 2 === 1
    segment
      .split(' ')
      .filter(Boolean)
      .forEach((word) => tokens.push({ text: word, bold }))
  })

  // sonraki kelime noktalama ise araya boşluk koyma
  return tokens.map((token, i) => {
    const nextIsPunct = tokens[i + 1] ? PUNCT.test(tokens[i + 1].text) : false
    return (
      <span
        key={i}
        style={{
          fontWeight: token.bold ? 600 : 400,
          marginRight: nextIsPunct ? 0 : '0.24em',
        }}
      >
        {token.text}
      </span>
    )
  })
}

const dataUri = (file: string, mime: string) =>
  `data:${mime};base64,${readFileSync(resolve(ROOT, file)).toString('base64')}`

/** Logo işareti — src/components/icons.tsx'teki CassetteGlyph ile aynı yol. */
const GLYPH = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <path d="M6 3.5h20a1.5 1.5 0 0 1 1.5 1.5v16.6l-5.2 5.4a1.5 1.5 0 0 1-1.1.5H10.8a1.5 1.5 0 0 1-1.1-.5L4.5 21.6V5A1.5 1.5 0 0 1 6 3.5Z"
        stroke="#17171b" stroke-width="1.8" stroke-linejoin="round"/>
  <rect x="7.6" y="6.6" width="16.8" height="11" rx="1.1" stroke="#17171b" stroke-width="1.5"/>
  <path d="M8.8 6.6h14.4a1.1 1.1 0 0 1 1.1 1.1v1.9H7.7V7.7a1.1 1.1 0 0 1 1.1-1.1Z" fill="#17171b"/>
  <path d="M9.6 20.2v4M12.6 20.2v4M15.6 20.2v4M18.6 20.2v4M21.6 20.2v4"
        stroke="#17171b" stroke-width="1.5" stroke-linecap="round"/>
</svg>`

async function main() {
  // satori değişken fontları okuyamıyor, bu yüzden assets/fonts altındaki
  // statik örnekler kullanılıyor (bkz. README > OG görseli).
  const regular = readFileSync(resolve(ROOT, 'assets/fonts/InstrumentSans-Regular.ttf'))
  const semibold = readFileSync(resolve(ROOT, 'assets/fonts/InstrumentSans-SemiBold.ttf'))
  const mono = readFileSync(resolve(ROOT, 'assets/fonts/GeistMono-Regular.ttf'))

  const svg = await satori(
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: 1200,
        height: 630,
        padding: '64px 72px',
        backgroundColor: PAPER,
        color: INK,
        fontFamily: 'Instrument Sans',
      }}
    >
      {/* ---- sol sütun: marka + başlık, altta künye satırı ---- */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: 620,
          height: 502,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 500 }}>
            <img
              src={`data:image/svg+xml;base64,${Buffer.from(GLYPH).toString('base64')}`}
              width={22}
              height={22}
            />
            {content.site.fullName}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: 610,
              marginTop: 42,
              fontSize: 62,
              lineHeight: 1.08,
              letterSpacing: '-2.2px',
            }}
          >
            {richText(content.ui.home.headline)}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            paddingTop: 28,
            borderTop: `1px solid ${HAIR}`,
            color: MUTE,
            fontFamily: 'Geist Mono',
            fontSize: 14,
            letterSpacing: '0.15em',
          }}
        >
          <span>{content.site.title.toUpperCase()}</span>
          <span>·</span>
          <span>{content.site.location.toUpperCase()}</span>
        </div>
      </div>

      {/* ---- sağ sütun: kaset, altta model etiketi ---- */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: 436,
          height: 502,
        }}
      >
        {/* 3B sahneden alınmış kare — zemin rengi kâğıtla aynı, dikilmez */}
        <img
          src={dataUri('assets/og-cassette.png', 'image/png')}
          width={352}
          height={440}
        />

        <div
          style={{
            display: 'flex',
            color: MUTE,
            fontFamily: 'Geist Mono',
            fontSize: 12,
            letterSpacing: '2px',
          }}
        >
          {content.ui.home.sceneCaption.toUpperCase()}
        </div>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Instrument Sans', data: regular, weight: 400, style: 'normal' },
        { name: 'Instrument Sans', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  )

  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } })
    .render()
    .asPng()

  mkdirSync(dirname(OUT), { recursive: true })
  writeFileSync(OUT, png)
  console.log(`✓ ${OUT.replace(`${ROOT}/`, '')}  (1200×630, ${(png.length / 1024) | 0} KB)`)
}

main().catch((err) => {
  console.error('OG görseli üretilemedi:', err)
  process.exit(1)
})