'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ModelSection() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1])
  const glow = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.5, 0])

  const words = ['The', 'woman', 'who', 'wears', 'her', 'story.']

  return (
    <section
      ref={ref}
      aria-label="An editorial portrait"
      className="relative h-[130svh] overflow-hidden bg-background"
    >
      <motion.div style={{ y: imgY, scale: imgScale }} className="absolute inset-0">
        <Image
          src="/images/model.png"
          alt="An elegant woman wearing gold and emerald jewelry, lit against darkness"
          fill
          sizes="100vw"
          className="object-cover object-top"
        />
      </motion.div>

      {/* light bloom that catches the jewelry as you scroll */}
      <motion.div
        style={{ opacity: glow }}
        className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 rounded-full bg-gold blur-[100px]"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-background/40" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end px-4 sm:px-6 pb-16 sm:pb-24 text-center md:pb-32">
        <p className="flex flex-wrap justify-center gap-x-2 sm:gap-x-3 font-serif text-3xl sm:text-5xl font-light text-ivory md:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-120px' }}
              transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={i === 5 ? 'italic gold-text' : ''}
            >
              {w}
            </motion.span>
          ))}
        </p>
      </div>
    </section>
  )
}
