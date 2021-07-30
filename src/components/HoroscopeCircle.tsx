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

const calcLineCoordinate = (longitude: number) => {
  const radian1 = (longitude - 90) * (Math.PI / 180)
  const x1 = origin + Math.sin(radian1) * singRadius
  const y1 = origin + Math.cos(radian1) * singRadius
  const radian2 = (longitude + 90) * (Math.PI / 180)
  const x2 = origin + Math.sin(radian2) * singRadius
  const y2 = origin + Math.cos(radian2) * singRadius
  return [x1, y1, x2, y2]
}

const calcSignCoordinate = (longitude: number) => {
  const radian = (longitude - 75) * (Math.PI / 180)
  const x = origin + Math.sin(radian) * singRadius - singRadius / 15
  const y = origin + Math.cos(radian) * singRadius - singRadius / 30
  return { x, y }
}
const signCoordinate = {
  牡羊座: { icon: '♈', coordinate: calcSignCoordinate(0) },
  牡牛座: { icon: '♉', coordinate: calcSignCoordinate(30) },
  双子座: { icon: '♊', coordinate: calcSignCoordinate(60) },
  蟹座: { icon: '♋', coordinate: calcSignCoordinate(90) },
  獅子座: { icon: '♌', coordinate: calcSignCoordinate(120) },
  乙女座: { icon: '♍', coordinate: calcSignCoordinate(150) },
  天秤座: { icon: '♎', coordinate: calcSignCoordinate(180) },
  蠍座: { icon: '♏', coordinate: calcSignCoordinate(210) },
  射手座: { icon: '♐', coordinate: calcSignCoordinate(240) },
  山羊座: { icon: '♑', coordinate: calcSignCoordinate(270) },
  水瓶座: { icon: '♒', coordinate: calcSignCoordinate(300) },
  魚座: { icon: '♓', coordinate: calcSignCoordinate(330) },
}

export default function HoroscopeCircle({ horoscope }: { horoscope: Horoscope }) {
  const { planets } = horoscope
  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* 四角 */}
        {/* <Rect fill="gray" x={100} y={100} width={300} height={200} /> */}
        {/* 円 */}
        <Circle stroke="#352e2b" strokeWidth={1} fill="#e4E7E2" x={250} y={250} radius={200} opacity={1} />
        <Circle stroke="#352e2b" strokeWidth={1} fill="white" x={250} y={250} radius={180} opacity={1} />
        <Circle stroke="#afb1b1" strokeWidth={1} fill="#e4E7E2" x={250} y={250} radius={100} opacity={1} />
        {/* 線 */}
        <Line points={calcLineCoordinate(0)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(30)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(60)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(90)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(120)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(150)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Circle stroke="#afb1b1" strokeWidth={1} fill="white" x={250} y={250} radius={80} opacity={1} />
        {/* 星座 */}
        <Text
          text={signCoordinate.牡羊座.icon}
          x={signCoordinate.牡羊座.coordinate.x}
          y={signCoordinate.牡羊座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.牡牛座.icon}
          x={signCoordinate.牡牛座.coordinate.x}
          y={signCoordinate.牡牛座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.双子座.icon}
          x={signCoordinate.双子座.coordinate.x}
          y={signCoordinate.双子座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.蟹座.icon}
          x={signCoordinate.蟹座.coordinate.x}
          y={signCoordinate.蟹座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.獅子座.icon}
          x={signCoordinate.獅子座.coordinate.x}
          y={signCoordinate.獅子座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.乙女座.icon}
          x={signCoordinate.乙女座.coordinate.x}
          y={signCoordinate.乙女座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.天秤座.icon}
          x={signCoordinate.天秤座.coordinate.x}
          y={signCoordinate.天秤座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.蠍座.icon}
          x={signCoordinate.蠍座.coordinate.x}
          y={signCoordinate.蠍座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.射手座.icon}
          x={signCoordinate.射手座.coordinate.x}
          y={signCoordinate.射手座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.山羊座.icon}
          x={signCoordinate.山羊座.coordinate.x}
          y={signCoordinate.山羊座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.水瓶座.icon}
          x={signCoordinate.水瓶座.coordinate.x}
          y={signCoordinate.水瓶座.coordinate.y}
          fontSize={iconSize}
          fill="black"
        />
        <Text
          text={signCoordinate.魚座.icon}
          x={signCoordinate.魚座.coordinate.x}
          y={signCoordinate.魚座.coordinate.y}
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
