import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Center, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { Gem } from './gem'

// ─── Shared gold material props ───────────────────────────────────────────────
const GM = {
  color: '#d9a441' as const,
  metalness: 1.0,
  roughness: 0.12,
  envMapIntensity: 2.5,
}

// ─────────────────────────────────────────────────────────────────────────────
// RING — Photorealistic 3D GLB Model (Enhanced Shiny Gold & Diamonds)
// ─────────────────────────────────────────────────────────────────────────────
export function StoryRing({ spin = 0.55 }: { spin?: number }) {
  const g = useRef<THREE.Group>(null)
  const { scene } = useGLTF('/models/ring.glb')

  // Clone & tune materials for ultra-shiny metallic reflections & bright highlights
  const shinyScene = useMemo(() => {
    const cloned = scene.clone()
    cloned.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        if (mesh.material) {
          const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as THREE.MeshStandardMaterial
          if (mat) {
            mat.envMapIntensity = 3.5
            mat.roughness = Math.min(mat.roughness, 0.08) // mirror shine polish
            mat.metalness = Math.max(mat.metalness, 0.85) // high metallic reflectivity
            if ('clearcoat' in mat) {
              ;(mat as THREE.MeshPhysicalMaterial).clearcoat = 1.0
              ;(mat as THREE.MeshPhysicalMaterial).clearcoatRoughness = 0.02
            }
            mat.needsUpdate = true
          }
        }
      }
    })
    return cloned
  }, [scene])

  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin
  })

  return (
    <group ref={g}>
      <Center>
        <primitive object={shinyScene} scale={1.8} />
      </Center>
    </group>
  )
}

useGLTF.preload('/models/ring.glb')

// ─────────────────────────────────────────────────────────────────────────────
// JHUMKA — Indian bell earring: hook → disc → dome → hanging drops
// ─────────────────────────────────────────────────────────────────────────────
export function StoryJhumka({ spin = 0.42 }: { spin?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin
  })

  const DROPS = 10

  return (
    <group ref={g} scale={0.88}>
      {/* ── Ear hook ── */}
      <mesh position={[0.1, 1.7, 0]} rotation={[0, 0, 0.45]}>
        <torusGeometry args={[0.4, 0.034, 8, 32, Math.PI * 1.45]} />
        <meshStandardMaterial {...GM} />
      </mesh>

      {/* ── Top connecting post ── */}
      <mesh position={[0, 1.22, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.22, 10]} />
        <meshStandardMaterial {...GM} />
      </mesh>

      {/* ── Top disc ── */}
      <mesh position={[0, 1.08, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 32]} />
        <meshStandardMaterial {...GM} />
      </mesh>
      {/* Decorative rim on disc */}
      <mesh position={[0, 1.08, 0]}>
        <torusGeometry args={[0.52, 0.055, 8, 40]} />
        <meshStandardMaterial {...GM} />
      </mesh>

      {/* ── Gemstones on top disc ── */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.36, 1.14, Math.sin(a) * 0.36]}>
            <sphereGeometry args={[0.065, 8, 8]} />
            <meshStandardMaterial color="#ff6a6a" roughness={0.07} metalness={0.2} />
          </mesh>
        )
      })}

      {/* ── Dome body (inverted hemisphere) ── */}
      <mesh position={[0, 0.56, 0]} rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[0.8, 32, 16, 0, Math.PI * 2, 0, Math.PI / 1.85]} />
        <meshStandardMaterial {...GM} roughness={0.1} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Dome equator ring ── */}
      <mesh position={[0, 0.57, 0]}>
        <torusGeometry args={[0.8, 0.052, 12, 48]} />
        <meshStandardMaterial {...GM} />
      </mesh>

      {/* ── Center ruby gem ── */}
      <group position={[0, 0.22, 0]}>
        <Gem scale={0.31} spin={0} color="#ff6a6a" />
      </group>

      {/* ── Outer hanging bead drops ── */}
      {Array.from({ length: DROPS }).map((_, i) => {
        const a = (i / DROPS) * Math.PI * 2
        const r = 0.72
        return (
          <group key={i} position={[Math.cos(a) * r, 0.56, Math.sin(a) * r]}>
            {/* chain thread */}
            <mesh position={[0, -0.24, 0]}>
              <cylinderGeometry args={[0.013, 0.013, 0.38, 4]} />
              <meshStandardMaterial {...GM} />
            </mesh>
            {/* teardrop gold bead */}
            <mesh position={[0, -0.52, 0]}>
              <sphereGeometry args={[0.095, 10, 10]} />
              <meshStandardMaterial {...GM} roughness={0.08} />
            </mesh>
          </group>
        )
      })}

      {/* ── Central long drop (jhumki point) ── */}
      <group position={[0, 0.56, 0]}>
        <mesh position={[0, -0.34, 0]}>
          <cylinderGeometry args={[0.017, 0.017, 0.52, 4]} />
          <meshStandardMaterial {...GM} />
        </mesh>
        <mesh position={[0, -0.66, 0]}>
          <sphereGeometry args={[0.13, 14, 14]} />
          <meshStandardMaterial {...GM} roughness={0.07} />
        </mesh>
      </group>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NECKLACE — Curved bead chain with sapphire medallion pendant
// ─────────────────────────────────────────────────────────────────────────────
export function StoryNecklace({ spin = 0.32 }: { spin?: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => {
    if (g.current) g.current.rotation.y += dt * spin
  })

  const BEAD_COUNT = 22
  const R = 1.38        // arc radius
  const SPAN = Math.PI * 1.18  // arc angular span

  return (
    <group ref={g} rotation={[0.28, 0, 0]}>
      {/* ── Arc beads ── */}
      {Array.from({ length: BEAD_COUNT }).map((_, i) => {
        const t = i / (BEAD_COUNT - 1)
        const angle = (t - 0.5) * SPAN
        const x = Math.sin(angle) * R
        const y = -Math.cos(angle) * R + R * 0.62
        const isMid = i === Math.floor(BEAD_COUNT / 2)
        const size = isMid ? 0.135 : 0.065 + Math.sin(t * Math.PI) * 0.042
        return (
          <mesh key={i} position={[x, y, 0]}>
            <sphereGeometry args={[size, 10, 10]} />
            <meshStandardMaterial {...GM} roughness={0.1} />
          </mesh>
        )
      })}

      {/* ── Chain connectors ── */}
      {Array.from({ length: BEAD_COUNT - 1 }).map((_, i) => {
        const t1 = i / (BEAD_COUNT - 1)
        const t2 = (i + 1) / (BEAD_COUNT - 1)
        const a1 = (t1 - 0.5) * SPAN
        const a2 = (t2 - 0.5) * SPAN
        const x1 = Math.sin(a1) * R, y1 = -Math.cos(a1) * R + R * 0.62
        const x2 = Math.sin(a2) * R, y2 = -Math.cos(a2) * R + R * 0.62
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        const len = Math.hypot(x2 - x1, y2 - y1)
        const ang = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2
        return (
          <mesh key={i} position={[mx, my, 0]} rotation={[0, 0, ang]}>
            <cylinderGeometry args={[0.013, 0.013, len * 0.84, 4]} />
            <meshStandardMaterial {...GM} />
          </mesh>
        )
      })}

      {/* ── Central medallion pendant ── */}
      <group position={[0, -0.25, 0]}>
        {/* Pendant connector to chain */}
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.22, 8]} />
          <meshStandardMaterial {...GM} />
        </mesh>

        {/* Outer gold frame ring */}
        <mesh>
          <torusGeometry args={[0.44, 0.068, 14, 52]} />
          <meshStandardMaterial {...GM} roughness={0.09} />
        </mesh>

        {/* Inner decorative ring */}
        <mesh>
          <torusGeometry args={[0.28, 0.038, 8, 36]} />
          <meshStandardMaterial {...GM} />
        </mesh>

        {/* Central sapphire gem */}
        <Gem scale={0.42} spin={0.38} color="#90caf9" />

        {/* 4 ruby accent stones */}
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4
          return (
            <mesh key={i} position={[Math.cos(a) * 0.35, Math.sin(a) * 0.35, 0.06]}>
              <sphereGeometry args={[0.066, 8, 8]} />
              <meshStandardMaterial color="#ff6a6a" roughness={0.07} metalness={0.2} />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}
