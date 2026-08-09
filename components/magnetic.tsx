'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export function Magnetic({
  children,
  strength = 0.4,
  className,
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.3 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return
    }
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function LuxeButton({
  children,
  variant = 'solid',
  href = '#',
  label,
}: {
  children: ReactNode
  variant?: 'solid' | 'ghost'
  href?: string
  label?: string
}) {
  return (
    <Magnetic strength={0.35} className="w-full sm:w-auto">
      <a
        href={href}
        data-cursor
        data-cursor-label={label}
        className={`group relative inline-flex w-full sm:w-auto items-center justify-center overflow-hidden px-7 sm:px-8 py-3.5 sm:py-4 text-[11px] uppercase tracking-luxe transition-colors duration-500 ${
          variant === 'solid'
            ? 'bg-gold text-background hover:bg-transparent hover:text-gold'
            : 'text-ivory hover:text-gold'
        }`}
      >
        <span
          className={`pointer-events-none absolute inset-0 border transition-colors duration-500 ${
            variant === 'solid'
              ? 'border-gold'
              : 'border-ivory/30 group-hover:border-gold'
          }`}
        />
        <span className="relative text-center">{children}</span>
      </a>
    </Magnetic>
  )
}
