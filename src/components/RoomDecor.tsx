import guitarImage from '../assests/clean/guitar-tight.png'
import wallPlantImage from '../assests/clean/wall-plant-tight.png'
import potPlantImage from '../assests/clean/pot-plant-tight.png'
import windowImage from '../assests/clean/window-v3-tight.png'

export function RoomDecor() {
  return (
    <>
      <img className="wallPlant" src={wallPlantImage} alt="" aria-hidden="true" />
      <img className="potPlant" src={potPlantImage} alt="" aria-hidden="true" />
      <div className="guitarMount" aria-hidden="true">
        <img className="guitarImage" src={guitarImage} alt="" />
      </div>
      <img className="windowImage" src={windowImage} alt="Vintage window mounted on the wall" />
    </>
  )
}
