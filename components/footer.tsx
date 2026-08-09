'use client'

import { motion } from 'framer-motion'
import { Particles } from './particles'

const cols = [
  { title: 'Collections', links: ['Rings', 'Necklaces', 'Earrings', 'Bangles'] },
  { title: 'The House', links: ['Our Story', 'Craftsmanship', 'Ateliers', 'Journal'] },
  { title: 'Service', links: ['Appointments', 'Care & Repair', 'Sizing', 'Contact'] },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-background">
      <Particles className="absolute inset-0" count={24} />

      {/* newsletter / statement */}
      <div className="relative mx-auto max-w-[1600px] px-5 sm:px-8 py-16 sm:py-24 md:px-12 md:py-32">
        <div className="grid gap-10 sm:gap-14 lg:grid-cols-2">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="max-w-md text-balance font-serif text-3xl sm:text-4xl font-light leading-[1.08] text-ivory md:text-6xl"
            >
              Begin your <span className="italic gold-text">story</span>
            </motion.h2>
            <p className="mt-4 sm:mt-6 max-w-sm text-pretty text-xs sm:text-sm font-light leading-relaxed text-ivory/60">
              Join the house for private viewings, new arrivals and the stories
              behind each piece.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-6 sm:mt-8 flex max-w-sm items-center border-b border-border pb-3"
            >
              <input
                type="email"
                required
                placeholder="Your email address"
                aria-label="Email address"
                className="w-full bg-transparent text-xs sm:text-sm text-ivory placeholder:text-ivory/30 focus:outline-none"
              />
              <button
                type="submit"
                data-cursor
                className="whitespace-nowrap text-[11px] uppercase tracking-luxe text-gold transition-opacity hover:opacity-70"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {cols.map((c) => (
              <div key={c.title}>
                <h3 className="text-[10px] uppercase tracking-wide-luxe text-gold font-medium">
                  {c.title}
                </h3>
                <ul className="mt-4 sm:mt-5 flex flex-col gap-2.5 sm:gap-3">
                  {c.links.map((l) => (
                    <li key={l}>
                      <a
                        href="#"
                        data-cursor
                        className="text-xs sm:text-sm font-light text-ivory/60 transition-colors hover:text-ivory"
                      >
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* giant wordmark */}
      <div className="relative border-t border-border py-10">
        <p className="text-center font-serif text-[14vw] font-light leading-none text-ivory/[0.04] md:text-[11vw]">
          SHIV
        </p>
      </div>

      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-6 py-8 text-[11px] text-ivory/40 md:flex-row md:px-12">
        <span>© {new Date().getFullYear()} Shiv Fine Jewelry</span>
        <div className="flex gap-6">
          <a href="#" data-cursor className="hover:text-ivory">
            Instagram
          </a>
          <a href="#" data-cursor className="hover:text-ivory">
            Privacy
          </a>
          <a href="#" data-cursor className="hover:text-ivory">
            Terms
          </a>
        </div>
      </div>
    </footer>
  )
}
