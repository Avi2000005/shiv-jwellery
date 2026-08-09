'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * A brilliant-cut gem built procedurally: a wide crown table on top and a
 * pointed pavilion below, with hard flat facets so light catches every plane.
 */
function useDiamondGeometry() {
  return useMemo(() => {
    const facets = 10
    const geo = new THREE.CylinderGeometry(1, 0.001, 1.35, facets, 2)
    const pos = geo.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y > 0.35) {
        // flat table on top
        pos.setY(i, 0.55)
        const x = pos.getX(i)
        const z = pos.getZ(i)
        pos.setX(i, x * 0.62)
        pos.setZ(i, z * 0.62)
      } else if (y > 0) {
        // crown girdle stays wide
        pos.setY(i, 0.32)
      }
    }
    geo.computeVertexNormals()
    return geo
  }, [])
}

export function Gem({
  scale = 1,
  color = '#dff2ff',
  spin = 0.35,
}: {
  scale?: number
  color?: string
  spin?: number
}) {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useDiamondGeometry()

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * spin
    }
  })

  return (
    <mesh ref={ref} geometry={geometry} scale={scale}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.35}
        roughness={0.02}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0.02}
        ior={2.4}
        iridescence={1}
        iridescenceIOR={2}
        envMapIntensity={3}
        flatShading
      />
    </mesh>
  )
}

export function GoldRing({ scale = 1, spin = 0.3 }: { scale?: number; spin?: number }) {
  const group = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * spin
  })
  return (
    <group ref={group} scale={scale} rotation={[Math.PI / 2.6, 0, 0]}>
      {/* band */}
      <mesh>
        <torusGeometry args={[1, 0.16, 32, 96]} />
        <meshStandardMaterial
          color="#d9a441"
          metalness={1}
          roughness={0.18}
          envMapIntensity={1.8}
        />
      </mesh>
      {/* prongs holding the stone */}
      <group position={[0, 0, 0.42]}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2
          return (
            <mesh key={i} position={[Math.cos(a) * 0.28, Math.sin(a) * 0.28, 0]}>
              <cylinderGeometry args={[0.04, 0.04, 0.4, 8]} />
              <meshStandardMaterial color="#d9a441" metalness={1} roughness={0.2} />
            </mesh>
          )
        })}
        <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <Gem scale={0.5} spin={0} />
        </mesh>
      </group>
    </group>
  )
}
