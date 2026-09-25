import { portfolioSections, type ContentBlock, type PortfolioSection } from '../data/portfolio'
import { albumSamples, bookletNotes } from '../data/booklet'

const number = (value: number) => String(value).padStart(2, '0')

// A heading starts a new printed entry; all following blocks stay in their source order.
function splitEntries(blocks: readonly ContentBlock[]): ContentBlock[][] {
  const entries: ContentBlock[][] = []
  let current: ContentBlock[] = []
  for (const block of blocks) {
    if (block.type === 'heading' && current.length) {
      entries.push(current)
      current = []
    }
    current.push(block)
  }
  if (current.length) entries.push(current)
  return entries
}

function EntryBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        switch (block.type) {
          case 'heading':
            return <h2 key={index}>{block.text}</h2>
          case 'meta':
            return <p key={index} className="entryMeta">{block.text}</p>
          case 'paragraph':
            return <p key={index} className="entryDescription">{block.text}</p>
          case 'list':
            return (
              <ul key={index} className="entryList">
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )
        }
      })}
    </>
  )
}

function SectionContent({ section }: { section: PortfolioSection }) {
  if (section.id === 'albums') {
    return (
      <div className="albumCollectionNotes">
        <p className="sectionNote">{typeof section.description === 'string' ? section.description : 'A personal ranking of favorite albums will appear here.'}</p>
        <p className="sampleNote">Sample sleeves below; the final ranking is still to come.</p>
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

  if (typeof section.description === 'string') {
    return <p className="entryDescription">{section.description}</p>
  }

  const entries = splitEntries(section.description)
  if (section.id === 'about') {
    return (
      <div className="aboutNotes">
        <section className="aboutIntroduction">
          <p className="printLabel">An introduction</p>
          <h2>A little background.</h2>
          <EntryBlocks blocks={section.description} />
        </section>
      </div>
    )
  }
  if (section.id === 'projects') {
    return (
      <ol className="projectTracks">
        {entries.map((entry, index) => (
          <li key={index}>
            <span className="trackNumber" aria-hidden="true">{number(index + 1)}</span>
            <div><EntryBlocks blocks={entry} /></div>
          </li>
        ))}
      </ol>
    )
  }
  if (section.id === 'experience') {
    return (
      <ol className="experienceTimeline">
        {entries.map((entry, index) => (
          <li key={index}><EntryBlocks blocks={entry} /></li>
        ))}
      </ol>
    )
  }
  return (
    <div className="skillsContent">
      <div className="skillGroups">
        {entries.map((entry, index) => (
          <section key={index}>
            <span className="printLabel">Side {number(index + 1)}</span>
            <EntryBlocks blocks={entry} />
          </section>
        ))}
      </div>
    </div>
  )
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
        <SectionContent section={section} />
        <footer className="bookletColophon"><span>{section.id === 'albums' ? 'A collection in progress' : 'Selected work and notes'}</span><span>MM — 0{volume}</span></footer>
      </div>
    </div>
  )
}
