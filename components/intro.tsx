'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Gem } from './three/gem'
import { StudioEnv } from './three/studio-env'
import { getDeviceTier } from '@/lib/device-tier'

export function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0)
  const [visible, setVisible] = useState(true)
  // Classify device tier on initial client render
  const [tier, setTier] = useState<'high' | 'low'>('low')
  // Track if canvas was actually mounted — stop it the moment we exit
  const canvasRef = useRef<boolean>(false)

  useEffect(() => {
    setTier(getDeviceTier())

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const seen = sessionStorage.getItem('shiv-intro')

    if (reduce || seen) {
      setVisible(false)
      onDone()
      return
    }
    sessionStorage.setItem('shiv-intro', '1')

    const t1 = setTimeout(() => setPhase(1), 400)   // spark → gem
    const t2 = setTimeout(() => setPhase(2), 1800)  // wordmark (faster exit)
    const t3 = setTimeout(() => {
      setVisible(false)
      onDone()
    }, 2800) // reduced from 3600ms — less time blocking main thread

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* golden spark (always shown) */}
          <motion.div
            className="absolute h-2 w-2 rounded-full bg-gold"
            initial={{ opacity: 0, scale: 0 }}
            animate={
              phase >= 1
                ? { opacity: 0, scale: 40 }
                : { opacity: [0, 1, 0.8], scale: [0, 1.4, 1] }
            }
            transition={{ duration: phase >= 1 ? 1.4 : 0.5, ease: 'easeOut' }}
            style={{ filter: 'blur(6px)' }}
          />

          {/* ── HIGH TIER: 3D WebGL gem ───────────────────────────────── */}
          {tier === 'high' && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Canvas
                camera={{ position: [0, 0, 5], fov: 40 }}
                dpr={[1, 1]}
                frameloop={phase >= 1 ? 'always' : 'demand'}
                gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
                onCreated={() => { canvasRef.current = true }}
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.4} />
                  <spotLight position={[4, 6, 5]} intensity={70} color="#ffe4b0" />
                  <spotLight position={[-5, -2, 3]} intensity={35} color="#bfe6ff" />
                  <Float speed={2} rotationIntensity={0.5} floatIntensity={0.7}>
                    <group scale={phase >= 1 ? 1 : 0.2}>
                      <Gem scale={1.2} spin={0.8} />
                    </group>
                  </Float>
                  <StudioEnv />
                </Suspense>
              </Canvas>
            </motion.div>
          )}

          {/* ── LOW TIER: pure CSS gold ring pulse — zero WebGL ──────── */}
          {tier === 'low' && (
            <motion.div
              className="absolute flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: phase >= 1 ? 1 : 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="h-24 w-24 rounded-full border-2 border-gold/60"
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="absolute h-4 w-4 rounded-full bg-gold/80 blur-sm" />
            </motion.div>
          )}

          {/* wordmark — always shown */}
          <motion.div
            className="pointer-events-none absolute bottom-[18%] flex flex-col items-center text-center"
            initial={{ opacity: 0, y: 12 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="font-serif text-2xl font-light tracking-luxe text-ivory md:text-3xl">
              SHIV
            </span>
            <span className="mt-2 text-[10px] uppercase tracking-luxe text-gold md:text-xs">
              Fine Jewelry
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
