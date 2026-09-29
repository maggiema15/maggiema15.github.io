import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PortfolioSection } from '../data/portfolio'

type RecordPosition = { x: number; y: number; size: number }
export type RecordPath = {
  source: RecordPosition & { sleeveRight: number }
  destination: RecordPosition & { tilt: number }
  deck: { x: number; y: number; width: number; height: number }
}
export type PlaybackPhase = 'flying' | 'settling' | 'playing' | 'spinning' | 'closing' | 'returning'
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
  const deck = target.parentElement!.getBoundingClientRect()
  return {
    source: {
      x: cover.left + cover.width / 2,
      y: cover.top + cover.height / 2,
      size: Math.min(cover.width, cover.height) * 0.92,
      sleeveRight: cover.right,
    },
    destination: {
      x: player.left + player.width / 2,
      y: player.top + player.height / 2,
      size: player.width,
      tilt: player.height / player.width,
    },
    deck: { x: deck.x, y: deck.y, width: deck.width, height: deck.height },
  }
}

export function useRecordPlayback() {
  const [state, setState] = useState<PlaybackState>(idle)
  // Synchronous guards also reject duplicate input before React commits a render.
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

  useLayoutEffect(() => {
    if (state.phase === 'idle' && restoreFocusRef.current) {
      restoreFocusRef.current = false
      activeButtonRef.current?.focus({ preventScroll: true })
    }
  }, [state])

  const select = useCallback((section: PortfolioSection, button: HTMLButtonElement) => {
    if (stateRef.current.phase !== 'idle' || !playerTargetRef.current) return
    restoreFocusRef.current = false
    activeButtonRef.current = button
    commit({
      phase: 'flying',
      section,
      path: measurePath(button, playerTargetRef.current),
    })
  }, [commit])

  const close = useCallback(() => {
    const current = stateRef.current
    if (current.phase !== 'spinning') return
    commit({ ...current, phase: 'closing' })
  }, [commit])

  const completeAnimation = useCallback((name: string) => {
    const current = stateRef.current
    if (current.phase === 'flying' && name === 'flyToPlayer') {
      commit({ ...current, phase: 'settling' })
    } else if (current.phase === 'settling' && name === 'recordSettled') {
      commit({ ...current, phase: 'playing' })
    } else if (current.phase === 'playing' && name === 'playbackShown') {
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
      restoreFocusRef.current = false
      commit(idle)
      return
    }
    const arriving = current.phase === 'flying' || current.phase === 'settling' || current.phase === 'playing'
    const targetUnchanged = current.phase === 'returning'
      ? samePosition(current.path.source, path.source)
      : samePosition(current.path.destination, path.destination)
        && Math.abs(current.path.destination.tilt - path.destination.tilt) < 0.001
    if (targetUnchanged) return
    if (current.phase === 'returning') { finish(); return }
    commit({ ...current, path, phase: arriving ? 'settling' : current.phase })
  }, [commit, finish, readPath])

  const activeId = state.phase === 'idle' ? undefined : state.section.id
  useEffect(() => {
    if (!activeId) return
    let frame: number | null = null
    const schedule = () => {
      if (frame !== null) return
      frame = requestAnimationFrame(() => { frame = null; settleLayoutChange() })
    }
    const sizes = new WeakMap<Element, string>()
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const size = `${entry.contentRect.width}:${entry.contentRect.height}`
        const previous = sizes.get(entry.target)
        if (previous !== undefined && previous !== size) schedule()
        sizes.set(entry.target, size)
      }
    })
    for (const element of [playerTargetRef.current, playerTargetRef.current?.parentElement, activeButtonRef.current]) {
      if (element) observer.observe(element)
    }
    const onScroll = (event: Event) => {
      const scroller = event.target
      if (scroller instanceof Element && !scroller.contains(playerTargetRef.current)
        && !scroller.contains(activeButtonRef.current)) return
      schedule()
    }
    window.addEventListener('resize', schedule)
    window.addEventListener('scroll', onScroll, true)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', schedule)
      window.removeEventListener('scroll', onScroll, true)
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [activeId, settleLayoutChange])

  return { state, playerTargetRef, select, close, completeAnimation }
}
