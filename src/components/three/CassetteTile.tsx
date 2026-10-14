import { Suspense, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Cassette } from './Cassette'
import { useTheme } from '@/theme'
import type { Project } from '@/data/site'

/** Yumuşak, kenarları tamamen saydam gölge — düzlem kenarı görünmez. */
function makeShadowTexture(dark: boolean) {
  const S = 256
  const canvas = document.createElement('canvas')
  canvas.width = S
  canvas.height = S
  const ctx = canvas.getContext('2d')!
  const rgb = dark ? '0,0,0' : '24,24,30'
  // yarıdan küçük yarıçap → dört köşe ve kenarlar zaten saydam
  const g = ctx.createRadialGradient(S / 2, S / 2, 2, S / 2, S / 2, S * 0.46)
  g.addColorStop(0, `rgba(${rgb},0.52)`)
  g.addColorStop(0.45, `rgba(${rgb},0.22)`)
  g.addColorStop(0.78, `rgba(${rgb},0.05)`)
  g.addColorStop(1, `rgba(${rgb},0)`)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, S, S)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.premultiplyAlpha = false
  return tex
}

function Tile({ project }: { project: Project }) {
  const [theme] = useTheme()
  const dark = theme === 'dark'
  const g = useRef<THREE.Group>(null)
  const shadow = useMemo(() => makeShadowTexture(dark), [dark])
  const target = useMemo(() => new THREE.Vector2(), [])

  useEffect(() => () => shadow.dispose(), [shadow])

  useFrame((s, dt) => {
    const node = g.current
    if (!node) return
    // Dönüş sınırlı — imleçle sadece hafifçe eğilir
    const mx = THREE.MathUtils.clamp(s.pointer.x, -1, 1)
    const my = THREE.MathUtils.clamp(s.pointer.y, -1, 1)
    target.set(mx * 0.24, my * 0.14)
    node.rotation.y = THREE.MathUtils.damp(node.rotation.y, -0.24 + target.x, 3, dt)
    node.rotation.x = THREE.MathUtils.damp(node.rotation.x, 0.07 + target.y, 3, dt)
  })

  return (
    <>
      <ambientLight intensity={dark ? 0.34 : 0.28} />
      <directionalLight position={[4, 7, 6]} intensity={dark ? 1.65 : 1.5} />
      <directionalLight
        position={[-5, 2, 4]}
        intensity={dark ? 0.7 : 0.4}
        color={dark ? '#9fb4e0' : '#b9c4dd'}
      />
      <Environment frames={1} resolution={128}>
        <Lightformer form="rect" intensity={dark ? 1.6 : 1.1} position={[0, 5, 4]} scale={[10, 4, 1]} />
        <Lightformer
          form="rect"
          intensity={dark ? 0.7 : 0.4}
          position={[-5, 1, 3]}
          scale={[6, 6, 1]}
          color={dark ? '#9fb4e0' : '#b9c4dd'}
        />
      </Environment>

      <group ref={g}>
        <Cassette project={project} />
      </group>

      {/* Yatay gölge düzlemi — çerçevenin tamamen içinde kalır */}
      <mesh position={[0, -2.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4.6, 2.2]} />
        <meshBasicMaterial map={shadow} transparent depthWrite={false} toneMapped={false} />
      </mesh>
    </>
  )
}

/** Proje kartı — gerçek 3B kaset, imleçle hafifçe eğilir. */
export function CassetteTile({
  project,
  className,
}: {
  project: Project
  className?: string
}) {
  return (
    <div className={`relative aspect-[3.4/4] w-full ${className ?? ''}`}>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.2, 9.6], fov: 32 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Tile project={project} />
        </Suspense>
      </Canvas>
    </div>
  )
}