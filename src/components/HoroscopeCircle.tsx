import { Layer, Rect, Stage, Circle, Ellipse, Line, Text } from 'react-konva'
import type { Planet as PlanetClass } from '../horoscope'
import type { Houses } from '../horoscope'

type Planet = ReturnType<PlanetClass['toJSON']>
type Horoscope = {
  houses: Houses
  planets: {
    sun: Planet
    moon: Planet
    mercury: Planet
    venus: Planet
    mars: Planet
    jupiter: Planet
    saturn: Planet
    uranus: Planet
    neptune: Planet
    pluto: Planet
  }
}

const origin = 250
const singRadius = 200
const planetRadius = 150
const iconSize = 20

const signCoordinate = (longitude: number) => {
  // ホロスコープに描画する際の座標（左端中央が原点）
  const radian = (longitude - 75) * (Math.PI / 180)
  const x = origin + Math.sin(radian) * singRadius - singRadius / 15
  const y = origin + Math.cos(radian) * singRadius - singRadius / 30
  return { x, y }
}
const SignCoordinate = {
  牡羊座: { icon: '♈', coordinate: signCoordinate(0) },
  牡牛座: { icon: '♉', coordinate: signCoordinate(30) },
  双子座: { icon: '♊', coordinate: signCoordinate(60) },
  蟹座: { icon: '♋', coordinate: signCoordinate(90) },
  獅子座: { icon: '♌', coordinate: signCoordinate(120) },
  乙女座: { icon: '♍', coordinate: signCoordinate(150) },
  天秤座: { icon: '♎', coordinate: signCoordinate(180) },
  蠍座: { icon: '♏', coordinate: signCoordinate(210) },
  射手座: { icon: '♐', coordinate: signCoordinate(240) },
  山羊座: { icon: '♑', coordinate: signCoordinate(270) },
  水瓶座: { icon: '♒', coordinate: signCoordinate(300) },
  魚座: { icon: '♓', coordinate: signCoordinate(330) },
}
console.log(SignCoordinate)

export default function HoroscopeCircle({ horoscope }: { horoscope: Horoscope }) {
  const { planets } = horoscope
  console.log(
    JSON.stringify({
      sun: planets.sun.coordinate,
      moon: planets.moon.coordinate,
      mercury: planets.mercury.coordinate,
      venus: planets.venus.coordinate,
      mars: planets.mars.coordinate,
      jupiter: planets.jupiter.coordinate,
      saturn: planets.saturn.coordinate,
      uranus: planets.uranus.coordinate,
      neptune: planets.neptune.coordinate,
      pluto: planets.pluto.coordinate,
    })
  )
  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* 四角 */}
        {/* <Rect fill="gray" x={100} y={100} width={300} height={200} /> */}
        {/* 円 */}
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={200} opacity={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={180} opacity={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={100} opacity={1} />
        {/* 線 */}
        <Line points={[250, 250, 250, 50]} stroke="black" strokeWidth={1} />
        <Line points={[250, 250, 450, 250]} stroke="black" strokeWidth={1} />
        <Line points={[250, 250, 250, 450]} stroke="black" strokeWidth={1} />
        <Line points={[250, 250, 50, 250]} stroke="black" strokeWidth={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={80} opacity={1} />
        {/* 星座 */}
        <Text
          text={SignCoordinate.牡羊座.icon}
          x={SignCoordinate.牡羊座.coordinate.x}
          y={SignCoordinate.牡羊座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.牡牛座.icon}
          x={SignCoordinate.牡牛座.coordinate.x}
          y={SignCoordinate.牡牛座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.双子座.icon}
          x={SignCoordinate.双子座.coordinate.x}
          y={SignCoordinate.双子座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.蟹座.icon}
          x={SignCoordinate.蟹座.coordinate.x}
          y={SignCoordinate.蟹座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.獅子座.icon}
          x={SignCoordinate.獅子座.coordinate.x}
          y={SignCoordinate.獅子座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.乙女座.icon}
          x={SignCoordinate.乙女座.coordinate.x}
          y={SignCoordinate.乙女座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.天秤座.icon}
          x={SignCoordinate.天秤座.coordinate.x}
          y={SignCoordinate.天秤座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.蠍座.icon}
          x={SignCoordinate.蠍座.coordinate.x}
          y={SignCoordinate.蠍座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.射手座.icon}
          x={SignCoordinate.射手座.coordinate.x}
          y={SignCoordinate.射手座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.山羊座.icon}
          x={SignCoordinate.山羊座.coordinate.x}
          y={SignCoordinate.山羊座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.水瓶座.icon}
          x={SignCoordinate.水瓶座.coordinate.x}
          y={SignCoordinate.水瓶座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={SignCoordinate.魚座.icon}
          x={SignCoordinate.魚座.coordinate.x}
          y={SignCoordinate.魚座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />

        {/* 惑星 */}
        <Text
          text="☉"
          x={origin + planets.sun.coordinate.x * planetRadius}
          y={origin + planets.sun.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="☽"
          x={origin + planets.moon.coordinate.x * planetRadius}
          y={origin + planets.moon.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="☿"
          x={origin + planets.mercury.coordinate.x * planetRadius}
          y={origin + planets.mercury.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♀"
          x={origin + planets.venus.coordinate.x * planetRadius}
          y={origin + planets.venus.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♂"
          x={origin + planets.mars.coordinate.x * planetRadius}
          y={origin + planets.mars.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♃"
          x={origin + planets.jupiter.coordinate.x * planetRadius}
          y={origin + planets.jupiter.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♄"
          x={origin + planets.saturn.coordinate.x * planetRadius}
          y={origin + planets.saturn.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♅"
          x={origin + planets.uranus.coordinate.x * planetRadius}
          y={origin + planets.uranus.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♆"
          x={origin + planets.neptune.coordinate.x * planetRadius}
          y={origin + planets.neptune.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text="♇"
          x={origin + planets.pluto.coordinate.x * planetRadius}
          y={origin + planets.pluto.coordinate.y * planetRadius}
          fontSize={iconSize}
          fill="black"
        />
      </Layer>
    </Stage>
  )
}
