import { AlbumCollection } from './components/AlbumCollection'
import { PortfolioDialog } from './components/PortfolioDialog'
import { PosterWall } from './components/PosterWall'
import { RecordDisc } from './components/RecordDisc'
import { RecordPlayer } from './components/RecordPlayer'
import { RoomDecor } from './components/RoomDecor'
import { useRecordPlayback } from './hooks/useRecordPlayback'
import './styles/room-appearance.css'
import './styles/room-layout.css'
import './styles/record.css'
import './styles/dialog.css'

function App() {
  const { state, playerTargetRef, select, close, completeAnimation } = useRecordPlayback()
  const active = state.phase === 'idle' ? null : state
  const overlayOpen = state.phase === 'spinning' || state.phase === 'closing'

  return (
    <main className="room">
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
