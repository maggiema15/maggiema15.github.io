// Measured against the transparent 960 × 640 player artwork. These coordinates
// drive both the scene target and the viewport overlay; keep them in one place.
export const playerGeometry = {
  platterX: 50,
  platterY: 50.5,
  platterWidth: 58.2,
  platterHeight: 23,
  pivotX: 82.2,
  pivotY: 47,
  armWidth: 26,
  armAngle: 36,
} as const

export type MotionStyle = 'transfer' | 'turntable'
export type MotionRate = 1 | 0.5
export type MotionSettings = { style: MotionStyle; rate: MotionRate }
export const defaultMotion: MotionSettings = { style: 'transfer', rate: 1 }
const storageKey = 'vinyl-motion-preview'

export function readMotionSettings(): MotionSettings {
  if (import.meta.env.DEV) {
    try {
      const saved = JSON.parse(sessionStorage.getItem(storageKey) ?? 'null')
      if ((saved?.style === 'transfer' || saved?.style === 'turntable')
        && (saved?.rate === 1 || saved?.rate === 0.5)) return saved
    } catch { /* Preview controls work without browser storage. */ }
  }
  return defaultMotion
}

export function saveMotionSettings(settings: MotionSettings) {
  if (import.meta.env.DEV) {
    try { sessionStorage.setItem(storageKey, JSON.stringify(settings)) } catch { /* Optional. */ }
  }
}
