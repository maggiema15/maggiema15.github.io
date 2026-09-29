import type { ContentBlock, PortfolioSection } from '../data/portfolio'

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

function SkillGroups({ entries }: { entries: readonly (readonly ContentBlock[])[] }) {
  return (
    <div className="skillGroups">
      {entries.map((entry, index) => {
        const heading = entry.find((block) => block.type === 'heading')
        const skills = entry.flatMap((block) =>
          block.type === 'meta'
            ? block.text.split('|').map((skill) => skill.trim()).filter(Boolean)
            : [])

        return (
          <section key={heading?.type === 'heading' ? heading.text : index}>
            {heading?.type === 'heading' && <h2>{heading.text}</h2>}
            <ul className="skillTags" aria-label={heading?.type === 'heading' ? heading.text : undefined}>
              {skills.map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

function SectionContent({ section }: { section: PortfolioSection }) {
  if (section.id === 'albums') {
    return (
      <div className="albumCollectionNotes">
        <p className="sectionNote">{typeof section.description === 'string' ? section.description : 'Ranking coming soon.'}</p>
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
      <SkillGroups entries={entries} />
    </div>
  )
}

export function PortfolioBooklet({ section, titleId }: { section: PortfolioSection; titleId: string }) {
  return (
    <div className="bookletSpread" data-booklet-section={section.id}>
      <header className="bookletIdentity">
        <div className="bookletCover">
          <img src={section.image} alt="" />
        </div>
        <div className="bookletHeading">
          <h1 id={titleId}>{section.title}<span aria-hidden="true">.</span></h1>
          <p className="bookletIntro">{section.subtitle}</p>
        </div>
      </header>
      <div className="bookletNotes">
        <SectionContent section={section} />
      </div>
    </div>
  )
}
