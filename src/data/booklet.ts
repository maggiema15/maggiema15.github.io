import { portfolioSections, type SectionId } from './portfolio'

// Presentation copy and sample entries only. Replace these with real content;
// the examples do not assert experience, skills, or a personal album ranking.
export const bookletNotes = {
  about: { intro: 'A little about the person behind the collection.', heading: 'The liner notes', detail: 'A short introduction', footnote: 'Behind the music' },
  projects: { intro: 'A few things made along the way.', heading: 'The tracklist', detail: '01 — 03', footnote: 'Ideas in rotation' },
  experience: { intro: 'Places, people, and things learned along the way.', heading: 'The chronology', detail: 'An evolving story', footnote: 'One chapter at a time' },
  skills: { intro: 'The tools and techniques behind the work.', heading: 'The repertoire', detail: 'A growing collection', footnote: 'Always learning' },
  albums: { intro: 'For the first listen, and every listen after.', heading: 'In heavy rotation', detail: 'Sample sequence', footnote: 'Keep the needle down' },
} satisfies Record<SectionId, { intro: string; heading: string; detail: string; footnote: string }>

export const projectTracks = [
  { title: 'Software & systems', category: 'Code / build / explore', description: 'A space for a project, the idea behind it, and a few things learned along the way.' },
  { title: 'Hardware & experiments', category: 'Circuit / prototype / test', description: 'A space for something hands-on, from the first sketch to the working prototype.' },
  { title: 'Creative work', category: 'Imagine / make / refine', description: 'A space for a small experiment, a curious detour, or something made just for fun.' },
]

export const aboutNotes = [
  { title: 'Education', description: 'A space for studies, favorite subjects, and what comes next.' },
  { title: 'Home base', description: 'A space for location and the places that feel like home.' },
  { title: 'Current focus', description: 'A space for interests, ambitions, and the next thing to explore.' },
]

// Listed newest first; replace the relative labels with actual date ranges.
export const experienceEntries = [
  { period: 'Most recent', title: 'Work & practice', category: 'Role / organization', description: 'A space for a recent role, the work involved, and what it taught me.' },
  { period: 'Previously', title: 'Community & collaboration', category: 'Team / organization', description: 'A space for volunteering, shared projects, and contributing to a community.' },
  { period: 'Earlier', title: 'Leadership & initiative', category: 'Role / organization', description: 'A space for taking the lead, bringing people together, and learning by doing.' },
]

export const skillGroups = [
  { title: 'Programming', items: ['Languages', 'Frameworks', 'Software development'] },
  { title: 'Tools & workflow', items: ['Development tools', 'Version control', 'Testing & documentation'] },
  { title: 'Hardware', items: ['Circuits', 'Embedded systems', 'Prototyping'] },
  { title: 'Working together', items: ['Communication', 'Collaboration', 'Problem-solving'] },
]

// Reuse existing sleeves as visual placeholders, not a claimed top-five list.
export const albumSamples = portfolioSections.map(section => ({ image: section.image }))
