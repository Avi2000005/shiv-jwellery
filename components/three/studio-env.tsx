'use client'

import { Environment, Lightformer } from '@react-three/drei'

/**
 * A procedural studio environment built from Lightformers so it needs no
 * external HDR fetch. Warm champagne key light + cool rim for jewel sparkle.
 */
export function StudioEnv() {
  return (
    <Environment resolution={256} frames={1}>
      <color attach="background" args={['#050505']} />
      <Lightformer
        intensity={3}
        color="#fff0d4"
        position={[0, 2, 4]}
        scale={[6, 6, 1]}
        form="circle"
      />
      <Lightformer
        intensity={2}
        color="#ffcf8f"
        position={[-4, 1, 2]}
        scale={[3, 6, 1]}
        form="rect"
      />
      <Lightformer
        intensity={1.5}
        color="#bfe6ff"
        position={[4, -1, 2]}
        scale={[3, 6, 1]}
        form="rect"
      />
      <Lightformer
        intensity={2}
        color="#ffffff"
        position={[0, -3, 2]}
        scale={[6, 3, 1]}
        form="rect"
      />
    </Environment>
  )
}
