import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useTheme } from '@/theme'

/* ---- Ölçüler (gerçek oranlara yakın: uzun ve alçak gövde) ---- */
const W = 6.2
const H = 1.55
const D = 9.0
const WALL = 0.34 // üst çerçeve kalınlığı
const RIM = 0.13 // çerçevenin yüksekliği
const DECK = H / 2 - RIM // üst tablasının yüzeyi
const SHELL = '#141417'
const DARK_SHELL = '#2c2c35'

/* ---- Ön panel dokusu: markasız, sade ---- */
function makeFrontTexture() {
  const c = document.createElement('canvas')
  c.width = 1400
  c.height = 420
  const ctx = c.getContext('2d')!

  // içe gömülü panel zemini
  ctx.fillStyle = '#101013'
  ctx.fillRect(0, 0, 1400, 420)

  const g = ctx.createLinearGradient(0, 0, 0, 420)
  g.addColorStop(0, 'rgba(255,255,255,0.10)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.02)')
  g.addColorStop(1, 'rgba(0,0,0,0.45)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 1400, 420)

  // ince fırça dokusu
  ctx.globalAlpha = 0.035
  for (let y = 0; y < 420; y += 3) {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, y, 1400, 1)
  }
  ctx.globalAlpha = 1

  // kelime markası — sola yerleştirilmiş
  ctx.textBaseline = 'middle'
  ctx.textAlign = 'left'
  ctx.fillStyle = '#e9e9ee'
  ctx.font = '700 104px "Instrument Sans Variable", Inter, system-ui, sans-serif'
  ctx.fillText('REWOSAMA', 150, 178)

  ctx.font = '500 30px "Geist Mono Variable", ui-monospace, monospace'
  ctx.fillStyle = 'rgba(233,233,238,0.42)'
  ctx.fillText('HOME  ARCADE  SYSTEM', 156, 252)

  // sağ tarafta ince ayraç ve model no
  ctx.strokeStyle = 'rgba(233,233,238,0.16)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(1060, 110)
  ctx.lineTo(1060, 310)
  ctx.stroke()

  ctx.textAlign = 'right'
  ctx.fillStyle = 'rgba(233,233,238,0.5)'
  ctx.font = '600 34px "Geist Mono Variable", ui-monospace, monospace'
  ctx.fillText('MODEL', 1250, 160)
  ctx.font = '700 64px "Geist Mono Variable", ui-monospace, monospace'
  ctx.fillText('1977', 1250, 232)

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** Mat, hafif dokulu plastik. */
function plastic(color?: string, rough = 0.62, clear = 0.22) {
  return (
    <meshPhysicalMaterial
      color={color ?? SHELL}
      roughness={rough}
      metalness={0}
      clearcoat={clear}
      clearcoatRoughness={0.6}
      envMapIntensity={0.5}
    />
  )
}

/** Kaymalı anahtar: yuvası + neredeyse düz duran kolu. */
function SlideSwitch({ position, flip }: { position: [number, number, number]; flip: number }) {
  const [theme] = useTheme()
  const dark = theme === 'dark'
  return (
    <group position={position}>
      {/* yuva */}
      <mesh>
        <boxGeometry args={[0.4, 0.07, 0.96]} />
        <meshStandardMaterial color={dark ? "#15151a" : "#06060a"} roughness={0.92} />
      </mesh>
      {/* kenar */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.48, 0.03, 1.04]} />
        <meshStandardMaterial color={dark ? "#3d3d47" : "#232329"} roughness={0.68} />
      </mesh>
      {/* kol */}
      <mesh position={[0, 0.1, flip * 0.2]} rotation={[flip * 0.16, 0, 0]} castShadow>
        <boxGeometry args={[0.17, 0.14, 0.54]} />
        <meshStandardMaterial color={dark ? "#d8d2c4" : "#b8b2a4"} roughness={0.5} />
      </mesh>
    </group>
  )
}

/** Joystick: delik + toz yuvası + şaft + topuz. */
function Joystick({ position, index }: { position: [number, number, number]; index: number }) {
  const [theme] = useTheme()
  const dark = theme === 'dark'
  const knob = useRef<THREE.Group>(null)

  useFrame((s) => {
    const g = knob.current
    if (!g) return
    const t = s.clock.elapsedTime
    g.rotation.z = Math.sin(t * 0.5 + index * 2.1) * 0.13
    g.rotation.x = Math.cos(t * 0.43 + index) * 0.1
  })

  return (
    <group position={position}>
      {/* delik */}
      <mesh position={[0, 0.01, 0]}>
        <cylinderGeometry args={[0.56, 0.52, 0.1, 32]} />
        <meshStandardMaterial color={dark ? "#15151a" : "#07070a"} roughness={0.95} />
      </mesh>
      {/* toz yuvası halkası */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.06, 32]} />
        <meshStandardMaterial color={dark ? "#2e2e37" : "#1c1c20"} roughness={0.8} />
      </mesh>
      <group ref={knob} position={[0, 0.08, 0]}>
        {/* şaft */}
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.11, 0.16, 0.6, 24]} />
          <meshStandardMaterial color={dark ? "#4a4a55" : "#26262b"} roughness={0.4} metalness={0.15} />
        </mesh>
        {/* bilezik */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.07, 24]} />
          <meshStandardMaterial color={dark ? "#5a5a66" : "#3a3a40"} roughness={0.35} metalness={0.3} />
        </mesh>
        {/* topuz */}
        <mesh position={[0, 0.74, 0]} castShadow>
          <sphereGeometry args={[0.36, 28, 22]} />
          <meshPhysicalMaterial
            color={dark ? "#efeade" : "#d9d4c6"}
            roughness={0.38}
            metalness={0}
            clearcoat={0.55}
            clearcoatRoughness={0.25}
          />
        </mesh>
      </group>
    </group>
  )
}

/** 3B oyun konsolu — prosedürel, markasız, sürükleyerek döndürülür. */
export function AtariConsole({ children }: { children?: React.ReactNode }) {
  const [theme] = useTheme()
  const dark = theme === 'dark'
  /** karanlıkta kabuk açılır, yoksa siyah zeminde kaybolur */
  const C = dark
    ? {
        shell: DARK_SHELL,
        rim: '#37373f',
        deck: '#1f1f26',
        walls: '#464650',
        vent: '#15151a',
        back: '#22222a',
      }
    : {
        shell: SHELL,
        rim: '#1a1a1e',
        deck: '#0e0e11',
        walls: '#26262c',
        vent: '#07070a',
        back: '#0b0b0e',
      }

  const front = useMemo(() => makeFrontTexture(), [])
  useEffect(() => () => front.dispose(), [front])

  const group = useRef<THREE.Group>(null)
  const gl = useThree((s) => s.gl)

  /* hedef dönüş + sürükleme durumu
     Dönüş sınırlı: çok dik eğimde konsolun görünür silüeti büyüyüp
     sayfa çerçevesini (navbar / alttaki başlık) taşıyor. */
  const LIMIT_X = 0.5
  const LIMIT_Y = 1.35
  const rot = useRef({ x: -0.16, y: -0.18 })
  const drag = useRef({ on: false, px: 0, py: 0, vx: 0, vy: 0 })

  useEffect(() => {
    const el = gl.domElement
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y'

    const down = (e: PointerEvent) => {
      drag.current.on = true
      drag.current.px = e.clientX
      drag.current.py = e.clientY
      drag.current.vx = 0
      drag.current.vy = 0
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }

    const move = (e: PointerEvent) => {
      if (!drag.current.on) return
      const dx = e.clientX - drag.current.px
      const dy = e.clientY - drag.current.py
      drag.current.px = e.clientX
      drag.current.py = e.clientY
      rot.current.y += dx * 0.006
      rot.current.x = THREE.MathUtils.clamp(
        rot.current.x + dy * 0.005,
        -LIMIT_X,
        LIMIT_X,
      )
      rot.current.y = THREE.MathUtils.clamp(
        rot.current.y,
        -LIMIT_Y,
        LIMIT_Y,
      )
      drag.current.vx = dx * 0.006
      drag.current.vy = dy * 0.005
    }

    const up = (e: PointerEvent) => {
      drag.current.on = false
      if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId)
      el.style.cursor = 'grab'
    }

    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    return () => {
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
      el.style.cursor = ''
    }
  }, [gl])

  useFrame((_, dt) => {
    const g = group.current
    if (!g) return

    // bırakınca kısa bir ataletle devam et
    if (!drag.current.on) {
      rot.current.y += drag.current.vx
      rot.current.x = THREE.MathUtils.clamp(
        rot.current.x + drag.current.vy,
        -LIMIT_X,
        LIMIT_X,
      )
      rot.current.y = THREE.MathUtils.clamp(
        rot.current.y,
        -LIMIT_Y,
        LIMIT_Y,
      )
      drag.current.vx *= 0.93
      drag.current.vy *= 0.93
      if (Math.abs(drag.current.vx) < 0.00015) drag.current.vx = 0
      if (Math.abs(drag.current.vy) < 0.00015) drag.current.vy = 0
    }

    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, rot.current.y, 7, dt)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, rot.current.x, 7, dt)
  })

  const innerW = W - WALL * 2
  const innerD = D - WALL * 2
  const innerH = innerD / 2

  /* Kaset yuvasının tabla üzerindeki açıklığı */
  const SLOT_W = 3.8
  const SLOT_D = 1.55
  const SLOT_Z = 0.45
  const slotBack = SLOT_Z - SLOT_D / 2
  const slotFront = SLOT_Z + SLOT_D / 2

  return (
    <group ref={group}>
      {/* ---------- Ana gövde (çerçevenin altı) ---------- */}
      <mesh position={[0, -RIM / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[W, H - RIM, D]} />
        {plastic(C.shell)}
      </mesh>

      {/* ---------- Üstteki yükseltilmiş çerçeve ---------- */}
      <mesh position={[-(W - WALL) / 2, DECK + RIM / 2, 0]} castShadow>
        <boxGeometry args={[WALL, RIM, D]} />
        {plastic(C.rim, 0.55)}
      </mesh>
      <mesh position={[(W - WALL) / 2, DECK + RIM / 2, 0]} castShadow>
        <boxGeometry args={[WALL, RIM, D]} />
        {plastic(C.rim, 0.55)}
      </mesh>
      <mesh position={[0, DECK + RIM / 2, -(D - WALL) / 2]} castShadow>
        <boxGeometry args={[innerW, RIM, WALL]} />
        {plastic(C.rim, 0.55)}
      </mesh>
      <mesh position={[0, DECK + RIM / 2, (D - WALL) / 2]} castShadow>
        <boxGeometry args={[innerW, RIM, WALL]} />
        {plastic(C.rim, 0.55)}
      </mesh>

      {/* ---------- Üst tabla (kaset yuvasının etrafında dört parça) ---------- */}
      <mesh position={[0, DECK, (-innerH + slotBack) / 2]} receiveShadow>
        <boxGeometry args={[innerW, 0.05, slotBack + innerH]} />
        {plastic(C.deck, 0.78, 0.05)}
      </mesh>
      <mesh position={[0, DECK, (slotFront + innerH) / 2]} receiveShadow>
        <boxGeometry args={[innerW, 0.05, innerH - slotFront]} />
        {plastic(C.deck, 0.78, 0.05)}
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (SLOT_W / 2 + (innerW - SLOT_W) / 4), DECK, SLOT_Z]} receiveShadow>
          <boxGeometry args={[(innerW - SLOT_W) / 2, 0.05, SLOT_D]} />
          {plastic(C.deck, 0.78, 0.05)}
        </mesh>
      ))}

      {/* ---------- Kaset yuvasının içi ---------- */}
      <mesh position={[0, DECK - 0.34, SLOT_Z]}>
        <boxGeometry args={[SLOT_W, 0.06, SLOT_D]} />
        <meshStandardMaterial color={dark ? "#101015" : "#050507"} roughness={0.96} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={`w${s}`} position={[s * (SLOT_W / 2 - 0.04), DECK - 0.17, SLOT_Z]}>
          <boxGeometry args={[0.08, 0.34, SLOT_D]} />
          {plastic(C.walls, 0.55)}
        </mesh>
      ))}
      <mesh position={[0, DECK - 0.17, SLOT_Z - SLOT_D / 2 + 0.04]}>
        <boxGeometry args={[SLOT_W, 0.34, 0.08]} />
        {plastic(C.walls, 0.55)}
      </mesh>
      {children}

      {/* ---------- Joystickler ---------- */}
      <Joystick position={[-2.05, DECK + 0.03, 3.2]} index={0} />
      <Joystick position={[2.05, DECK + 0.03, 3.2]} index={1} />

      {/* ---------- Anahtarlar (arka sol, 2 sıra × 3) ---------- */}
      {[-1.95, -1.3, -0.65].map((x, i) => (
        <SlideSwitch key={`a${i}`} position={[x, DECK + 0.03, -1.8]} flip={i % 2 === 0 ? 1 : -1} />
      ))}
      {[-1.95, -1.3, -0.65].map((x, i) => (
        <SlideSwitch key={`b${i}`} position={[x, DECK + 0.03, -2.7]} flip={i % 2 === 0 ? -1 : 1} />
      ))}

      {/* ---------- Reset düğmesi ---------- */}
      <group position={[1.5, DECK + 0.03, -2.25]}>
        <mesh>
          <cylinderGeometry args={[0.36, 0.36, 0.08, 28]} />
          <meshStandardMaterial color={C.vent} roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.09, 0]}>
          <cylinderGeometry args={[0.22, 0.25, 0.13, 28]} />
          <meshStandardMaterial color={dark ? "#5e5e6a" : "#3c3c44"} roughness={0.45} />
        </mesh>
      </group>

      {/* ---------- Yan havalandırma yuvaları ---------- */}
      {[-1, 1].map((s) =>
        [0.34, 0.24, 0.14, 0.04].map((y, i) => (
          <mesh key={`${s}${i}`} position={[s * (W / 2 + 0.004), -0.12 - y, 0]}>
            <boxGeometry args={[0.05, 0.07, D - 1.6]} />
            <meshStandardMaterial color={dark ? "#15151a" : "#07070a"} roughness={0.95} />
          </mesh>
        )),
      )}

      {/* ---------- Arka bağlantı paneli ---------- */}
      <mesh position={[0, -0.02, -(D / 2 + 0.006)]}>
        <planeGeometry args={[W - 1.4, H - 0.5]} />
        {plastic(C.back, 0.85, 0.05)}
      </mesh>
      {[-1.3, -0.6, 0.6, 1.3].map((x) => (
        <mesh key={x} position={[x, -0.34, -(D / 2 + 0.02)]}>
          <boxGeometry args={[0.42, 0.16, 0.05]} />
          <meshStandardMaterial color={dark ? "#4c4c58" : "#2a2a30"} roughness={0.5} metalness={0.3} />
        </mesh>
      ))}

      {/* ---------- Ön yüz paneli ---------- */}
      <mesh position={[0, -0.05, D / 2 + 0.008]}>
        <planeGeometry args={[W - 0.9, ((W - 0.9) * 420) / 1400]} />
        <meshPhysicalMaterial
          map={front}
          roughness={0.34}
          metalness={0}
          clearcoat={0.65}
          clearcoatRoughness={0.28}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* ---------- Alt kenar + ayaklar ---------- */}
      <mesh position={[0, -H / 2 + 0.07, 0]}>
        <boxGeometry args={[W - 0.06, 0.14, D - 0.06]} />
        {plastic(C.vent, 0.85, 0)}
      </mesh>
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh key={`${sx}${sz}`} position={[sx * (W / 2 - 0.5), -H / 2 - 0.02, sz * (D / 2 - 0.6)]}>
          <cylinderGeometry args={[0.28, 0.24, 0.1, 20]} />
          <meshStandardMaterial color={dark ? "#15151a" : "#07070a"} roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}