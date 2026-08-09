'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

const steps = [
  { n: 'I', label: 'Raw gold', note: '24k ingots, weighed and melted' },
  { n: 'II', label: 'Shaping', note: 'Hand-forged over days' },
  { n: 'III', label: 'The setting', note: 'Each stone seated by eye' },
  { n: 'IV', label: 'Polishing', note: 'Brought to a mirror finish' },
]

export function Craftsmanship() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  const lineWidth = useTransform(scrollYProgress, [0.15, 0.75], ['0%', '100%'])

  return (
    <section
      id="craft"
      ref={ref}
      className="relative overflow-hidden bg-background py-16 sm:py-28 md:py-40"
    >
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
          {/* macro image */}
          <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-sm">
            <motion.div style={{ scale: imgScale }} className="absolute inset-0">
              <Image
                src="/images/craft.png"
                alt="A jeweler's hands setting an emerald into a gold ring"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
          </div>

          {/* copy + process */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8 }}
              className="text-[10px] uppercase tracking-luxe text-gold"
            >
              The Craft
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, delay: 0.1 }}
              className="mt-4 sm:mt-5 text-balance font-serif text-3xl sm:text-4xl font-light leading-[1.1] text-ivory md:text-6xl"
            >
              Made by hand,
              <br />
              <span className="italic gold-text">meant for a lifetime</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="mt-4 sm:mt-6 max-w-md text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/60"
            >
              Every piece passes through a single pair of hands, from raw gold to
              final polish — a quiet ritual repeated across generations.
            </motion.p>

            {/* process line */}
            <div className="relative mt-10 sm:mt-14">
              <div className="hidden sm:block absolute left-0 top-5 h-px w-full bg-border" />
              <motion.div
                style={{ width: lineWidth }}
                className="hidden sm:block absolute left-0 top-5 h-px bg-gold"
              />
              <ol className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4 sm:gap-y-0">
                {steps.map((s, i) => (
                  <motion.li
                    key={s.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6, delay: i * 0.15 }}
                    className="flex flex-col border-l border-gold/20 sm:border-l-0 pl-3 sm:pl-0"
                  >
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-gold/40 bg-background font-serif text-xs sm:text-sm text-gold">
                      {s.n}
                    </span>
                    <span className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium sm:font-normal text-ivory">{s.label}</span>
                    <span className="mt-1 text-[11px] sm:text-xs font-light text-ivory/50">
                      {s.note}
                    </span>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
