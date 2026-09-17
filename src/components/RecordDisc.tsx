import { useLayoutEffect, useRef } from 'react'
import type { PlaybackPhase, RecordPath } from '../hooks/useRecordPlayback'

type Props = {
  image: string
  phase: PlaybackPhase
  path: RecordPath
  onComplete: (name: string) => void
}

// A constant painted size: travel and apparent size only change transforms.
const discSize = 160
const platterTilt = 0.31
const smooth = (t: number) => t * t * (3 - 2 * t)
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const transform = (x: number, y: number, size: number) =>
  `translate3d(${x - discSize / 2}px, ${y - discSize / 2}px, 0) scale(${size / discSize})`

function flightFrames({ source: s, destination: d }: RecordPath, returning: boolean) {
  const loweringHeight = Math.max(12, d.size * 0.35)
  const hoverY = d.y - loweringHeight
  // Small phone scenes still need a legible disc in transit. It scales back
  // to the measured platter before lowering, rather than covering the player.
  const liftSize = Math.max(s.size * 0.3, 72 - Math.max(s.size, d.size))
  const control1 = {
    x: mix(s.x, d.x, 0.08),
    y: Math.max(s.size / 2 + 8, s.y - s.size * 1.2),
  }
  const control2 = {
    x: d.x + (s.x - d.x) * 0.15 + s.size * 0.28,
    y: Math.max(s.size / 2 + 8, Math.min(s.y, d.y) - s.size * 0.65),
  }
  const travel: Keyframe[] = []
  const tilt: Keyframe[] = []
  // Sample the curve once. The browser interpolates these transform-only frames;
  // there are no per-frame React renders, geometry reads, or JS style writes.
  for (let i = 0; i <= 80; i++) {
    const offset = i / 80
    const progress = returning ? 1 - offset : offset
    const t = smooth(Math.min(1, progress / 0.78))
    const lowering = smooth(Math.max(0, (progress - 0.78) / 0.22))
    const u = 1 - t
    const x = u ** 3 * s.x + 3 * u ** 2 * t * control1.x + 3 * u * t ** 2 * control2.x + t ** 3 * d.x
    const y = u ** 3 * s.y + 3 * u ** 2 * t * control1.y + 3 * u * t ** 2 * control2.y + t ** 3 * hoverY + lowering * loweringHeight
    const size = mix(s.size, d.size, t) + Math.sin(Math.PI * t) * liftSize
    travel.push({ offset, transform: transform(x, y, size), opacity: Math.min(1, progress / 0.1) })
    const tiltProgress = smooth(Math.max(0, Math.min(1, (t - 0.38) / 0.62)))
    tilt.push({ offset, transform: `scaleY(${mix(1, 0.45, tiltProgress) - lowering * (0.45 - platterTilt)})` })
  }
  return { travel, tilt }
}

export function RecordDisc({ image, phase, path, onComplete }: Props) {
  const travelRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const moving = phase === 'flying' || phase === 'returning'

  useLayoutEffect(() => {
    if ((!moving && phase !== 'settling') || !travelRef.current || !tiltRef.current) return
    const frames = moving ? flightFrames(path, phase === 'returning') : null
    const options: KeyframeAnimationOptions = {
      duration: phase === 'settling' ? 420 : phase === 'returning' ? 820 : 1400,
      easing: 'linear',
      fill: 'both',
    }
    // The still-visible landing beat shares the completion/cancellation lifecycle
    // with travel. No detached timer can open a stale section after a resize.
    const travel = travelRef.current.animate(frames?.travel ?? [{ opacity: 1 }, { opacity: 1 }], options)
    const tilt = frames ? tiltRef.current.animate(frames.tilt, options) : null
    let cancelled = false
    void travel.finished.then(() => {
      if (!cancelled) onComplete(phase === 'settling' ? 'recordSettled' : phase === 'returning' ? 'returnToSleeve' : 'flyToPlayer')
    }).catch(() => { /* Cancellation is expected on resize, unmount, or reduced motion. */ })
    return () => {
      cancelled = true
      travel.cancel()
      tilt?.cancel()
    }
  }, [moving, phase, path, onComplete])

  const { destination } = path
  return (
    <div
      ref={travelRef}
      className={`recordTravel ${moving ? 'isMoving' : 'isLanded'}`}
      data-phase={phase}
      style={{ transform: transform(destination.x, destination.y, destination.size) }}
      aria-hidden="true"
    >
      <div ref={tiltRef} className="recordTilt">
        <div className="recordSurface">
          <div className="recordGrooves" />
          <div className="recordLabel"><img src={image} alt="" /></div>
          <div className="recordHole" />
        </div>
      </div>
    </div>
  )
}
