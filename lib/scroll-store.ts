import { create } from 'zustand'
import type Lenis from 'lenis'

interface ScrollStore {
  /** Normalized page scroll progress 0–1, updated every Lenis tick */
  progress: number
  setProgress: (p: number) => void
  /** Live Lenis instance — available after SmoothScroll mounts */
  lenis: Lenis | null
  setLenis: (l: Lenis | null) => void
}

export const useScrollStore = create<ScrollStore>((set) => ({
  progress: 0,
  setProgress: (progress) => set({ progress }),
  lenis: null,
  setLenis: (lenis) => set({ lenis }),
}))

/**
 * Plain mutable ref updated on every Lenis RAF tick.
 * Read this inside Three.js `useFrame` callbacks — zero React re-render cost.
 */
export const scrollProgressRef: { current: number } = { current: 0 }
