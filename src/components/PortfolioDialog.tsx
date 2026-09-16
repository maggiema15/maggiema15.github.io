import { useEffect, useId, useRef } from 'react'
import type { PortfolioSection } from '../data/portfolio'

type Props = {
  section: PortfolioSection
  closing: boolean
  onClose: () => void
  onComplete: (name: string) => void
}

const focusableSelector = [
  'a[href]',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]',
].join(',')

export function PortfolioDialog({ section, closing, onClose, onComplete }: Props) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const dialog = dialogRef.current
      const elements = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
        .filter((element) =>
          element.tabIndex >= 0
          && !element.matches(':disabled')
          && !element.closest('[inert]')
          && element.getClientRects().length > 0
          && getComputedStyle(element).visibility === 'visible',
        )
      const first = elements[0]
      const last = elements.at(-1)
      if (!first || !last) {
        event.preventDefault()
        dialog.focus({ preventScroll: true })
      } else if (!elements.includes(document.activeElement as HTMLElement)) {
        event.preventDefault()
        const next = event.shiftKey ? last : first
        next.focus()
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <div className="portfolioOverlayPosition">
      <section
        ref={dialogRef}
        className={`portfolioOverlay${closing ? ' isClosing' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) onComplete(event.animationName)
        }}
      >
        <button
          ref={closeRef}
          type="button"
          className="closeButton"
          aria-label="Close portfolio section"
          disabled={closing}
          onClick={onClose}
        >
          ×
        </button>
        <div className="portfolioContent">
          <p className="overlayEyebrow">Now playing</p>
          <h1 id={titleId}>{section.title}</h1>
          <p>{section.description}</p>
          <p className="comingSoon">Content coming soon.</p>
        </div>
      </section>
    </div>
  )
}
