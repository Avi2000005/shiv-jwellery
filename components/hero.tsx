'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { Gem } from './three/gem'
import { StudioEnv } from './three/studio-env'
import { LuxeButton } from './magnetic'
import { getDeviceTier } from '@/lib/device-tier'
import { Particles } from './particles'

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const [canvasInView, setCanvasInView] = useState(true)
  // Default to low tier initially, upgraded client-side for desktop high capability
  const [tier, setTier] = useState<'high' | 'low'>('low')
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  // The hero transforms as you scroll rather than sliding away
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.35])
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.92])
  const textY = useTransform(scrollYProgress, [0, 0.6], ['0%', '-60%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0])
  const gemOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])

  // Pause the 3D Canvas when hero is scrolled fully out of view
  useEffect(() => {
    setTier(getDeviceTier())

    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => setCanvasInView(e.isIntersecting),
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const reveal: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 1.1, delay: 0.2 + i * 0.15, ease: [0.16, 1, 0.3, 1] as const },
    }),
  }

  return (
    <section
      id="top"
      ref={ref}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* cinematic backdrop */}
      <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
        <Image
          src="/images/hero.png"
          alt="A radiant Indian gold necklace with an emerald centerpiece against darkness"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
      <motion.div
        style={{ opacity: overlayOpacity }}
        className="absolute inset-0 bg-background"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-background/60" />

      {/* floating dust particles — capped low for perf */}
      <Particles className="absolute inset-0" count={16} />

      {/* subtle 3D gem accent — desktop high-tier only */}
      {tier === 'high' && (
        <motion.div
          style={{ opacity: gemOpacity }}
          className="pointer-events-none absolute right-[8%] top-1/2 hidden h-[42vh] w-[24vw] -translate-y-1/2 lg:block gpu-layer"
        >
          <Canvas
            camera={{ position: [0, 0, 5], fov: 40 }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, powerPreference: 'high-performance', antialias: false }}
            frameloop={canvasInView ? 'always' : 'demand'}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[5, 5, 5]} intensity={70} color="#ffe4b0" />
              <spotLight position={[-4, -3, 2]} intensity={30} color="#bfe6ff" />
              <Float speed={1.6} rotationIntensity={0.5} floatIntensity={1.1}>
                <Gem scale={1.15} spin={0.5} color="#fff0d4" />
              </Float>
              <StudioEnv />
            </Suspense>
          </Canvas>
        </motion.div>
      )}

      {/* headline */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="relative z-10 flex h-full flex-col items-center justify-center px-4 sm:px-6 text-center"
      >
        <motion.span
          custom={0}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mb-4 sm:mb-6 text-[10px] uppercase tracking-luxe text-gold md:text-xs"
        >
          Shiv — Est. Heritage
        </motion.span>
        <motion.h1
          custom={1}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="max-w-4xl text-balance font-serif text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-light leading-[1.08] text-ivory"
        >
          Jewelry That <span className="italic gold-text">Tells</span> Your Story
        </motion.h1>
        <motion.p
          custom={2}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mt-5 sm:mt-7 max-w-xs sm:max-w-md text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/75 md:text-base"
        >
          Timeless craftsmanship, reimagined for the modern woman.
        </motion.p>
        <motion.div
          custom={3}
          variants={reveal}
          initial="hidden"
          animate="show"
          className="mt-8 sm:mt-10 flex flex-col items-center gap-3 sm:flex-row sm:gap-5 w-full sm:w-auto px-4 sm:px-0"
        >
          <div className="w-full sm:w-auto">
            <LuxeButton href="#collections" label="View" variant="solid">
              Explore Collection
            </LuxeButton>
          </div>
          <div className="w-full sm:w-auto">
            <LuxeButton href="#craft" label="Watch" variant="ghost">
              Discover the Craft
            </LuxeButton>
          </div>
        </motion.div>
      </motion.div>

      {/* scroll to discover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[9px] uppercase tracking-luxe text-ivory/60">
          Scroll to discover
        </span>
        <span className="relative flex h-12 w-px overflow-hidden bg-ivory/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            animate={{ y: ['-100%', '200%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </span>
      </motion.div>
    </section>
  )
}
