'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Menu, Search, ShoppingBag, User, X } from 'lucide-react'

const links: { label: string; href: string }[] = [
  { label: 'Collections', href: '#collections' },
  { label: 'Rings', href: '#featured' },
  { label: 'Necklaces', href: '#featured' },
  { label: 'Earrings', href: '#featured' },
  { label: 'Bangles', href: '#featured' },
  { label: 'About', href: '#craft' },
]

export function Navigation({ cartCount = 0 }: { cartCount?: number }) {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 40)
      // hide when scrolling down, reveal when scrolling up
      setHidden(y > last && y > 200)
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-background/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1600px] items-center justify-between px-4 sm:px-6 md:px-10 transition-all duration-500 ${
            scrolled ? 'py-3' : 'py-4 md:py-5'
          }`}
        >
          {/* left links (desktop) */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {links.slice(0, 3).map((l) => (
              <NavLink key={l.label} label={l.label} href={l.href} />
            ))}
          </nav>

          {/* mobile menu button with touch padding */}
          <button
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center -ml-2 rounded-full transition-colors hover:bg-ivory/5 lg:hidden"
            aria-label="Open menu"
            data-cursor
          >
            <Menu className="h-5 w-5 text-ivory" />
          </button>

          {/* centered wordmark */}
          <a
            href="#top"
            data-cursor
            className="flex flex-col items-center leading-none"
            aria-label="Shiv Fine Jewelry home"
          >
            <span className="font-serif text-base tracking-luxe text-ivory md:text-lg">
              SHIV
            </span>
            <span className="mt-1 text-[8px] uppercase tracking-luxe text-gold md:text-[9px]">
              Fine Jewelry
            </span>
          </a>

          {/* right icons */}
          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-3">
            <nav className="hidden items-center gap-7 lg:flex">
              {links.slice(3).map((l) => (
                <NavLink key={l.label} label={l.label} href={l.href} />
              ))}
            </nav>
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                aria-label="Search"
                data-cursor
                className="hidden h-10 w-10 items-center justify-center rounded-full sm:flex hover:bg-ivory/5"
              >
                <Search className="h-[18px] w-[18px] text-ivory/90 transition-colors hover:text-gold" />
              </button>
              <button
                aria-label="Account"
                data-cursor
                className="hidden h-10 w-10 items-center justify-center rounded-full sm:flex hover:bg-ivory/5"
              >
                <User className="h-[18px] w-[18px] text-ivory/90 transition-colors hover:text-gold" />
              </button>
              <button
                aria-label="Wishlist"
                data-cursor
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-ivory/5"
              >
                <Heart className="h-[18px] w-[18px] text-ivory/90 transition-colors hover:text-gold" />
              </button>
              <button
                aria-label="Cart"
                data-cursor
                className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-ivory/5"
              >
                <ShoppingBag className="h-[18px] w-[18px] text-ivory/90 transition-colors hover:text-gold" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[9px] font-medium text-background">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-background lg:hidden overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/50">
              <div className="flex flex-col leading-none">
                <span className="font-serif text-lg tracking-luxe text-ivory">SHIV</span>
                <span className="mt-1 text-[8px] uppercase tracking-luxe text-gold">
                  Fine Jewelry
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-ivory/10"
              >
                <X className="h-6 w-6 text-ivory" />
              </button>
            </div>

            {/* mobile search bar */}
            <div className="px-6 pt-6">
              <div className="flex items-center gap-3 border border-border bg-card/50 px-4 py-3 text-xs text-ivory">
                <Search className="h-4 w-4 text-gold" />
                <input
                  type="text"
                  placeholder="Search collections, rings, gemstones..."
                  className="w-full bg-transparent text-xs text-ivory placeholder:text-ivory/40 focus:outline-none"
                />
              </div>
            </div>

            <nav className="mt-6 flex flex-col px-6">
              {links.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="flex items-center justify-between border-b border-border/50 py-4 font-serif text-2xl font-light text-ivory hover:text-gold"
                >
                  <span>{l.label}</span>
                  <span className="text-xs font-sans text-gold/60">0{i + 1}</span>
                </motion.a>
              ))}
            </nav>

            {/* mobile drawer footer actions */}
            <div className="mt-auto px-6 py-8 border-t border-border/50 flex items-center justify-between text-xs text-ivory/70">
              <a href="#featured" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-gold">
                <User className="h-4 w-4 text-gold" />
                <span>Account</span>
              </a>
              <a href="#featured" onClick={() => setOpen(false)} className="flex items-center gap-2 hover:text-gold">
                <Heart className="h-4 w-4 text-gold" />
                <span>Wishlist</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      data-cursor
      className="group relative text-xs uppercase tracking-wide-luxe text-ivory/85 transition-colors hover:text-ivory"
    >
      {label}
      <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
    </a>
  )
}
