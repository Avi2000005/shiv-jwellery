export type DeviceTier = 'high' | 'low'

let _cached: DeviceTier | null = null

/**
 * Synchronously classify the device into 'high' or 'low' rendering tier.
 *
 * 'low' tier → skip heavy WebGL scenes to prevent hangs:
 *   • prefers-reduced-motion is set
 *   • deviceMemory < 4 GB  (Chrome/Edge)
 *   • hardwareConcurrency < 4 CPU threads
 *   • WebGL not supported at all
 */
export function getDeviceTier(): DeviceTier {
  if (typeof window === 'undefined') return 'high' // SSR: assume capable

  if (_cached !== null) return _cached

  // Honour the user's explicit accessibility preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return (_cached = 'low')
  }

  // Mobile screens (< 768px) → low tier to prevent WebGL context loss & preserve battery/performance
  if (window.innerWidth < 768) {
    return (_cached = 'low')
  }

  // WebGL unavailable → definitely low tier
  try {
    const testCanvas = document.createElement('canvas')
    const gl = testCanvas.getContext('webgl') ?? testCanvas.getContext('experimental-webgl')
    if (!gl) return (_cached = 'low')
  } catch {
    return (_cached = 'low')
  }

  // RAM < 4 GB (Chrome / Edge only — undefined on other browsers, so ignore)
  const mem = (navigator as any).deviceMemory
  if (typeof mem === 'number' && mem < 4) return (_cached = 'low')

  // Fewer than 4 logical CPU cores
  const cores = navigator.hardwareConcurrency
  if (typeof cores === 'number' && cores < 4) return (_cached = 'low')

  return (_cached = 'high')
}

/** React-friendly — safe to call inside useState initializer */
export function getDeviceTierClient(): DeviceTier {
  if (typeof window === 'undefined') return 'high'
  return getDeviceTier()
}
