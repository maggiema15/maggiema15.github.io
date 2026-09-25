import { portfolioSections, type SectionId } from './portfolio'

// Booklet framing and illustrative album sleeves. Portfolio copy lives in portfolio.ts.
export const bookletNotes = {
  about: { intro: 'A little about the person behind the collection.', heading: 'The liner notes', detail: 'A short introduction', footnote: 'Behind the music' },
  projects: { intro: 'A few things made along the way.', heading: 'The tracklist', detail: '01 — 03', footnote: 'Ideas in rotation' },
  experience: { intro: 'Places, people, and things learned along the way.', heading: 'The chronology', detail: 'An evolving story', footnote: 'One chapter at a time' },
  skills: { intro: 'The tools and techniques behind the work.', heading: 'The repertoire', detail: 'A growing collection', footnote: 'Always learning' },
  albums: { intro: 'For the first listen, and every listen after.', heading: 'In heavy rotation', detail: 'Sample sequence', footnote: 'Keep the needle down' },
} satisfies Record<SectionId, { intro: string; heading: string; detail: string; footnote: string }>

// Reuse existing sleeves as visual placeholders, not a claimed top-five list.
export const albumSamples = portfolioSections.map(section => ({ image: section.image }))
