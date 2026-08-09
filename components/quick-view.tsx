'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { formatPrice, metals, sizes, type Product } from '@/lib/jewelry-data'

export function QuickView({
  product,
  onClose,
  onAdd,
}: {
  product: Product | null
  onClose: () => void
  onAdd: (p: Product, qty: number) => void
}) {
  const [metal, setMetal] = useState(0)
  const [size, setSize] = useState(2)
  const [qty, setQty] = useState(1)

  // drag-to-rotate 360 illusion
  const rot = useRef(0)
  const [rotDeg, setRotDeg] = useState(0)
  const dragging = useRef(false)
  const lastX = useRef(0)

  // Lock body scroll when quick view modal is open
  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [product])

  const onDown = (x: number) => {
    dragging.current = true
    lastX.current = x
  }
  const onMove = (x: number) => {
    if (!dragging.current) return
    rot.current += (x - lastX.current) * 0.6
    lastX.current = x
    setRotDeg(rot.current)
  }
  const onUp = () => (dragging.current = false)

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            key={product.id}
            role="dialog"
            aria-modal="true"
            aria-label={`${product.name} quick view`}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative grid w-full max-w-4xl grid-cols-1 max-h-[88vh] overflow-y-auto border border-gold/30 bg-card rounded-md md:rounded-none md:max-h-[85vh] md:grid-cols-2 shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              data-cursor
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card/80 text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-4 w-4" />
            </button>

            {/* visual — drag to rotate */}
            <div
              className="relative flex h-64 sm:h-80 md:h-auto items-center justify-center bg-background p-6 md:p-8"
              data-cursor
              data-cursor-label="Drag"
              onMouseDown={(e) => onDown(e.clientX)}
              onMouseMove={(e) => onMove(e.clientX)}
              onMouseUp={onUp}
              onMouseLeave={onUp}
              onTouchStart={(e) => onDown(e.touches[0].clientX)}
              onTouchMove={(e) => onMove(e.touches[0].clientX)}
              onTouchEnd={onUp}
            >
              <motion.div
                className="relative h-full w-full max-h-60 md:max-h-80"
                style={{ rotate: rotDeg * 0.15, scale: 1 }}
              >
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 40vw"
                  className="object-contain"
                  style={{
                    transform: `perspective(1000px) rotateY(${rotDeg}deg)`,
                  }}
                />
              </motion.div>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-luxe text-ivory/50 bg-background/60 px-3 py-1 rounded-full border border-border/40 backdrop-blur-sm">
                Drag to rotate · 360°
              </span>
            </div>

            {/* details */}
            <div className="flex flex-col p-6 sm:p-8 md:p-10">
              <span className="text-[10px] uppercase tracking-luxe text-gold">
                {product.category}
              </span>
              <h3 className="mt-2 font-serif text-2xl font-light text-ivory sm:text-3xl md:text-4xl">
                {product.name}
              </h3>
              <p className="mt-1.5 font-serif text-xl sm:text-2xl text-gold">
                {formatPrice(product.price)}
              </p>

              <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-border py-5 text-xs">
                <div>
                  <dt className="text-ivory/40">Gemstone</dt>
                  <dd className="mt-1 text-ivory">{product.gemstone}</dd>
                </div>
                <div>
                  <dt className="text-ivory/40">Metal</dt>
                  <dd className="mt-1 text-ivory">{product.gold}</dd>
                </div>
              </dl>

              {/* metal select */}
              <fieldset className="mt-6">
                <legend className="text-[10px] uppercase tracking-wide-luxe text-ivory/50">
                  Metal
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {metals.map((m, i) => (
                    <button
                      key={m}
                      onClick={() => setMetal(i)}
                      data-cursor
                      className={`border px-3 py-2 text-xs transition-colors ${
                        metal === i
                          ? 'border-gold text-gold'
                          : 'border-border text-ivory/60 hover:border-ivory/40'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* size select */}
              <fieldset className="mt-5">
                <legend className="text-[10px] uppercase tracking-wide-luxe text-ivory/50">
                  Size
                </legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((s, i) => (
                    <button
                      key={s}
                      onClick={() => setSize(i)}
                      data-cursor
                      className={`h-10 w-10 border text-xs transition-colors ${
                        size === i
                          ? 'border-gold text-gold'
                          : 'border-border text-ivory/60 hover:border-ivory/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>

              {/* qty + actions */}
              <div className="mt-auto pt-8">
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-[10px] uppercase tracking-wide-luxe text-ivory/50">
                    Qty
                  </span>
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Decrease quantity"
                      data-cursor
                      className="flex h-9 w-9 items-center justify-center text-ivory hover:text-gold"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm text-ivory">{qty}</span>
                    <button
                      onClick={() => setQty((q) => Math.min(9, q + 1))}
                      aria-label="Increase quantity"
                      data-cursor
                      className="flex h-9 w-9 items-center justify-center text-ivory hover:text-gold"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => onAdd(product, qty)}
                    data-cursor
                    className="flex-1 border border-gold bg-gold py-3.5 text-[11px] uppercase tracking-luxe text-background transition-colors hover:bg-transparent hover:text-gold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => onAdd(product, qty)}
                    data-cursor
                    className="flex-1 border border-ivory/30 py-3.5 text-[11px] uppercase tracking-luxe text-ivory transition-colors hover:border-gold hover:text-gold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
