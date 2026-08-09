'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { collections } from '@/lib/jewelry-data'

export function Collections() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="collections" className="relative bg-background py-16 sm:py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 sm:px-8 md:px-12">
        <div className="mb-10 sm:mb-14 flex flex-col justify-between gap-4 sm:gap-6 md:flex-row md:items-end">
          <div>
            <span className="text-[10px] uppercase tracking-luxe text-gold">
              The Collections
            </span>
            <h2 className="mt-3 sm:mt-4 text-balance font-serif text-3xl sm:text-5xl font-light leading-[1.08] text-ivory md:text-6xl">
              Four ways to <span className="italic gold-text">be remembered</span>
            </h2>
          </div>
          <p className="max-w-xs text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/60">
            Explore each world of the house — hover to look closer, click to
            step inside.
          </p>
        </div>

        {/* preview image that follows the active row (desktop) */}
        <div className="relative">
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute right-0 top-1/2 z-10 hidden aspect-[4/5] w-64 -translate-y-1/2 overflow-hidden lg:block shadow-2xl"
              >
                <Image
                  src={collections[active].image || '/placeholder.svg'}
                  alt={collections[active].name}
                  fill
                  sizes="256px"
                  className="object-cover"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-gold/30" />
              </motion.div>
            )}
          </AnimatePresence>

          <ul className="border-t border-border">
            {collections.map((c, i) => (
              <li key={c.name}>
                <a
                  href="#featured"
                  data-cursor
                  data-cursor-label="Open"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  className="group relative flex items-center justify-between overflow-hidden border-b border-border py-6 sm:py-8 md:py-10"
                >
                  {/* hover background wash */}
                  <span className="absolute inset-0 -z-0 origin-left scale-x-0 bg-gradient-to-r from-gold/10 to-transparent transition-transform duration-500 group-hover:scale-x-100" />

                  <div className="relative flex items-center gap-3 sm:gap-6 md:gap-8 min-w-0 pr-2">
                    <span className="font-serif text-xs text-gold/60 shrink-0">
                      0{i + 1}
                    </span>
                    <motion.span
                      className="font-serif text-2xl sm:text-4xl md:text-7xl font-light text-ivory transition-transform duration-500 group-hover:translate-x-3 truncate"
                      whileHover={{ letterSpacing: '0.02em' }}
                    >
                      {c.name}
                    </motion.span>
                    <span className="hidden text-xs font-light text-ivory/40 xl:block">
                      {c.tagline}
                    </span>
                  </div>

                  <div className="relative flex items-center gap-3 sm:gap-6 shrink-0">
                    <span className="text-[11px] sm:text-xs font-light text-ivory/50">
                      {c.count}
                    </span>
                    <span className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-border transition-colors duration-500 group-hover:border-gold group-hover:bg-gold">
                      <ArrowUpRight className="h-4 w-4 text-ivory transition-colors duration-500 group-hover:text-background" />
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
