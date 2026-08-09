'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye, Heart } from 'lucide-react'
import { formatPrice, products, type Product } from '@/lib/jewelry-data'

export function Featured({
  onQuickView,
}: {
  onQuickView: (p: Product) => void
}) {
  const [wished, setWished] = useState<Set<string>>(new Set())

  const toggleWish = (id: string) => {
    setWished((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <section id="featured" className="relative bg-background py-28 md:py-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12">
        <div className="mb-14 text-center">
          <span className="text-[10px] uppercase tracking-luxe text-gold">
            Featured
          </span>
          <h2 className="mt-4 text-balance font-serif text-4xl font-light text-ivory md:text-6xl">
            Chosen for you
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              index={i}
              wished={wished.has(p.id)}
              onWish={() => toggleWish(p.id)}
              onQuickView={() => onQuickView(p)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({
  product,
  index,
  wished,
  onWish,
  onQuickView,
}: {
  product: Product
  index: number
  wished: boolean
  onWish: () => void
  onQuickView: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    setTilt({ x: py * -8, y: px * 8 })
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.1 }}
      className="group"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        className="relative aspect-[4/5] overflow-hidden bg-card"
        style={{ perspective: 900 }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{ rotateX: tilt.x, rotateY: tilt.y }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading="lazy"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </motion.div>

        {/* wishlist */}
        <button
          onClick={onWish}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          data-cursor
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-background/60 backdrop-blur-sm transition-colors hover:bg-background/90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wished ? 'fill-gold text-gold' : 'text-ivory'
            }`}
          />
        </button>

        {/* quick view reveal — always visible on mobile, hover-revealed on desktop */}
        <div className="absolute inset-x-0 bottom-0 translate-y-0 lg:translate-y-full p-3 transition-transform duration-500 lg:group-hover:translate-y-0">
          <button
            onClick={onQuickView}
            data-cursor
            className="flex w-full items-center justify-center gap-2 bg-gold/95 py-3 text-[11px] uppercase tracking-luxe text-background backdrop-blur-sm shadow-lg active:scale-98 transition-transform"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-serif text-lg font-light text-ivory">
            {product.name}
          </h3>
          <span className="whitespace-nowrap font-serif text-lg text-gold">
            {formatPrice(product.price)}
          </span>
        </div>
        <p className="mt-1 text-xs font-light text-ivory/45">
          {product.gemstone} · {product.gold}
        </p>
      </div>
    </motion.article>
  )
}
