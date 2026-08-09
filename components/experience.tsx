'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { Cursor } from './cursor'
import { SmoothScroll } from './smooth-scroll'
import { Intro } from './intro'
import { Navigation } from './navigation'
import { Hero } from './hero'
import { Story } from './story'
import { Craftsmanship } from './craftsmanship'
import { Detail } from './detail'
import { ModelSection } from './model-section'
import { Collections } from './collections'
import { Featured } from './featured'
import { Footer } from './footer'
import { QuickView } from './quick-view'
import type { Product } from '@/lib/jewelry-data'

export function Experience() {
  const [ready, setReady] = useState(false)
  const [active, setActive] = useState<Product | null>(null)
  const [cartCount, setCartCount] = useState(0)
  const [toast, setToast] = useState<string | null>(null)

  const handleAdd = useCallback((p: Product, qty: number) => {
    setCartCount((c) => c + qty)
    setActive(null)
    setToast(`${p.name} added to your cart`)
    setTimeout(() => setToast(null), 2600)
  }, [])

  return (
    <>
      <Cursor />
      <SmoothScroll />
      <Intro onDone={() => setReady(true)} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <Navigation cartCount={cartCount} />
        <Hero />
        <Story />
        <Collections />
        <Craftsmanship />
        <Detail />
        <ModelSection />
        <Featured onQuickView={setActive} />
        <Footer />
      </motion.main>

      <QuickView product={active} onClose={() => setActive(null)} onAdd={handleAdd} />

      {/* toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 z-[95] flex -translate-x-1/2 items-center gap-3 border border-gold/30 bg-card px-5 py-3.5 text-sm text-ivory shadow-2xl"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold">
              <Check className="h-3.5 w-3.5 text-background" />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
