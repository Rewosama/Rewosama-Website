import * as THREE from 'three'
import type { Project } from '@/data/site'

/* Etiket tuvali — gerçek kaset etiketinin oranına yakın */
const W = 1290
const H = 1000

const INK = '#16151a'
const SANS = '"Instrument Sans Variable", Inter, system-ui, sans-serif'
const MONO = '"Geist Mono Variable", ui-monospace, monospace'

/** Etiketin kapak alanı (bandın altı, alt yazıların üstü) */
const COVER = { x: 34, y: 0.26 * H, w: W - 68, h: 0.5 * H }

function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Resmi kapsayacak şekilde merkezden kırpar. */
function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const scale = Math.max(w / img.width, h / img.height)
  const dw = img.width * scale
  const dh = img.height * scale

  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
  ctx.restore()
}

/** Resim yoksa kullanılan basit geometrik kapak. */
function drawProceduralCover(
  ctx: CanvasRenderingContext2D,
  p: Project,
  rnd: () => number,
) {
  const { x, y, w, h } = COVER
  const variant = hash(p.id) % 3
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()

  if (variant === 0) {
    // ufuk + güneş
    ctx.fillStyle = 'rgba(20,18,22,0.15)'
    ctx.fillRect(x, y + h * 0.66, w, h * 0.34)
    ctx.fillStyle = 'rgba(255,255,255,0.18)'
    ctx.beginPath()
    ctx.arc(x + w / 2, y + h * 0.42, h * 0.17, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'rgba(20,18,22,0.18)'
    for (let i = 0; i < 16; i++) {
      ctx.fillRect(
        x + w / 2 - h * 0.17 - i * 2,
        y + h * 0.5 + (i * h * 0.16) / 16,
        (h * 0.17 + i * 2) * 2,
        h * 0.045,
      )
    }
  } else if (variant === 1) {
    // ızgara / dither
    ctx.fillStyle = 'rgba(20,18,22,0.14)'
    for (let cx = 0; cx < 22; cx++)
      for (let cy = 0; cy < 9; cy++) {
        if ((cx + cy) % 3 === 0) continue
        ctx.fillRect(x + 20 + cx * 53, y + 22 + cy * ((h - 44) / 9), 34, (h - 44) / 9 - 10)
      }
    ctx.fillStyle = 'rgba(20,18,22,0.22)'
    ctx.fillRect(x, y + h * 0.7, w, h * 0.06)
  } else {
    // dağ siluetleri
    ctx.fillStyle = 'rgba(20,18,22,0.16)'
    ctx.beginPath()
    ctx.moveTo(x, y + h)
    ctx.lineTo(x, y + h * 0.62)
    ctx.lineTo(x + w * 0.28, y + h * 0.24)
    ctx.lineTo(x + w * 0.52, y + h * 0.62)
    ctx.lineTo(x + w * 0.74, y + h * 0.34)
    ctx.lineTo(x + w, y + h * 0.7)
    ctx.lineTo(x + w, y + h)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = 'rgba(255,255,255,0.14)'
    ctx.beginPath()
    ctx.arc(x + w * 0.82, y + h * 0.2, h * 0.1, 0, Math.PI * 2)
    ctx.fill()
  }
  void rnd
  ctx.restore()
}

/** Kapak alanının altına ince dither çizgileri. */
function drawCoverTexture(ctx: CanvasRenderingContext2D) {
  const { x, y, w, h } = COVER
  ctx.save()
  ctx.beginPath()
  ctx.rect(x, y, w, h)
  ctx.clip()
  ctx.globalAlpha = 0.06
  ctx.fillStyle = '#000'
  for (let cy = y; cy < y + h; cy += 6) ctx.fillRect(x, cy, w, 2)
  ctx.restore()
}

/** Kâğıt yaşlanması: leke, çizik, kenar kararması. */
function aging(ctx: CanvasRenderingContext2D, rnd: () => number) {
  ctx.save()
  for (let i = 0; i < 16; i++) {
    const r = 60 + rnd() * 260
    const x = rnd() * W
    const y = rnd() * H
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, `rgba(${rnd() > 0.5 ? '255,252,240' : '90,78,58'},${0.03 + rnd() * 0.05})`)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.10)'
  ctx.lineWidth = 1.5
  for (let i = 0; i < 7; i++) {
    const x = rnd() * W
    const y = rnd() * H
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + (rnd() - 0.5) * 320, y + (rnd() - 0.5) * 180)
    ctx.stroke()
  }
  const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.78)
  v.addColorStop(0, 'rgba(0,0,0,0)')
  v.addColorStop(1, 'rgba(40,30,16,0.22)')
  ctx.fillStyle = v
  ctx.fillRect(0, 0, W, H)
  ctx.restore()
}

/** Etiketin tamamını yeniden çizer — resim yüklenince tekrar çağrılır. */
function drawLabel(
  ctx: CanvasRenderingContext2D,
  p: Project,
  img: HTMLImageElement | null,
) {
  const rnd = mulberry32(hash(p.id + (img ? img.src : '')))
  const m = 22

  ctx.clearRect(0, 0, W, H)
  ctx.fillStyle = p.label
  ctx.fillRect(0, 0, W, H)

  // --- kapak alanı ---
  ctx.fillStyle = p.label
  ctx.fillRect(COVER.x, COVER.y, COVER.w, COVER.h)
  if (img && img.width > 0) {
    drawCoverImage(ctx, img, COVER.x, COVER.y, COVER.w, COVER.h)
  } else {
    drawProceduralCover(ctx, p, rnd)
    drawCoverTexture(ctx)
  }

  // --- dış çerçeve ---
  ctx.strokeStyle = 'rgba(18,16,20,0.75)'
  ctx.lineWidth = 5
  ctx.strokeRect(m, m, W - m * 2, H - m * 2)
  ctx.strokeStyle = 'rgba(255,255,255,0.28)'
  ctx.lineWidth = 2
  ctx.strokeRect(m + 9, m + 9, W - (m + 9) * 2, H - (m + 9) * 2)

  // --- siyah bant + oyun adı ---
  const bandH = Math.round(H * 0.245)
  ctx.fillStyle = INK
  ctx.fillRect(m + 4, m + 4, W - (m + 4) * 2, bandH)

  ctx.fillStyle = '#f4f2ec'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `700 ${Math.round(bandH * 0.46)}px ${SANS}`
  let title = p.name.toUpperCase()
  const maxW = W - m * 2 - 120
  while (ctx.measureText(title).width > maxW && title.length > 3) title = title.slice(0, -1)
  ctx.fillText(title, W / 2, m + 4 + bandH / 2 + 3)

  // --- alt küçük yazılar ---
  const baseY = H - m - 58
  ctx.textAlign = 'left'
  ctx.fillStyle = 'rgba(18,16,20,0.86)'
  ctx.font = `600 30px ${MONO}`
  ctx.fillText(p.role.toUpperCase(), m + 46, baseY)

  ctx.textAlign = 'right'
  ctx.fillText(p.years, W - m - 46, baseY)

  ctx.font = `500 20px ${MONO}`
  ctx.fillStyle = 'rgba(18,16,20,0.5)'
  ctx.textAlign = 'left'
  ctx.fillText(`© ${p.years.slice(-4)} REWOSAMA INC.`, m + 46, baseY + 44)
  ctx.textAlign = 'right'
  ctx.fillText('MADE IN TÜRKİYE', W - m - 46, baseY + 44)

  // --- yaşlanma ---
  aging(ctx, rnd)
}

/**
 * Kaset etiketi dokusu.
 * `project.image` verilmişse o resim kapak alanına yerleştirilir.
 * Resim geç gelirse doku yeniden çizilir — geçici olarak geometrik kapak görünür.
 */
export function makeLabelTexture(p: Project): THREE.CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  drawLabel(ctx, p, null)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8

  if (p.image) {
    const img = new Image()
    // uzak resimlerde canvas kirlenmesin diye CORS şart
    if (/^https?:\/\//i.test(p.image)) img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => {
      drawLabel(ctx, p, img)
      tex.needsUpdate = true
    }
    img.onerror = () => {
      // resim yüklenemezse geometrik kapak kalsın
    }
    img.src = p.image
  }

  return tex
}

/** Kabuk için gren + hafif çizikler — düz plastik görünmesin. */
const shellCache = new Map<string, THREE.CanvasTexture>()

export function makeShellTexture(hex: string): THREE.CanvasTexture {
  const cached = shellCache.get(hex)
  if (cached) return cached

  const S = 512
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = hex
  ctx.fillRect(0, 0, S, S)

  const img = ctx.getImageData(0, 0, S, S)
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 16
    img.data[i] += n
    img.data[i + 1] += n
    img.data[i + 2] += n
  }
  ctx.putImageData(img, 0, 0)

  ctx.strokeStyle = 'rgba(255,255,255,0.045)'
  ctx.lineWidth = 1
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * S
    const y = Math.random() * S
    const a = Math.random() * Math.PI
    const len = 20 + Math.random() * 120
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x + Math.cos(a) * len, y + Math.sin(a) * len)
    ctx.stroke()
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  shellCache.set(hex, tex)
  return tex
}