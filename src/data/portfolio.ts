import aboutImage from '../assests/Abbey Road.png'
import projectsImage from '../assests/The Dark Side of the Moon.png'
import experienceImage from '../assests/In Utero.png'
import skillsImage from '../assests/Weezer.png'
import albumsImage from '../assests/Currents.png'

export type SectionId = 'about' | 'projects' | 'experience' | 'skills' | 'albums'

export type PortfolioSection = {
  id: SectionId
  title: string
  image: string
  description: string
}

// Content and reading order only. Room placement belongs in room-layout.css.
export const portfolioSections: readonly PortfolioSection[] = [
  {
    id: 'about',
    title: 'About Me',
    image: aboutImage,
    description: 'Introduction, education, location, and current career goals.',
  },
  {
    id: 'projects',
    title: 'Projects',
    image: projectsImage,
    description: 'Software, hardware, and creative projects will appear here.',
  },
  {
    id: 'experience',
    title: 'Experiences',
    image: experienceImage,
    description: 'Work, volunteer, and leadership experience will appear here.',
  },
  {
    id: 'skills',
    title: 'Skills',
    image: skillsImage,
    description: 'Programming, tools, hardware, and professional skills will appear here.',
  },
  {
    id: 'albums',
    title: 'Top 100 Albums',
    image: albumsImage,
    description: 'A personal ranking of favorite albums will appear here.',
  },
]
