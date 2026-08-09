'use client'

import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import * as THREE from 'three'
import { StoryRing, StoryJhumka, StoryNecklace } from './jewelry-pieces'

/**
 * Scroll-controlled 3D showcase transitions smoothly across 3 iconic pieces:
 *  - 0.00 – 0.33 : Solitaire Ring (360° view)
 *  - 0.33 – 0.66 : Heritage Jhumka Earring (360° view)
 *  - 0.66 – 1.00 : Royal Necklace (360° view)
 */
function Rig({ progress }: { progress: React.MutableRefObject<number> }) {
  const { camera } = useThree()
  const ringRef = useRef<THREE.Group>(null)
  const jhumkaRef = useRef<THREE.Group>(null)
  const necklaceRef = useRef<THREE.Group>(null)

  const cur = useRef(0)

  useFrame((_, delta) => {
    // Smooth interpolation toward target scroll progress
    cur.current += (progress.current - cur.current) * Math.min(1, delta * 5)
    const p = cur.current

    // Camera 360° orbit logic per phase
    let phaseProgress = 0
    let targetDist = 4.5
    let targetY = 0

    if (p < 0.33) {
      // Phase 1: Ring
      phaseProgress = p / 0.33
      targetDist = THREE.MathUtils.lerp(5.2, 3.6, phaseProgress)
      targetY = THREE.MathUtils.lerp(0.8, 0.2, phaseProgress)
    } else if (p < 0.66) {
      // Phase 2: Jhumka
      phaseProgress = (p - 0.33) / 0.33
      targetDist = THREE.MathUtils.lerp(4.8, 3.8, phaseProgress)
      targetY = THREE.MathUtils.lerp(0.4, -0.2, phaseProgress)
    } else {
      // Phase 3: Necklace
      phaseProgress = (p - 0.66) / 0.34
      targetDist = THREE.MathUtils.lerp(5.0, 4.0, phaseProgress)
      targetY = THREE.MathUtils.lerp(0.2, -0.4, phaseProgress)
    }

    const orbitAngle = p * Math.PI * 3.5 // Continuous smooth 360 rotation across scroll
    camera.position.x = Math.sin(orbitAngle) * targetDist
    camera.position.z = Math.cos(orbitAngle) * targetDist
    camera.position.y = targetY
    camera.lookAt(0, 0, 0)

    // Cross-fade Piece 1: Ring (active 0.0 - 0.35)
    const ringVis = 1 - THREE.MathUtils.smoothstep(p, 0.26, 0.36)
    if (ringRef.current) {
      ringRef.current.scale.setScalar(ringVis * 1.1)
      ringRef.current.position.y = (1 - ringVis) * 2.0
      ringRef.current.visible = ringVis > 0.01
    }

    // Cross-fade Piece 2: Jhumka (active 0.30 - 0.68)
    const jhumkaIn = THREE.MathUtils.smoothstep(p, 0.28, 0.36)
    const jhumkaOut = 1 - THREE.MathUtils.smoothstep(p, 0.60, 0.68)
    const jhumkaVis = jhumkaIn * jhumkaOut
    if (jhumkaRef.current) {
      jhumkaRef.current.scale.setScalar(jhumkaVis * 1.05)
      jhumkaRef.current.position.y = (1 - jhumkaIn) * -2.0 + (1 - jhumkaOut) * 2.0
      jhumkaRef.current.visible = jhumkaVis > 0.01
    }

    // Cross-fade Piece 3: Necklace (active 0.62 - 1.00)
    const necklaceVis = THREE.MathUtils.smoothstep(p, 0.62, 0.70)
    if (necklaceRef.current) {
      necklaceRef.current.scale.setScalar(necklaceVis * 1.1)
      necklaceRef.current.position.y = (1 - necklaceVis) * -2.0
      necklaceRef.current.visible = necklaceVis > 0.01
    }
  })

  return (
    <group>
      <ambientLight intensity={1.8} />
      <directionalLight position={[5, 10, 7]} intensity={4.5} color="#fff7e6" castShadow />
      <directionalLight position={[-5, -4, 5]} intensity={2.8} color="#e0f2fe" />
      <spotLight position={[6, 8, 6]} intensity={180} color="#ffe4b0" />
      <spotLight position={[-6, -3, 4]} intensity={90} color="#bfe6ff" />
      <pointLight position={[0, 2, 4]} intensity={45} color="#fff2d6" />

      {/* Piece 1: Ring */}
      <group ref={ringRef}>
        <StoryRing spin={0.6} />
      </group>

      {/* Piece 2: Jhumka Earring */}
      <group ref={jhumkaRef} visible={false}>
        <StoryJhumka spin={0.5} />
      </group>

      {/* Piece 3: Royal Necklace */}
      <group ref={necklaceRef} visible={false}>
        <StoryNecklace spin={0.4} />
      </group>

      <Environment preset="city" environmentIntensity={2.5} />
    </group>
  )
}

export function StoryScene({
  progress,
  frameloop = 'always',
}: {
  progress: React.MutableRefObject<number>
  frameloop?: 'always' | 'demand' | 'never'
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 42 }}
      dpr={[1, 1.25]}
      performance={{ min: 0.5 }}
      frameloop={frameloop}
      gl={{ alpha: true, antialias: false, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <Rig progress={progress} />
      </Suspense>
    </Canvas>
  )
}

