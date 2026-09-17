import { useEffect, useState } from 'react'

type MotionPreference = 'system' | 'on' | 'off'
const storageKey = 'vinyl-record-motion'
const motionQuery = '(prefers-reduced-motion: reduce)'

function initialPreference(): MotionPreference {
  const requested = new URLSearchParams(window.location.search).get('motion')
  if (requested === 'on' || requested === 'off') return requested
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'on' || saved === 'off') return saved
  } catch { /* The control also works when storage is unavailable. */ }
  return 'system'
}

export function useMotionPreference() {
  const [preference, setPreference] = useState<MotionPreference>(initialPreference)
  const [systemReducedMotion, setSystemReducedMotion] = useState(() => window.matchMedia(motionQuery).matches)
  const reducedMotion = preference === 'system' ? systemReducedMotion : preference === 'off'

  useEffect(() => {
    const media = window.matchMedia(motionQuery)
    const update = () => setSystemReducedMotion(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const toggleMotion = () => {
    const next = reducedMotion ? 'on' : 'off'
    setPreference(next)
    try { localStorage.setItem(storageKey, next) } catch { /* Optional persistence. */ }
    // An explicit control change supersedes an incoming preview link too.
    const url = new URL(window.location.href)
    if (url.searchParams.has('motion')) {
      url.searchParams.delete('motion')
      window.history.replaceState(null, '', url)
    }
  }

  return { reducedMotion, toggleMotion, followsSystem: preference === 'system' }
}
