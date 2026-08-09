'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

type Dot = {
  left: number
  top: number
  size: number
  delay: number
  duration: number
  drift: number
}

export function Particles({
  count = 30,
  className,
}: {
  count?: number
  className?: string
}) {
  const [dots, setDots] = useState<Dot[]>([])

  // Generate only on the client to avoid SSR/client hydration mismatch.
  // Cap count at 20 max to keep GPU load low on mobile/low-end devices.
  useEffect(() => {
    const safeCount = Math.min(count, 20)
    setDots(
      Array.from({ length: safeCount }).map(() => ({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() * 2 + 0.5,
        delay: Math.random() * 8,
        // Slower duration = fewer repaints per second
        duration: Math.random() * 10 + 12,
        drift: (Math.random() - 0.5) * 30,
      })),
    )
  }, [count])

  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className ?? ''}`}>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            // Blur is expensive — skip on tiny dots
            filter: d.size > 1.5 ? 'blur(0.5px)' : undefined,
            willChange: 'transform, opacity',
          }}
          animate={{
            y: [0, -50, 0],
            x: [0, d.drift, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
