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

const COORDINATE_ORIGIN = 250
const RADIUS = 220

const calcLineCoordinate = (longitude: number) => {
  const radian1 = (longitude - 90) * (Math.PI / 180)
  const x1 = COORDINATE_ORIGIN + Math.sin(radian1) * RADIUS
  const y1 = COORDINATE_ORIGIN + Math.cos(radian1) * RADIUS
  const radian2 = (longitude + 90) * (Math.PI / 180)
  const x2 = COORDINATE_ORIGIN + Math.sin(radian2) * RADIUS
  const y2 = COORDINATE_ORIGIN + Math.cos(radian2) * RADIUS
  return [x1, y1, x2, y2]
}

const signCoordinates = [
  { name: '牡羊座', icon: '♈', longitude: 0, url: '/images/astro-sign-1.png' },
  { name: '牡牛座', icon: '♉', longitude: 30, url: '/images/astro-sign-2.png' },
  { name: '双子座', icon: '♊', longitude: 60, url: '/images/astro-sign-3.png' },
  { name: '蟹座', icon: '♋', longitude: 90, url: '/images/astro-sign-4.png' },
  { name: '獅子座', icon: '♌', longitude: 120, url: '/images/astro-sign-5.png' },
  { name: '乙女座', icon: '♍', longitude: 150, url: '/images/astro-sign-6.png' },
  { name: '天秤座', icon: '♎', longitude: 180, url: '/images/astro-sign-7.png' },
  { name: '蠍座', icon: '♏', longitude: 210, url: '/images/astro-sign-8.png' },
  { name: '射手座', icon: '♐', longitude: 240, url: '/images/astro-sign-9.png' },
  { name: '山羊座', icon: '♑', longitude: 270, url: '/images/astro-sign-10.png' },
  { name: '水瓶座', icon: '♒', longitude: 300, url: '/images/astro-sign-11.png' },
  { name: '魚座', icon: '♓', longitude: 330, url: '/images/astro-sign-12.png' },
]

const SignImage = ({ signCoordinate }: { signCoordinate: typeof signCoordinates[number] }) => {
  const [image] = useImage(signCoordinate.url)
  const iconSize = RADIUS * 0.12
  const radian = (signCoordinate.longitude - 75) * (Math.PI / 180)

  return (
    <Image
      image={image}
      x={COORDINATE_ORIGIN + Math.sin(radian) * RADIUS * 0.9}
      y={COORDINATE_ORIGIN + Math.cos(radian) * RADIUS * 0.9}
      width={iconSize}
      height={iconSize}
      offset={{ x: iconSize / 2, y: iconSize / 2 }}
    />
  )
}

const PlanetImage = ({ planet }: { planet: Planet }) => {
  const radiusScale = RADIUS * 0.65
  const iconSize = RADIUS * 0.1
  return (
    <Text
      text={planet.icon}
      x={COORDINATE_ORIGIN + planet.coordinate.x * radiusScale}
      y={COORDINATE_ORIGIN + planet.coordinate.y * radiusScale}
      fontSize={iconSize}
      offset={{ x: iconSize / 2, y: iconSize / 2 }}
      fill="black"
    />
  )
}

export default function HoroscopeCircle({ horoscope }: { horoscope: Horoscope }) {
  const { planets } = horoscope

  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* 四角 */}
        {/* <Rect fill="gray" x={100} y={100} width={300} height={200} /> */}
        {/* 円 */}
        <Circle
          stroke="#352e2b"
          strokeWidth={1}
          fill="#e4E7E2"
          x={COORDINATE_ORIGIN}
          y={COORDINATE_ORIGIN}
          radius={RADIUS}
          opacity={1}
        />
        <Circle
          stroke="#352e2b"
          strokeWidth={1}
          fill="white"
          x={COORDINATE_ORIGIN}
          y={COORDINATE_ORIGIN}
          radius={RADIUS * 0.8}
          opacity={1}
        />
        <Circle
          stroke="#afb1b1"
          strokeWidth={1}
          fill="#e4E7E2"
          x={COORDINATE_ORIGIN}
          y={COORDINATE_ORIGIN}
          radius={RADIUS * 0.45}
          opacity={1}
        />
        {/* 線 */}
        <Line points={calcLineCoordinate(0)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(30)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(60)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(90)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(120)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Line points={calcLineCoordinate(150)} stroke="black" strokeWidth={1} opacity={0.2} />
        <Circle
          stroke="#afb1b1"
          strokeWidth={1}
          fill="white"
          x={COORDINATE_ORIGIN}
          y={COORDINATE_ORIGIN}
          radius={RADIUS * 0.37}
          opacity={1}
        />
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
