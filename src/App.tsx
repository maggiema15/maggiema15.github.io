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

function App() {
  const { reducedMotion, toggleMotion, followsSystem } = useMotionPreference()
  const { state, playerTargetRef, select, close, completeAnimation } = useRecordPlayback(reducedMotion)
  const active = state.phase === 'idle' ? null : state
  const overlayOpen = state.phase === 'spinning' || state.phase === 'closing'

  return (
    <main className="room" data-reduced-motion={reducedMotion}>
      <div className="roomAmbientFill" aria-hidden="true" />
      <div className="sceneCanvas">
        <RoomDecor />
        <PosterWall inert={overlayOpen} />
        <AlbumCollection
          selectedId={active?.section.id}
          busy={active !== null}
          inert={overlayOpen}
          onSelect={select}
        />
        <RecordPlayer targetRef={playerTargetRef} />
      </div>
      {!active && (
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
          onComplete={completeAnimation}
        />
      )}
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
