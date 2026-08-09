'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, useScroll, useTransform } from 'framer-motion'
import { getDeviceTier } from '@/lib/device-tier'

const StoryScene = dynamic(
  () => import('./three/story-scene').then((m) => m.StoryScene),
  { ssr: false },
)

const captions = [
  {
    at: [0, 0.28],
    kicker: 'Chapter I — The Ring',
    title: 'A promise, cast in 22k gold',
    body: 'A solitaire diamond suspended in a hand-burnished band — breathtaking from every angle.',
  },
  {
    at: [0.32, 0.60],
    kicker: 'Chapter II — The Jhumka',
    title: 'Heritage bell earrings',
    body: 'Intricate filigree dome work adorned with ruby gemstones and hanging gold drops that catch the light with every move.',
  },
  {
    at: [0.64, 0.96],
    kicker: 'Chapter III — The Necklace',
    title: 'The royal centerpiece',
    body: 'A curved bead arc carrying a regal medallion centered with a brilliant sapphire — an heirloom meant to be remembered.',
  },
]

const chapterImages = [
  { at: [0, 0.33], src: '/images/cat-rings.png', title: 'The Solitaire Ring' },
  { at: [0.33, 0.66], src: '/images/cat-earrings.png', title: 'Heritage Bell Earrings' },
  { at: [0.66, 1.0], src: '/images/cat-necklaces.png', title: 'Royal Centerpiece Necklace' },
]

export function Story() {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useRef(0)

  // mount once; never unmount (avoids destroying WebGL context)
  const [reveal3d, setReveal3d] = useState(false)
  // controls frameloop — paused when section is fully off-screen
  const [storyInView, setStoryInView] = useState(false)
  // tier check runs client-side only — default to low tier for mobile safety
  const [tier, setTier] = useState<'high' | 'low'>('low')
  const [webglError, setWebglError] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useEffect(() => {
    setTier(getDeviceTier())

    const handleContextLost = () => {
      setWebglError(true)
    }

    window.addEventListener('webglcontextlost', handleContextLost)
    return () => {
      window.removeEventListener('webglcontextlost', handleContextLost)
    }
  }, [])

  useEffect(() => {
    if (tier === 'low' || webglError) return // skip 3D setup on mobile or low-end/errored devices

    const el = ref.current
    if (!el) return

    // Mount canvas when section is near viewport; track visibility for frameloop
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setReveal3d(true)
        setStoryInView(e.isIntersecting)
      },
      { rootMargin: '300px' }, // mount before visible, pause after leaving
    )
    io.observe(el)
    return () => io.disconnect()
  }, [tier, webglError])

  // Drive 3D progress from framer-motion scroll (Lenis fires these events)
  useEffect(() => {
    return scrollYProgress.on('change', (v) => {
      progress.current = v
    })
  }, [scrollYProgress])

  const useFallback = tier === 'low' || webglError

  return (
    <section
      ref={ref}
      aria-label="The making of a piece"
      className="relative h-[400svh] bg-background"
    >
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden contain-paint">
        {/* Background visuals: 3D canvas on high-tier desktop, luxury image showcase on mobile/low-tier */}
        <div className="pointer-events-none absolute inset-0 gpu-layer">
          {!useFallback && reveal3d ? (
            <StoryScene progress={progress} frameloop={storyInView ? 'always' : 'demand'} />
          ) : (
            <StoryImageFallback progress={scrollYProgress} />
          )}
        </div>

        {/* subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80" />

        {/* captions */}
        <div className="relative mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-12 z-10">
          {captions.map((c, i) => (
            <Caption
              key={i}
              caption={c}
              progress={scrollYProgress}
              align={i % 2 === 0 ? 'left' : 'right'}
              isFallback={useFallback}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function StoryImageFallback({
  progress,
}: {
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-radial-gold opacity-80" />
      {chapterImages.map((img, i) => {
        const [start, end] = img.at
        const fadeIn = start + (end - start) * 0.15
        const fadeOut = end - (end - start) * 0.15
        const opacity = useTransform(
          progress,
          [start, fadeIn, fadeOut, end],
          [0, 1, 1, 0],
        )
        const scale = useTransform(progress, [start, end], [0.94, 1.06])

        return (
          <motion.div
            key={i}
            style={{ opacity, scale }}
            className="absolute inset-0 flex items-center justify-center p-6 sm:p-12 md:justify-end md:pr-24"
          >
            <div className="relative aspect-square w-56 sm:w-80 md:w-96 overflow-hidden rounded-full border border-gold/40 shadow-2xl bg-card/60 backdrop-blur-md">
              <Image
                src={img.src}
                alt={img.title}
                fill
                sizes="(max-width: 768px) 80vw, 400px"
                className="object-contain p-4 sm:p-8"
                priority={i === 0}
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/30 rounded-full" />
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function Caption({
  caption,
  progress,
  align,
  isFallback,
}: {
  caption: (typeof captions)[number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
  align: 'left' | 'right'
  isFallback: boolean
}) {
  const [start, end] = caption.at
  const fadeIn = start + (end - start) * 0.15
  const fadeOut = end - (end - start) * 0.15
  const opacity = useTransform(
    progress,
    [start, fadeIn, fadeOut, end],
    [0, 1, 1, 0],
  )
  const y = useTransform(progress, [start, end], [25, -25])

  return (
    <motion.div
      style={{ opacity, y }}
      className={`absolute top-1/2 -translate-y-1/2 w-[calc(100%-2rem)] sm:w-auto max-w-xs sm:max-w-sm p-5 sm:p-6 bg-background/80 sm:bg-background/40 md:bg-transparent backdrop-blur-md sm:backdrop-blur-sm md:backdrop-blur-none border border-gold/20 md:border-none rounded-lg md:rounded-none shadow-xl md:shadow-none ${
        align === 'left' || isFallback
          ? 'left-4 sm:left-6 md:left-12 text-left'
          : 'right-4 text-left sm:text-right sm:right-6 md:right-12'
      }`}
    >
      <span className="text-[10px] uppercase tracking-luxe text-gold font-medium">
        {caption.kicker}
      </span>
      <h3 className="mt-2 sm:mt-4 text-balance font-serif text-2xl sm:text-3xl font-light leading-tight text-ivory md:text-5xl">
        {caption.title}
      </h3>
      <p className="mt-2 sm:mt-4 text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/80 md:text-ivory/60">
        {caption.body}
      </p>
    </motion.div>
  )
}
