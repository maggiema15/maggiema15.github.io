import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PortfolioSection } from '../data/portfolio'

type RecordPosition = { x: number; y: number; size: number }
export type RecordPath = {
  source: RecordPosition
  destination: RecordPosition
}
export type PlaybackPhase = 'flying' | 'settling' | 'spinning' | 'closing' | 'returning'
type PlaybackState =
  | { phase: 'idle' }
  | { phase: PlaybackPhase; section: PortfolioSection; path: RecordPath }

const idle: PlaybackState = { phase: 'idle' }

function samePosition(a: RecordPosition, b: RecordPosition) {
  return Math.abs(a.x - b.x) < 0.5 && Math.abs(a.y - b.y) < 0.5 && Math.abs(a.size - b.size) < 0.5
}

function measurePath(button: HTMLButtonElement, target: HTMLDivElement): RecordPath {
  const cover = button.getBoundingClientRect()
  const player = target.getBoundingClientRect()
  const source = {
    x: cover.left + cover.width / 2,
    y: cover.top + cover.height / 2,
    size: Math.min(cover.width, cover.height) * 0.8,
  }
  const destination = {
    x: player.left + player.width / 2,
    y: player.top + player.height / 2,
    size: player.width,
  }

  return { source, destination }
}

export function useRecordPlayback(reducedMotion: boolean) {
  const [state, setState] = useState<PlaybackState>(idle)
  // Event handlers also need the latest phase before React's next render, so
  // repeated clicks or completion events cannot start overlapping sequences.
  const stateRef = useRef<PlaybackState>(idle)
  const playerTargetRef = useRef<HTMLDivElement>(null)
  const activeButtonRef = useRef<HTMLButtonElement | null>(null)
  const restoreFocusRef = useRef(false)

  const commit = useCallback((next: PlaybackState) => {
    stateRef.current = next
    setState(next)
  }, [])

  const readPath = useCallback(() => {
    const button = activeButtonRef.current
    const target = playerTargetRef.current
    return button?.isConnected && target ? measurePath(button, target) : null
  }, [])

  const finish = useCallback(() => {
    restoreFocusRef.current = true
    commit(idle)
  }, [commit])

  // Restore focus after React has re-enabled the album buttons. A frame queued
  // by an animation event can run before that DOM commit and silently lose focus.
  useLayoutEffect(() => {
    if (state.phase === 'idle' && restoreFocusRef.current) {
      restoreFocusRef.current = false
      activeButtonRef.current?.focus({ preventScroll: true })
    }
  }, [state.phase])

  const select = useCallback((section: PortfolioSection, button: HTMLButtonElement) => {
    if (stateRef.current.phase !== 'idle' || !playerTargetRef.current) return
    restoreFocusRef.current = false
    activeButtonRef.current = button
    commit({
      phase: reducedMotion ? 'spinning' : 'flying',
      section,
      path: measurePath(button, playerTargetRef.current),
    })
  }, [commit, reducedMotion])

  const close = useCallback(() => {
    const current = stateRef.current
    if (current.phase !== 'spinning') return
    if (reducedMotion) finish()
    else commit({ ...current, phase: 'closing' })
  }, [commit, finish, reducedMotion])

  const completeAnimation = useCallback((name: string) => {
    const current = stateRef.current
    if (current.phase === 'flying' && name === 'flyToPlayer') {
      commit({ ...current, phase: 'settling' })
    } else if (current.phase === 'settling' && name === 'recordSettled') {
      commit({ ...current, phase: 'spinning' })
    } else if (current.phase === 'closing' && name === 'overlayExit') {
      const path = readPath()
      if (path) commit({ ...current, phase: 'returning', path })
      else finish()
    } else if (current.phase === 'returning' && name === 'returnToSleeve') {
      finish()
    }
  }, [commit, finish, readPath])

  const settleLayoutChange = useCallback(() => {
    const current = stateRef.current
    if (current.phase === 'idle') return
    const path = readPath()
    if (!path) {
      finish()
      return
    }
    const arriving = current.phase === 'flying' || current.phase === 'settling'
    // Browser resize/scroll notifications do not always move the destination.
    // Sleeve hover/selection transforms also must not cancel an outward flight.
    const targetUnchanged = current.phase === 'returning'
      ? samePosition(current.path.source, path.source)
      : samePosition(current.path.destination, path.destination)
    if (targetUnchanged && !(arriving && reducedMotion)) return
    if (current.phase === 'returning') {
      finish()
      return
    }
    // Actual geometry changes still align to the new platter, then settle.
    const phase = arriving
      ? (reducedMotion ? 'spinning' : 'settling')
      : current.phase
    commit({ ...current, phase, path })
  }, [commit, finish, readPath, reducedMotion])

  const activeId = state.phase === 'idle' ? undefined : state.section.id
  useEffect(() => {
    if (!activeId) return
    let layoutFrame: number | null = null
    const scheduleMeasurement = () => {
      if (layoutFrame !== null) return
      layoutFrame = requestAnimationFrame(() => {
        layoutFrame = null
        settleLayoutChange()
      })
    }
    const sizes = new WeakMap<Element, string>()
    const observer = new ResizeObserver((entries) => {
      let changed = false
      for (const entry of entries) {
        const size = `${entry.contentRect.width}:${entry.contentRect.height}`
        const previous = sizes.get(entry.target)
        if (previous !== undefined && previous !== size) changed = true
        sizes.set(entry.target, size)
      }
      if (changed) scheduleMeasurement()
    })
    for (const element of [playerTargetRef.current, playerTargetRef.current?.parentElement,
      activeButtonRef.current]) {
      if (element) observer.observe(element)
    }
    window.addEventListener('resize', scheduleMeasurement)
    // Capture scrolls from nested scene containers too, but not dialog content:
    // scrolling the text should not end a return animation or shift the record.
    const onScroll = (event: Event) => {
      const scroller = event.target
      if (scroller instanceof Element && !scroller.contains(playerTargetRef.current)
        && !scroller.contains(activeButtonRef.current)) return
      scheduleMeasurement()
    }
    window.addEventListener('scroll', onScroll, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', scheduleMeasurement)
      window.removeEventListener('scroll', onScroll, true)
      if (layoutFrame !== null) cancelAnimationFrame(layoutFrame)
    }
  }, [activeId, settleLayoutChange])

  useEffect(() => {
    if (!reducedMotion) return
    const phase = stateRef.current.phase
    if (phase === 'closing' || phase === 'returning') finish()
    else settleLayoutChange()
  }, [reducedMotion, finish, settleLayoutChange])

  return { state, playerTargetRef, select, close, completeAnimation }
}
