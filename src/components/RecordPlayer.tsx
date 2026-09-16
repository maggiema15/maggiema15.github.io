import type { Ref } from 'react'
import tableImage from '../assests/clean/table-v2-tight.png'

export function RecordPlayer({ targetRef }: { targetRef: Ref<HTMLDivElement> }) {
  return (
    <section className="playerArea" aria-label="Record player">
      <img
        className="tableImage"
        src={tableImage}
        alt="Record player on a wooden cabinet filled with albums"
      />
      <div ref={targetRef} className="playerTarget" aria-hidden="true" />
    </section>
  )
}
