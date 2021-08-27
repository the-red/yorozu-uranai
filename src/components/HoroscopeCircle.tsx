import { Layer, Stage, Circle, Line, Text, Image } from 'react-konva'
import type { Planet as PlanetClass } from '../horoscope'
import type { Houses } from '../horoscope'
import useImage from 'use-image'

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
const singRadius = 220
const planetRadius = 150
const iconSizeSign = 24
const iconSizePlanet = 20

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
  const x = origin + Math.sin(radian) * singRadius * 0.9
  const y = origin + Math.cos(radian) * singRadius * 0.9
  return { x, y }
}
const signCoordinates = [
  { name: '牡羊座', icon: '♈', coordinate: calcSignCoordinate(0), url: '/images/astro-sign-1.png' },
  { name: '牡牛座', icon: '♉', coordinate: calcSignCoordinate(30), url: '/images/astro-sign-2.png' },
  { name: '双子座', icon: '♊', coordinate: calcSignCoordinate(60), url: '/images/astro-sign-3.png' },
  { name: '蟹座', icon: '♋', coordinate: calcSignCoordinate(90), url: '/images/astro-sign-4.png' },
  { name: '獅子座', icon: '♌', coordinate: calcSignCoordinate(120), url: '/images/astro-sign-5.png' },
  { name: '乙女座', icon: '♍', coordinate: calcSignCoordinate(150), url: '/images/astro-sign-6.png' },
  { name: '天秤座', icon: '♎', coordinate: calcSignCoordinate(180), url: '/images/astro-sign-7.png' },
  { name: '蠍座', icon: '♏', coordinate: calcSignCoordinate(210), url: '/images/astro-sign-8.png' },
  { name: '射手座', icon: '♐', coordinate: calcSignCoordinate(240), url: '/images/astro-sign-9.png' },
  { name: '山羊座', icon: '♑', coordinate: calcSignCoordinate(270), url: '/images/astro-sign-10.png' },
  { name: '水瓶座', icon: '♒', coordinate: calcSignCoordinate(300), url: '/images/astro-sign-11.png' },
  { name: '魚座', icon: '♓', coordinate: calcSignCoordinate(330), url: '/images/astro-sign-12.png' },
]

const SignImage = ({ signCoordinate }: { signCoordinate: typeof signCoordinates[number] }) => {
  const [image] = useImage(signCoordinate.url)
  return (
    <Image
      image={image}
      x={signCoordinate.coordinate.x}
      y={signCoordinate.coordinate.y}
      width={24}
      height={24}
      offset={{ x: 12, y: 12 }}
    />
  )
}

const PlanetImage = ({ planet }: { planet: Planet }) => (
  <Text
    text={planet.icon}
    x={origin + planet.coordinate.x * planetRadius}
    y={origin + planet.coordinate.y * planetRadius}
    fontSize={iconSizePlanet}
    fill="black"
  />
)

export default function HoroscopeCircle({ horoscope }: { horoscope: Horoscope }) {
  const { planets } = horoscope

  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* 四角 */}
        {/* <Rect fill="gray" x={100} y={100} width={300} height={200} /> */}
        {/* 円 */}
        <Circle stroke="#352e2b" strokeWidth={1} fill="#e4E7E2" x={origin} y={origin} radius={220} opacity={1} />
        <Circle stroke="#352e2b" strokeWidth={1} fill="white" x={origin} y={origin} radius={180} opacity={1} />
        <Circle stroke="#afb1b1" strokeWidth={1} fill="#e4E7E2" x={origin} y={origin} radius={100} opacity={1} />
        {/* 線 */}
        <Line points={calcLineCoordinate(0)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(30)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(60)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(90)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(120)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(150)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Circle stroke="#afb1b1" strokeWidth={1} fill="white" x={origin} y={origin} radius={80} opacity={1} />
        {/* サイン */}
        {signCoordinates.map((signCoordinate, i) => (
          <SignImage key={i} signCoordinate={signCoordinate} />
        ))}
        {/* 惑星 */}
        {Object.values(planets).map((planet, id) => (
          <PlanetImage key={id} planet={planet} />
        ))}
      </Layer>
    </Stage>
  )
}
