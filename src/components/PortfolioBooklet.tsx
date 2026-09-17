import { portfolioSections, type PortfolioSection, type SectionId } from '../data/portfolio'
import { aboutNotes, albumSamples, bookletNotes, experienceEntries, projectTracks, skillGroups } from '../data/booklet'

const number = (value: number) => String(value).padStart(2, '0')

function SectionContent({ id }: { id: SectionId }) {
  switch (id) {
    case 'about':
      return (
        <div className="aboutNotes">
          <section className="aboutIntroduction">
            <p className="printLabel">An introduction</p>
            <h2>A little background.</h2>
            <p>A space for a personal introduction, a few interests, and the story behind this collection.</p>
          </section>
          <dl className="biographyNotes">
            {aboutNotes.map(note => (
              <div key={note.title}><dt>{note.title}</dt><dd>{note.description}</dd></div>
            ))}
          </dl>
        </div>
      )
    case 'projects':
      return (
        <ol className="projectTracks">
          {projectTracks.map((track, index) => (
            <li key={track.title}>
              <span className="trackNumber" aria-hidden="true">{number(index + 1)}</span>
              <div>
                <p className="trackCategory">{track.category}</p>
                <h2>{track.title}</h2>
                <p className="entryDescription">{track.description}</p>
                <span className="entryFootnote">Notes to come</span>
              </div>
            </li>
          ))}
        </ol>
      )
    case 'experience':
      return (
        <ol className="experienceTimeline">
          {experienceEntries.map(entry => (
            <li key={entry.period}>
              <p className="printLabel timelinePeriod">{entry.period}</p>
              <h2>{entry.title}</h2>
              <p className="trackCategory">{entry.category}</p>
              <p className="entryDescription">{entry.description}</p>
            </li>
          ))}
        </ol>
      )
    case 'skills':
      return (
        <div className="skillsContent">
          <p className="sectionNote">A place for skills and tools. Sample categories below; details to come.</p>
          <div className="skillGroups">
            {skillGroups.map((group, index) => (
              <section key={group.title}>
                <span className="printLabel">Side {number(index + 1)}</span>
                <h2>{group.title}</h2>
                <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </section>
            ))}
          </div>
        </div>
      )
    case 'albums':
      return (
        <div className="albumCollectionNotes">
          <p className="sectionNote">A hundred records, eventually. Sample sleeves below; the final ranking is still to come.</p>
          <ol className="rankedAlbums">
            {albumSamples.map((album, index) => (
              <li key={album.image}>
                <div className="rankedAlbumArtwork">
                  <img src={album.image} alt="" loading="lazy" />
                  <span className="albumRank" aria-hidden="true">{number(index + 1)}</span>
                </div>
                <h2>Album title</h2>
                <p>Artist · notes to come</p>
              </li>
            ))}
          </ol>
        </div>
      )
  }
}

export function PortfolioBooklet({ section, titleId }: { section: PortfolioSection; titleId: string }) {
  const notes = bookletNotes[section.id]
  const volume = number(portfolioSections.findIndex(item => item.id === section.id) + 1)
  return (
    <div className="bookletSpread" data-booklet-section={section.id}>
      <header className="bookletIdentity">
        <div className="pressingMeta"><span>Maggie Ma · Selected notes</span><span>Vol. {volume}</span></div>
        <div className="bookletCover">
          <img src={section.image} alt="" />
          <span className="coverCaption">From the collection</span>
        </div>
        <div className="bookletHeading">
          <p className="printLabel nowPlaying"><span aria-hidden="true" />Now playing / Side A</p>
          <h1 id={titleId}>{section.title}<span aria-hidden="true">.</span></h1>
          <p className="bookletIntro">{notes.intro}</p>
        </div>
        <div className="identityFootnote"><span>{notes.footnote}</span><span>33⅓ RPM</span></div>
      </header>
      <div className="bookletNotes">
        <div className="notesPageHeading"><span className="printLabel">{notes.heading}</span><span>{notes.detail}</span></div>
        <SectionContent id={section.id} />
        <footer className="bookletColophon"><span>A collection in progress</span><span>MM — 0{volume}</span></footer>
      </div>
    </div>
  )
}
