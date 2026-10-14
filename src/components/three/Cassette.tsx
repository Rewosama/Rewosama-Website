import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { Project } from '@/data/site'
import { shade, useTheme } from '@/theme'
import { makeLabelTexture, makeShellTexture } from './makeLabelTexture'

/* ---- Atari 2600 kaset ölçüleri (dünya birimi) ---- */
const W = 3.4 // genişlik
const H = 4.0 // yükseklik
const D = 1.15 // derinlik
const CH = 0.66 // alt köşelerdeki 45° pah
const FRONT = D / 2 // kabuğun ön yüzü (z)

const LABEL_W = W - 0.4
const LABEL_H = 2.32
const LABEL_TOP = H / 2 - 0.24
const LABEL_Y = LABEL_TOP - LABEL_H / 2

const GRIP_BOTTOM = -H / 2 + 0.2
const GRIP_TOP = LABEL_Y - LABEL_H / 2 - 0.17
const GRIP_H = GRIP_TOP - GRIP_BOTTOM

/**
 * Belirli bir yükseklikte kabuğun yarı genişliği.
 * Alt köşeler 45° pah olduğu için aşağı indikçe daralır — tırtıklar ve
 * alt bant bu sınırdan taşmasın diye buradan ölçülüyor.
 */
function bodyHalfAt(y: number) {
  const chamferTop = -H / 2 + CH
  if (y >= chamferTop) return W / 2
  return W / 2 - ((chamferTop - y) / CH) * CH
}

const RIBS = 11
const RIB_T = 0.062 // tırtığın kalınlığı
const RIB_H = GRIP_H - 0.1
const RIB_MID = (GRIP_BOTTOM + GRIP_TOP) / 2
const RIB_BOTTOM = RIB_MID - RIB_H / 2
/** En dıştaki tırtığın gövdeyi aşmaması için izin verilen yarı genişlik */
const RIB_LIMIT = bodyHalfAt(RIB_BOTTOM) - RIB_T / 2 - 0.03
const RIB_STEP = (RIB_LIMIT * 2) / (RIBS - 1)

/** Alt koyu bant da pahlı köşeye taşmasın */
const FOOT_Y = GRIP_BOTTOM + 0.04
const FOOT_W = (bodyHalfAt(FOOT_Y) - 0.05) * 2

type Props = {
  project: Project
  /** 0 = tam görünür, 1 = en uzak */
  distance?: number
}

/** Önden görünümdeki Atari silüeti: üstü dik, alt köşeleri 45° pah. */
function useCartGeometry() {
  return useMemo(() => {
    const hw = W / 2
    const hh = H / 2
    const shape = new THREE.Shape()
    shape.moveTo(-hw + 0.12, hh)
    shape.lineTo(hw - 0.12, hh)
    shape.quadraticCurveTo(hw, hh, hw, hh - 0.12)
    shape.lineTo(hw, -hh + CH)
    shape.lineTo(hw - CH, -hh)
    shape.lineTo(-hw + CH, -hh)
    shape.lineTo(-hw, -hh + CH)
    shape.lineTo(-hw, hh - 0.12)
    shape.quadraticCurveTo(-hw, hh, -hw + 0.12, hh)

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: D - 0.11,
      bevelEnabled: true,
      bevelThickness: 0.055,
      bevelSize: 0.055,
      bevelOffset: 0,
      bevelSegments: 3,
      curveSegments: 3,
    })
    geo.center()
    geo.computeVertexNormals()
    return geo
  }, [])
}

/** Eski Atari (2600) kaseti — tamamen prosedürel geometri. */
export function Cassette({ project, distance = 0 }: Props) {
  const [theme] = useTheme()
  const dark = theme === 'dark'
  const geometry = useCartGeometry()
  const label = useMemo(() => makeLabelTexture(project), [project])
  // karanlıkta kabuk açılır, aksi halde siyah zemin içinde kaybolur
  const shellHex = dark ? shade(project.shell, 0.3) : project.shell
  const shellMap = useMemo(() => makeShellTexture(shellHex), [shellHex])

  useEffect(() => () => geometry.dispose(), [geometry])
  useEffect(() => () => label.dispose(), [label])

  const dim = Math.min(1, Math.max(0, distance))
  const opacity = THREE.MathUtils.lerp(1, 0.22, dim)

  return (
    <group>
      {/* ---------- Kabuk ---------- */}
      <mesh geometry={geometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          map={shellMap}
          color="#ffffff"
          roughness={0.62}
          metalness={0}
          clearcoat={0.18}
          clearcoatRoughness={0.65}
          envMapIntensity={0.45}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ---------- Üst yüzdeki konnektör gölgesi ---------- */}
      <mesh position={[0, H / 2 - 0.01, -0.1]}>
        <boxGeometry args={[W * 0.54, 0.06, D * 0.52]} />
        <meshStandardMaterial
          color={dark ? "#141418" : "#08080a"}
          roughness={0.85}
          envMapIntensity={0.25}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ---------- Etiket çukuru (çerçeve) ---------- */}
      <mesh position={[0, LABEL_Y, FRONT - 0.02]} castShadow>
        <boxGeometry args={[LABEL_W + 0.11, LABEL_H + 0.11, 0.1]} />
        <meshStandardMaterial
          color={dark ? "#16161b" : "#0a0a0c"}
          roughness={0.7}
          envMapIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ---------- Etiket ---------- */}
      <mesh position={[0, LABEL_Y, FRONT + 0.034]}>
        <planeGeometry args={[LABEL_W, LABEL_H]} />
        <meshPhysicalMaterial
          map={label}
          roughness={0.72}
          metalness={0}
          clearcoat={0.12}
          clearcoatRoughness={0.7}
          envMapIntensity={0.3}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ---------- Etiket ile tutuş arasındaki oluk ---------- */}
      <mesh position={[0, GRIP_TOP + 0.085, FRONT - 0.012]}>
        <boxGeometry args={[W - 0.62, 0.075, 0.085]} />
        <meshStandardMaterial
          color={dark ? "#141419" : "#09090b"}
          roughness={0.85}
          envMapIntensity={0.2}
          transparent
          opacity={opacity}
        />
      </mesh>

      {/* ---------- Alt tutuş tırtıkları ---------- */}
      {Array.from({ length: RIBS }).map((_, i) => (
        <mesh
          key={i}
          position={[-RIB_LIMIT + RIB_STEP * i, RIB_MID, FRONT + 0.016]}
          castShadow
        >
          <boxGeometry args={[RIB_T, RIB_H, 0.1]} />
          <meshStandardMaterial
            color={shellHex}
            roughness={0.42}
            metalness={0}
            envMapIntensity={0.6}
            transparent
            opacity={opacity}
          />
        </mesh>
      ))}

      {/* ---------- Tırtıkların altındaki koyu bant ---------- */}
      <mesh position={[0, FOOT_Y, FRONT - 0.006]}>
        <boxGeometry args={[FOOT_W, 0.055, 0.05]} />
        <meshStandardMaterial
          color={dark ? "#1b1b21" : "#0c0c0e"}
          roughness={0.8}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  )
}