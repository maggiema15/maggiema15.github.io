import topRackImage from '../assests/clean/top-rack-tight.png'
import bottomRackImage from '../assests/clean/bottom-rack-tight.png'
import {
  portfolioSections,
  type PortfolioSection,
  type SectionId,
} from '../data/portfolio'

type Props = {
  selectedId?: SectionId
  busy: boolean
  inert: boolean
  onSelect: (section: PortfolioSection, button: HTMLButtonElement) => void
}

const shelves: { id: string; image: string; sections: SectionId[] }[] = [
  { id: 'upper', image: topRackImage, sections: ['about', 'projects', 'experience'] },
  { id: 'lower', image: bottomRackImage, sections: ['skills', 'albums'] },
]

export function AlbumCollection({ selectedId, busy, inert, onSelect }: Props) {
  return (
    <section className="rackArea" aria-label="Vinyl portfolio collection" inert={inert}>
      {shelves.map((shelf) => (
        <div key={shelf.id} className={`albumShelf ${shelf.id}Shelf`}>
          <img className="rackImage" src={shelf.image} alt="" aria-hidden="true" />
          {portfolioSections.filter((section) => shelf.sections.includes(section.id)).map((section) => (
            <button
              key={section.id}
              type="button"
              data-section={section.id}
              className={`vinylCover${selectedId === section.id ? ' isSelected' : ''}`}
              aria-label={`Open ${section.title}`}
              title={`Open ${section.title}`}
              aria-haspopup="dialog"
              aria-pressed={selectedId === section.id}
              disabled={busy}
              onClick={(event) => onSelect(section, event.currentTarget)}
            >
              <img src={section.image} alt="" />
              <span className="vinylTitle">{section.title}</span>
            </button>
          ))}
          <img className="rackImage rackLip" src={shelf.image} alt="" aria-hidden="true" />
        </div>
      ))}
    </section>
  )
}
