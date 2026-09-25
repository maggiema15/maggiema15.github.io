import type { CSSProperties } from 'react'
import tonearmImage from '../assests/player/tonearm-v2.png'
import { playerGeometry as geometry } from '../data/recordPlayer'
import type { MotionRate } from '../data/recordPlayer'

export function Tonearm({ engaged = false, rate = 1, tilt }: { engaged?: boolean; rate?: MotionRate; tilt?: number }) {
  const projection = tilt ?? (geometry.platterHeight * (640 / 960) / geometry.platterWidth)
  return (
    <div className="tonearmPerspective" style={{
      left: `${geometry.pivotX}%`, top: `${geometry.pivotY}%`, width: `${geometry.armWidth}%`,
      transform: `translate(-50%, -20%) scaleY(${projection})`,
      '--arm-angle': `${engaged ? geometry.armAngle : 0}deg`,
      '--arm-duration': `${200 / rate}ms`,
    } as CSSProperties}>
      <img className="tonearmImage" src={tonearmImage} alt="" draggable={false} />
    </div>
  )
}
