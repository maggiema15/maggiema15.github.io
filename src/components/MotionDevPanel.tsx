import type { MotionSettings } from '../data/recordPlayer'
import '../styles/motion-dev.css'

type Props = {
  settings: MotionSettings
  onChange: (settings: MotionSettings) => void
  onReplay: () => void
  canReplay: boolean
  busy: boolean
  inert: boolean
  reducedMotion: boolean
}

export default function MotionDevPanel({ settings, onChange, onReplay, canReplay, busy, inert, reducedMotion }: Props) {
  return (
    <details className="motionDevPanel" inert={inert}>
      <summary>Motion lab <span>dev</span></summary>
      <div className="motionDevBody">
        <fieldset>
          <legend>Album selection</legend>
          <label><input type="radio" name="motion-style" value="transfer" checked={settings.style === 'transfer'}
            onChange={() => onChange({ ...settings, style: 'transfer' })} />Lift &amp; place</label>
          <label><input type="radio" name="motion-style" value="turntable" checked={settings.style === 'turntable'}
            onChange={() => onChange({ ...settings, style: 'turntable' })} />Play at turntable</label>
        </fieldset>
        <label className="motionDevSpeed">Preview speed
          <select value={settings.rate} onChange={(event) => onChange({ ...settings, rate: Number(event.target.value) as 1 | 0.5 })}>
            <option value="1">Normal</option><option value="0.5">Half speed</option>
          </select>
        </label>
        <button type="button" onClick={onReplay} disabled={!canReplay || busy}>Replay last album</button>
        <p>{reducedMotion ? 'Animation is off. Use the room’s animation switch to preview movement.'
          : 'Choose an album to preview. Changing a setting resets playback.'}</p>
      </div>
    </details>
  )
}
