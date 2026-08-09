'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { scrollProgressRef, useScrollStore } from '@/lib/scroll-store'

/**
 * Mounts Lenis smooth scrolling for the entire page.
 * Every tick updates:
 *  - `scrollProgressRef.current` — for zero-cost reads in Three.js useFrame
 *  - `useScrollStore.progress` — for reactive React components
 */
export function SmoothScroll() {
  const setProgress = useScrollStore((s) => s.setProgress)
  const setLenis = useScrollStore((s) => s.setLenis)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    setLenis(lenis)

    // Feed both the raw ref and the Zustand store on every scroll event
    lenis.on('scroll', ({ progress }: { progress: number }) => {
      scrollProgressRef.current = progress
      setProgress(progress)
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      setLenis(null)
    }
  }, [setProgress, setLenis])

  return null
}
