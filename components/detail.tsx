'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const facets = [
  { at: [0.0, 0.33], label: 'The fire', body: 'Fifty-eight facets, cut to catch the light from every angle.' },
  { at: [0.33, 0.66], label: 'The gold', body: 'A warm 22k surface, hand-burnished until it holds the room.' },
  { at: [0.66, 1.0], label: 'The setting', body: 'Micro-prongs, invisible from a step away, unbreakable up close.' },
]

export function Detail() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  // scroll-controlled macro zoom
  const scale = useTransform(scrollYProgress, [0, 1], [1, 2.4])
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-14%'])
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <section ref={ref} aria-label="The detail" className="relative h-[320svh] bg-background">
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden contain-paint">
        <motion.div style={{ scale, x, y }} className="absolute inset-0">
          <Image
            src="/images/macro-diamond.png"
            alt="Extreme macro of a brilliant-cut diamond set in gold prongs"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-background/30" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 md:px-12">
          <div className="max-w-xs sm:max-w-md">
            <span className="text-[10px] uppercase tracking-luxe text-gold">The Detail</span>
            {facets.map((f, i) => (
              <FacetCaption key={i} facet={f} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function FacetCaption({
  facet,
  progress,
}: {
  facet: (typeof facets)[number]
  progress: ReturnType<typeof useScroll>['scrollYProgress']
}) {
  const [start, end] = facet.at
  const mid = start + (end - start) / 2
  const opacity = useTransform(progress, [start, mid - 0.06, mid + 0.06, end], [0, 1, 1, 0])
  const y = useTransform(progress, [start, end], [24, -24])
  return (
    <motion.div style={{ opacity, y }} className="absolute mt-4 sm:mt-6 max-w-xs sm:max-w-md">
      <h3 className="text-balance font-serif text-2xl sm:text-4xl font-light leading-tight text-ivory md:text-6xl">
        {facet.label}
      </h3>
      <p className="mt-2 sm:mt-4 text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/70">
        {facet.body}
      </p>
    </motion.div>
  )
}
