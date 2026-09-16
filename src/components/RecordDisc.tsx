import type { CSSProperties } from 'react'
import type { PlaybackPhase, RecordPath } from '../hooks/useRecordPlayback'

type RecordStyle = CSSProperties & { [key: `--${string}`]: string }
type Props = {
  image: string
  phase: PlaybackPhase
  path: RecordPath
  onComplete: (name: string) => void
}

export function RecordDisc({ image, phase, path, onComplete }: Props) {
  const moving = phase === 'lifting' || phase === 'flying' || phase === 'returning'
  const style: RecordStyle = {
    '--start-x': `${path.source.x}px`,
    '--start-y': `${path.source.y}px`,
    '--start-size': `${path.source.size}px`,
    '--mid-x': `${path.middle.x}px`,
    '--mid-y': `${path.middle.y}px`,
    '--mid-size': `${path.middle.size}px`,
    '--end-x': `${path.destination.x}px`,
    '--end-y': `${path.destination.y}px`,
    '--end-size': `${path.destination.size}px`,
  }

  return (
    <div
      className={moving ? `animatedRecord ${phase}` : 'playerRecord'}
      style={style}
      aria-hidden="true"
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onComplete(event.animationName)
      }}
    >
      <div className="recordGrooves" />
      <div className="recordLabel">
        <img src={image} alt="" />
      </div>
      <div className="recordHole" />
    </div>
  )
}
