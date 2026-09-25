import { useLayoutEffect, useRef } from 'react'
import vinylImage from '../assests/player/vinyl-v2.png'
import type { MotionSettings } from '../data/recordPlayer'
import type { PlaybackPhase, RecordPath } from '../hooks/useRecordPlayback'
import { Tonearm } from './Tonearm'

type Props = {
  image: string
  phase: PlaybackPhase
  path: RecordPath
  settings: MotionSettings
  fromParked: boolean
  reducedMotion: boolean
  onComplete: (name: string) => void
}

const discSize = 160
const clamp = (t: number) => Math.max(0, Math.min(1, t))
const smooth = (t: number) => { const n = clamp(t); return n * n * (3 - 2 * n) }
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const transform = (x: number, y: number, size: number) =>
  `translate3d(${x - discSize / 2}px, ${y - discSize / 2}px, 0) scale(${size / discSize})`

function flightFrames({ source: s, destination: d }: RecordPath, returning: boolean) {
  const exitX = s.sleeveRight + s.size * 0.52
  const exitY = s.y - s.size * 0.04
  const lift = d.size * 0.18
  const travel: Keyframe[] = []
  const tilt: Keyframe[] = []
  const shadow: Keyframe[] = []
  // Extract to the right first, keeping the sleeve edge in front of the disc.
  // Then follow one restrained curve. Apparent diameter never pulses in flight.
  for (let i = 0; i <= 80; i++) {
    const offset = i / 80
    const p = returning ? 1 - offset : offset
    const extraction = smooth(p / 0.2)
    const t = smooth((p - 0.2) / 0.66)
    const lowering = smooth((p - 0.86) / 0.14)
    const u = 1 - t
    const x = p < 0.2 ? mix(s.x, exitX, extraction)
      : u ** 3 * exitX + 3 * u ** 2 * t * (exitX + s.size * 0.08)
        + 3 * u * t ** 2 * (d.x + s.size * 0.14) + t ** 3 * d.x
    const y = p < 0.2 ? mix(s.y, exitY, extraction)
      : u ** 3 * exitY + 3 * u ** 2 * t * (exitY + (d.y - exitY) * 0.15)
        + 3 * u * t ** 2 * (d.y - lift * 1.5) + t ** 3 * (d.y - lift) + lowering * lift
    const size = mix(s.size, d.size, t)
    const sleeveMask = p < 0.2 ? clamp((s.sleeveRight - (x - size / 2)) / size) * 100 : 0
    travel.push({ offset, transform: transform(x, y, size), clipPath: `inset(0 0 0 ${sleeveMask}%)` })
    tilt.push({ offset, transform: `scaleY(${mix(1, d.tilt, smooth((p - 0.3) / 0.56))})` })
    shadow.push({ offset, opacity: smooth((p - 0.76) / 0.24) })
  }
  return { travel, tilt, shadow }
}

export function RecordDisc({ image, phase, path, settings, fromParked, reducedMotion, onComplete }: Props) {
  const travelRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef<HTMLDivElement>(null)
  const shadowRef = useRef<HTMLDivElement>(null)
  const surfaceRef = useRef<HTMLDivElement>(null)
  const angleRef = useRef(0)
  const moving = settings.style === 'transfer' && (phase === 'flying' || phase === 'returning')

  useLayoutEffect(() => {
    if (reducedMotion || !['flying', 'settling', 'playing', 'returning'].includes(phase)
      || !travelRef.current || !tiltRef.current) return
    const frames = moving ? flightFrames(path, phase === 'returning') : null
    const duration = (moving ? (phase === 'returning' ? 620 : 820) : phase === 'playing' ? 1000 : 220) / settings.rate
    const options: KeyframeAnimationOptions = { duration, easing: 'linear', fill: 'both' }
    const { destination: d } = path
    const localEntry = phase === 'flying' && !fromParked
    const stillFrames = localEntry ? [
      { opacity: 0, transform: transform(d.x, d.y - d.size * 0.06, d.size) },
      { opacity: 1, transform: transform(d.x, d.y, d.size) },
    ] : [{ opacity: 1 }, { opacity: 1 }]
    const travel = travelRef.current.animate(frames?.travel ?? stillFrames, options)
    const tilt = frames ? tiltRef.current.animate(frames.tilt, options) : null
    const shadow = shadowRef.current?.animate(frames?.shadow ?? [{ opacity: localEntry ? 0 : 1 }, { opacity: 1 }], options)
    let cancelled = false
    void travel.finished.then(() => {
      if (!cancelled) onComplete(phase === 'playing' ? 'playbackShown'
        : phase === 'settling' ? 'recordSettled' : phase === 'returning' ? 'returnToSleeve' : 'flyToPlayer')
    }).catch(() => { /* Resize, preference changes, and unmount cancel this sequence. */ })
    return () => {
      cancelled = true
      travel.cancel()
      tilt?.cancel()
      shadow?.cancel()
    }
  }, [moving, phase, path, settings.rate, fromParked, reducedMotion, onComplete])

  useLayoutEffect(() => {
    const surface = surfaceRef.current
    if (!surface || reducedMotion) return
    const running = phase === 'playing' || phase === 'spinning'
    const starting = phase === 'settling'
    const stopping = phase === 'closing'
    if (!running && !starting && !stopping) return
    const start = angleRef.current
    const rotation = surface.animate([
      { transform: `rotate(${start}deg)` },
      { transform: `rotate(${start + (running ? 360 : 22)}deg)` },
    ], {
      duration: (running ? 1800 : 220) / settings.rate,
      iterations: running ? Infinity : 1,
      easing: running ? 'linear' : starting ? 'cubic-bezier(.55, 0, 1, .45)' : 'cubic-bezier(0, .55, .45, 1)',
      fill: 'forwards',
    })
    return () => {
      // Hold the last angle across spin-up, steady playback, braking, and return.
      const matrix = new DOMMatrixReadOnly(getComputedStyle(surface).transform)
      angleRef.current = Math.atan2(matrix.b, matrix.a) * 180 / Math.PI
      surface.style.transform = `rotate(${angleRef.current}deg)`
      rotation.cancel()
    }
  }, [phase, reducedMotion, settings.rate])

  const { destination: d, deck } = path
  const engaged = phase === 'settling' || phase === 'playing' || phase === 'spinning'
  return (
    <>
      <div ref={shadowRef} className="recordShadow" aria-hidden="true" style={{
        left: d.x, top: d.y + d.size * 0.012, width: d.size, height: d.size * d.tilt,
        opacity: moving ? 0 : 1,
      }} />
      <div ref={travelRef} className={`recordTravel ${moving ? 'isMoving' : 'isLanded'}`}
        data-phase={phase} data-style={settings.style}
        style={{ transform: transform(d.x, d.y, d.size) }} aria-hidden="true">
        <div ref={tiltRef} className="recordTilt" style={{ transform: `scaleY(${d.tilt})` }}>
          <div ref={surfaceRef} className="recordSurface">
            <img className="recordTexture" src={vinylImage} alt="" draggable={false} />
            <div className="recordLabel" key={image}><img src={image} alt="" draggable={false} /></div>
            <div className="recordHole" />
          </div>
          <div className="recordSheen" />
        </div>
      </div>
      <div className="tonearmOverlay" aria-hidden="true" style={{
        left: deck.x, top: deck.y, width: deck.width, height: deck.height,
      }}>
        <Tonearm engaged={engaged} rate={settings.rate} tilt={d.tilt} />
      </div>
    </>
  )
}
