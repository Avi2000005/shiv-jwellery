'use client'

import { useEffect, useRef, useState } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [enabled, setEnabled] = useState(false)
  const [hovering, setHovering] = useState(false)
  const [label, setLabel] = useState<string | null>(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return
    setEnabled(true)
    document.documentElement.classList.add('cursor-none-desktop')

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const ring = { x: pos.x, y: pos.y }
    let raf = 0

    const move = (e: MouseEvent) => {
      pos.x = e.clientX
      pos.y = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`
      }
      const t = e.target as HTMLElement
      const interactive = t.closest('a, button, [data-cursor]')
      setHovering(!!interactive)
      setLabel(interactive?.getAttribute('data-cursor-label') ?? null)
    }

    const loop = () => {
      ring.x += (pos.x - ring.x) * 0.16
      ring.y += (pos.y - ring.y) * 0.16
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0)`
      }
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', move)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('cursor-none-desktop')
    }
  }, [])

  if (!enabled) return null

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dotRef}
        className="absolute left-0 top-0 -ml-0.5 -mt-0.5 h-1 w-1 rounded-full bg-gold"
      />
      <div
        ref={ringRef}
        className="absolute left-0 top-0 flex items-center justify-center rounded-full border border-gold/60 transition-[width,height,background-color] duration-300 ease-out"
        style={{
          width: hovering ? 64 : 30,
          height: hovering ? 64 : 30,
          marginLeft: hovering ? -32 : -15,
          marginTop: hovering ? -32 : -15,
          backgroundColor: hovering ? 'oklch(0.78 0.105 82 / 0.08)' : 'transparent',
        }}
      >
        {label && (
          <span className="text-[9px] uppercase tracking-luxe text-gold">{label}</span>
        )}
      </div>
    </div>
  )
}
