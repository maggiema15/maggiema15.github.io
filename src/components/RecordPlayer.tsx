import type { Ref } from 'react'
import vinylImage from '../assests/player/vinyl-v2.png'
import tableImage from '../assests/clean/table-v2-tight.png'
import cabinetTop from '../assests/player/cabinet-top-v2.png'
import turntableImage from '../assests/player/turntable-v2.png'
import { playerGeometry as geometry } from '../data/recordPlayer'
import { Tonearm } from './Tonearm'

export function RecordPlayer({ targetRef, active }: { targetRef: Ref<HTMLDivElement>; active: boolean }) {
  return (
    <section className="playerArea" aria-label="Record player on a wooden cabinet filled with albums">
      <link rel="preload" as="image" href={vinylImage} />
      <div className="cabinetArtwork" aria-hidden="true">
        <img className="tableImage" src={tableImage} alt="" draggable={false} />
        <img className="cabinetTop" src={cabinetTop} alt="" draggable={false} />
      </div>
      <div className="turntableStage" aria-hidden="true">
        <img className="turntableImage" src={turntableImage} alt="" draggable={false} />
        <div ref={targetRef} className="playerTarget" style={{
          left: `${geometry.platterX}%`, top: `${geometry.platterY}%`,
          width: `${geometry.platterWidth}%`, height: `${geometry.platterHeight}%`,
        }} />
        {!active && <Tonearm />}
      </div>
    </section>
  )
}
