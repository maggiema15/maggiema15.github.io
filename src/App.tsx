import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import './App.css'
import posterImage from './assests/Name Poster.png'
import posterLightImage from './assests/Light on top.png'
import githubVinylImage from './assests/Github vinyl.png'
import emailVinylImage from './assests/Email Vinyl.png'
import linkedinVinylImage from './assests/LinkedIn vinyl.png'
import resumeVinylImage from './assests/Resume Vinyl.png'
import githubLogo from './assests/Logos/github.svg'
import emailLogo from './assests/Logos/email.svg'
import linkedinLogo from './assests/Logos/linkedin.svg'
import resumeLogo from './assests/Logos/resume.svg'
import guitarImage from './assests/guitar.png'
import wallPlantImage from './assests/wall plant.png'
import potPlantImage from './assests/pot plant.png'
import vinylOne from './assests/Abbey Road.png'
import vinylTwo from './assests/The Dark Side of the Moon.png'
import vinylThree from './assests/In Utero.png'
import vinylFour from './assests/Weezer.png'
import vinylFive from './assests/Currents.png'
import topRackImage from './assests/top rack.png'
import bottomRackImage from './assests/bottom rack.png'
import windowImage from './assests/window v3.png'
import tableImage from './assests/table v2.png'
import roomBackdropImage from './assests/wall & borderline.png'

type SectionId = 'about' | 'projects' | 'experience' | 'skills' | 'albums'

type VinylSection = {
  id: SectionId
  title: string
  image: string
  description: string
  placement: 'upper' | 'lower'
  position: number
}

type AnimationPhase =
  | 'idle'
  | 'lifting'
  | 'flying'
  | 'spinning'
  | 'closing'
  | 'returning'

type RecordPosition = {
  x: number
  y: number
  size: number
}

type RecordPath = {
  source: RecordPosition
  middle: RecordPosition
  destination: RecordPosition
}

type RecordStyle = CSSProperties & {
  '--start-x': string
  '--start-y': string
  '--start-size': string
  '--mid-x': string
  '--mid-y': string
  '--mid-size': string
  '--end-x': string
  '--end-y': string
  '--end-size': string
}

const vinylSections: VinylSection[] = [
  {
    id: 'about',
    title: 'About Me',
    image: vinylOne,
    description: 'Introduction, education, location, and current career goals.',
    placement: 'upper',
    position: 1,
  },
  {
    id: 'projects',
    title: 'Projects',
    image: vinylTwo,
    description: 'Software, hardware, and creative projects will appear here.',
    placement: 'upper',
    position: 2,
  },
  {
    id: 'experience',
    title: 'Experiences',
    image: vinylThree,
    description: 'Work, volunteer, and leadership experience will appear here.',
    placement: 'upper',
    position: 3,
  },
  {
    id: 'skills',
    title: 'Skills',
    image: vinylFour,
    description:
      'Programming, tools, hardware, and professional skills will appear here.',
    placement: 'lower',
    position: 1,
  },
  {
    id: 'albums',
    title: 'Top 100 Albums',
    image: vinylFive,
    description: 'A personal ranking of favorite albums will appear here.',
    placement: 'lower',
    position: 2,
  },
]

function RecordDisc({
  className,
  image,
  style,
}: {
  className: string
  image: string
  style?: CSSProperties
}) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <div className="recordGrooves" />
      <div className="recordLabel">
        <img src={image} alt="" />
      </div>
      <div className="recordHole" />
    </div>
  )
}

function App() {
  const [selectedSection, setSelectedSection] = useState<VinylSection | null>(
    null,
  )
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('idle')
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [recordPath, setRecordPath] = useState<RecordPath | null>(null)
  const playerTargetRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement | null>(null)
  const timersRef = useRef<number[]>([])

  const schedule = useCallback((callback: () => void, delay: number) => {
    const timer = window.setTimeout(callback, delay)
    timersRef.current.push(timer)
  }, [])

  const getPlayerPosition = useCallback((): RecordPosition | null => {
    const target = playerTargetRef.current

    if (!target) {
      return null
    }

    const rect = target.getBoundingClientRect()

    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: rect.width,
    }
  }, [])

  const handleVinylSelect = (
    section: VinylSection,
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    if (animationPhase !== 'idle') {
      return
    }

    const destination = getPlayerPosition()

    if (!destination) {
      return
    }

    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const source: RecordPosition = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      size: Math.min(rect.width, rect.height) * 0.8,
    }
    const middle: RecordPosition = {
      x: (source.x + destination.x) / 2 + (destination.y - source.y) * 0.08,
      y: Math.min(source.y, destination.y) - window.innerHeight * 0.08,
      size: source.size + (destination.size - source.size) * 0.56,
    }
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const liftingDuration = reducedMotion ? 90 : 290
    const flyingDuration = reducedMotion ? 160 : 880

    activeButtonRef.current = button
    setSelectedSection(section)
    setRecordPath({ source, middle, destination })
    setAnimationPhase('lifting')

    schedule(() => setAnimationPhase('flying'), liftingDuration)
    schedule(() => {
      setAnimationPhase('spinning')
      setOverlayOpen(true)
    }, liftingDuration + flyingDuration)
  }

  const completeReturn = useCallback(() => {
    setSelectedSection(null)
    setRecordPath(null)
    setAnimationPhase('idle')
    window.requestAnimationFrame(() => activeButtonRef.current?.focus())
  }, [])

  const handleClose = useCallback(() => {
    if (animationPhase !== 'spinning') {
      return
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const returnDuration = reducedMotion ? 150 : 700

    setAnimationPhase('closing')
    schedule(() => {
      setOverlayOpen(false)
      setAnimationPhase('returning')
      schedule(completeReturn, returnDuration)
    }, 240)
  }, [animationPhase, completeReturn, schedule])

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    if (overlayOpen && animationPhase === 'spinning') {
      closeButtonRef.current?.focus()
    }
  }, [animationPhase, overlayOpen])

  useEffect(() => {
    if (!overlayOpen) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
        return
      }

      if (event.key !== 'Tab') {
        return
      }

      const overlay = overlayRef.current

      if (!overlay) {
        return
      }

      const focusableElements = Array.from(
        overlay.querySelectorAll<HTMLElement>(
          'a[href], button:not(:disabled), [tabindex]:not([tabindex="-1"])',
        ),
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        overlay.focus()
        return
      }

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleClose, overlayOpen])

  useEffect(() => {
    if (animationPhase !== 'spinning' && animationPhase !== 'closing') {
      return
    }

    const updatePlayerRecord = () => {
      const destination = getPlayerPosition()

      if (!destination) {
        return
      }

      setRecordPath((currentPath) =>
        currentPath
          ? {
              ...currentPath,
              destination,
            }
          : currentPath,
      )
    }

    window.addEventListener('resize', updatePlayerRecord)

    return () => window.removeEventListener('resize', updatePlayerRecord)
  }, [animationPhase, getPlayerPosition])

  const recordStyle: RecordStyle | undefined = recordPath
    ? {
        '--start-x': `${recordPath.source.x}px`,
        '--start-y': `${recordPath.source.y}px`,
        '--start-size': `${recordPath.source.size}px`,
        '--mid-x': `${recordPath.middle.x}px`,
        '--mid-y': `${recordPath.middle.y}px`,
        '--mid-size': `${recordPath.middle.size}px`,
        '--end-x': `${recordPath.destination.x}px`,
        '--end-y': `${recordPath.destination.y}px`,
        '--end-size': `${recordPath.destination.size}px`,
      }
    : undefined

  const isAnimatingRecord =
    animationPhase === 'lifting' ||
    animationPhase === 'flying' ||
    animationPhase === 'returning'
  const isPlayerRecordVisible =
    animationPhase === 'spinning' || animationPhase === 'closing'

  return (
    <main className="room">
      <img
        className="roomBackdrop"
        src={roomBackdropImage}
        alt=""
        aria-hidden="true"
      />

      <img className="wallPlant" src={wallPlantImage} alt="" aria-hidden="true" />
      <img className="potPlant" src={potPlantImage} alt="" aria-hidden="true" />

      <div className="guitarMount" aria-hidden="true">
        <img className="guitarImage" src={guitarImage} alt="" />
      </div>

      <section
        className="posterWall"
        aria-label="About poster and contact links"
        inert={overlayOpen}
      >
        <div className="namePosterDisplay">
          <div className="posterLight" aria-hidden="true">
            <img src={posterLightImage} alt="" />
          </div>
          <div className="framedPoster namePosterFrame">
            <img
              className="poster namePoster"
              src={posterImage}
              alt="Maggie Ma computer engineering student poster"
            />
          </div>
        </div>
        <nav className="contactVinyls" aria-label="Contact links">
          <a
            className="contactVinyl"
            href="https://github.com/maggiema15"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <img className="contactVinylImage" src={githubVinylImage} alt="" />
            <img className="contactVinylLogo" src={githubLogo} alt="" />
          </a>
          <a
            className="contactVinyl"
            href="mailto:jinwenma15@gmail.com"
            aria-label="Email Jinwen Ma"
          >
            <img className="contactVinylImage" src={emailVinylImage} alt="" />
            <img className="contactVinylLogo" src={emailLogo} alt="" />
          </a>
          <a
            className="contactVinyl"
            href="https://www.linkedin.com/in/jinwen-ma/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <img className="contactVinylImage" src={linkedinVinylImage} alt="" />
            <img className="contactVinylLogo" src={linkedinLogo} alt="" />
          </a>
          <a
            className="contactVinyl"
            aria-label="Resume link not yet available"
            aria-disabled="true"
          >
            <img className="contactVinylImage" src={resumeVinylImage} alt="" />
            <img className="contactVinylLogo" src={resumeLogo} alt="" />
          </a>
        </nav>
      </section>

      <img
        className="windowImage"
        src={windowImage}
        alt="Vintage window mounted on the wall"
      />

      <section
        className="rackArea"
        aria-label="Vinyl portfolio collection"
        inert={overlayOpen}
      >
        <img
          className="rackImage topRackImage"
          src={topRackImage}
          alt=""
          aria-hidden="true"
        />
        <img
          className="rackImage bottomRackImage"
          src={bottomRackImage}
          alt=""
          aria-hidden="true"
        />
        {vinylSections.map((section) => (
          <button
            key={section.id}
            type="button"
            className={`vinylCover ${section.placement} cover${section.position} ${
              selectedSection?.id === section.id ? 'isSelected' : ''
            }`}
            aria-label={`Open ${section.title}`}
            title={`Open ${section.title}`}
            aria-pressed={selectedSection?.id === section.id}
            disabled={animationPhase !== 'idle'}
            onClick={(event) => handleVinylSelect(section, event)}
          >
            <img src={section.image} alt="" />
            <span className="vinylTitle">{section.title}</span>
          </button>
        ))}
        <img
          className="rackImage rackLip topRackImage"
          src={topRackImage}
          alt=""
          aria-hidden="true"
        />
        <img
          className="rackImage rackLip bottomRackImage"
          src={bottomRackImage}
          alt=""
          aria-hidden="true"
        />
      </section>

      <section className="playerArea" aria-label="Record player">
        <img
          className="tableImage"
          src={tableImage}
          alt="Wooden table with two drawers"
        />
        <div ref={playerTargetRef} className="playerTarget" aria-hidden="true" />
      </section>

      {selectedSection && recordPath && isAnimatingRecord && (
        <RecordDisc
          className={`animatedRecord ${animationPhase}`}
          image={selectedSection.image}
          style={recordStyle}
        />
      )}

      {selectedSection && recordPath && isPlayerRecordVisible && (
        <RecordDisc
          className="playerRecord"
          image={selectedSection.image}
          style={{
            left: `${recordPath.destination.x}px`,
            top: `${recordPath.destination.y}px`,
            width: `${recordPath.destination.size}px`,
          }}
        />
      )}

      {overlayOpen && selectedSection && (
        <section
          ref={overlayRef}
          className={`portfolioOverlay ${
            animationPhase === 'closing' ? 'isClosing' : ''
          }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="portfolio-overlay-title"
          tabIndex={-1}
        >
          <button
            ref={closeButtonRef}
            type="button"
            className="closeButton"
            aria-label="Close portfolio section"
            disabled={animationPhase !== 'spinning'}
            onClick={handleClose}
          >
            ×
          </button>
          <p className="overlayEyebrow">Now playing</p>
          <h1 id="portfolio-overlay-title">{selectedSection.title}</h1>
          <p>{selectedSection.description}</p>
          <p className="comingSoon">Content coming soon.</p>
        </section>
      )}
    </main>
  )
}

export default App
