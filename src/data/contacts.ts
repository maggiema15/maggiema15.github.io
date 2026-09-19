import githubImage from '../assests/Github vinyl.png'
import emailImage from '../assests/Email Vinyl.png'
import linkedinImage from '../assests/LinkedIn vinyl.png'
import resumeImage from '../assests/Resume Vinyl.png'
import githubLogo from '../assests/Logos/github.svg'
import emailLogo from '../assests/Logos/email.svg'
import linkedinLogo from '../assests/Logos/linkedin.svg'
import resumeLogo from '../assests/Logos/resume.svg'

type Contact = {
  id: string
  label: string
  image: string
  logo: string
} & (
  | { href: string; external?: boolean; unavailable?: never }
  | { href?: never; external?: never; unavailable: string }
)

export const contacts: readonly Contact[] = [
  {
    id: 'github',
    label: 'GitHub',
    image: githubImage,
    logo: githubLogo,
    href: 'https://github.com/maggiema15',
    external: true,
  },
  {
    id: 'email',
    label: 'Email Jinwen Ma',
    image: emailImage,
    logo: emailLogo,
    href: 'mailto:jinwenma15@gmail.com',
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    image: linkedinImage,
    logo: linkedinLogo,
    href: 'https://www.linkedin.com/in/jinwen-ma/',
    external: true,
  },
  {
    id: 'resume',
    label: 'Resume',
    image: resumeImage,
    logo: resumeLogo,
    href: '/resume.pdf',
    external: true,
  },
]
