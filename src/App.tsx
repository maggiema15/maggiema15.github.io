import { lazy, Suspense, useState } from 'react'
import type { CSSProperties } from 'react'
import { readMotionSettings, saveMotionSettings } from './data/recordPlayer'
import type { MotionSettings } from './data/recordPlayer'
import { AlbumCollection } from './components/AlbumCollection'
import { PortfolioDialog } from './components/PortfolioDialog'
import { PosterWall } from './components/PosterWall'
import { RecordDisc } from './components/RecordDisc'
import { RecordPlayer } from './components/RecordPlayer'
import { RoomDecor } from './components/RoomDecor'
import { useRecordPlayback } from './hooks/useRecordPlayback'
import { useMotionPreference } from './hooks/useMotionPreference'
import './styles/room-appearance.css'
import './styles/room-layout.css'
import './styles/record.css'
import './styles/dialog.css'

const MotionDevPanel = import.meta.env.DEV ? lazy(() => import('./components/MotionDevPanel')) : null

function App() {
  const { reducedMotion, toggleMotion, followsSystem } = useMotionPreference()
  const [settings, setSettings] = useState(readMotionSettings)
  const { state, playerTargetRef, select, close, completeAnimation, reset, replay, canReplay } = useRecordPlayback(reducedMotion, settings)
  const active = state.phase === 'idle' ? null : state
  const busy = state.phase !== 'idle' && state.phase !== 'parked'
  const changeSettings = (next: MotionSettings) => {
    reset()
    setSettings(next)
    saveMotionSettings(next)
  }
  const overlayOpen = state.phase === 'spinning' || state.phase === 'closing'

  return (
    <main className="room" data-reduced-motion={reducedMotion}
      style={{ '--record-close-duration': `${240 / settings.rate}ms` } as CSSProperties}>
      <div className="roomAmbientFill" aria-hidden="true" />
      <div className="sceneCanvas">
        <RoomDecor />
        <PosterWall inert={overlayOpen} />
        <AlbumCollection
          selectedId={busy ? active?.section.id : undefined}
          busy={busy}
          inert={overlayOpen}
          onSelect={select}
        />
        <RecordPlayer targetRef={playerTargetRef} active={active !== null} />
      </div>
      {!busy && (
        <button
          type="button"
          className="motionControl"
          aria-label="Record animation"
          aria-pressed={!reducedMotion}
          onClick={toggleMotion}
          title={followsSystem && reducedMotion
            ? 'Your device requests reduced motion. Enable record animation for this site.'
            : 'Turn the vinyl animation on or off'}
        >
          <span className="motionIndicator" aria-hidden="true" />
          Record animation: {reducedMotion ? 'Off' : 'On'}
        </button>
      )}
      {active && (
        <RecordDisc
          image={active.section.image}
          phase={active.phase}
          path={active.path}
          settings={active.settings}
          fromParked={active.fromParked}
          reducedMotion={reducedMotion}
          onComplete={completeAnimation}
        />
      )}
      {MotionDevPanel && <Suspense fallback={null}>
        <MotionDevPanel settings={settings} onChange={changeSettings} onReplay={replay}
          canReplay={canReplay} busy={busy} inert={overlayOpen} reducedMotion={reducedMotion} />
      </Suspense>}
      {active && overlayOpen && (
        <PortfolioDialog
          section={active.section}
          closing={active.phase === 'closing'}
          onClose={close}
          onComplete={completeAnimation}
        />
      )}
    </main>
  )
}

export default App
