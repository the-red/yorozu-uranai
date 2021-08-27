import { Layer, Stage, Circle, Line, Text, Image } from 'react-konva'
import type { Planet as PlanetClass } from '../horoscope'
import type { Houses } from '../horoscope'
import useImage from 'use-image'

type Planet = ReturnType<PlanetClass['toJSON']>

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

export default function HoroscopeCircle({
  planets,
  coordinateOrigin,
  radius,
}: {
  planets: Planet[]
  coordinateOrigin: number // 原点座標
  radius: number // 外周円の半径
}) {
  const ScaledCircle = ({ stroke, fill, scale }: { stroke: string; fill: string; scale: number }) => (
    <Circle
      stroke={stroke}
      strokeWidth={1}
      fill={fill}
      x={coordinateOrigin}
      y={coordinateOrigin}
      radius={radius * scale}
      opacity={1}
    />
  )

  const ScaledLine = ({ longitude }: { longitude: number }) => {
    const radian1 = (longitude - 90) * (Math.PI / 180)
    const x1 = coordinateOrigin + Math.sin(radian1) * radius
    const y1 = coordinateOrigin + Math.cos(radian1) * radius
    const radian2 = (longitude + 90) * (Math.PI / 180)
    const x2 = coordinateOrigin + Math.sin(radian2) * radius
    const y2 = coordinateOrigin + Math.cos(radian2) * radius

    return <Line points={[x1, y1, x2, y2]} stroke="black" strokeWidth={1} opacity={0.2} />
  }

  const SignImage = ({ signCoordinate }: { signCoordinate: typeof signCoordinates[number] }) => {
    const [image] = useImage(signCoordinate.url)
    const iconSize = radius * 0.12
    const radian = (signCoordinate.longitude - 75) * (Math.PI / 180)

    return (
      <Image
        image={image}
        x={coordinateOrigin + Math.sin(radian) * radius * 0.9}
        y={coordinateOrigin + Math.cos(radian) * radius * 0.9}
        width={iconSize}
        height={iconSize}
        offset={{ x: iconSize / 2, y: iconSize / 2 }}
      />
    )
  }

  const PlanetImage = ({ planet }: { planet: Planet }) => {
    const radiusScale = radius * 0.65
    const iconSize = radius * 0.1
    return (
      <Text
        text={planet.icon}
        x={coordinateOrigin + planet.coordinate.x * radiusScale}
        y={coordinateOrigin + planet.coordinate.y * radiusScale}
        fontSize={iconSize}
        offset={{ x: iconSize / 2, y: iconSize / 2 }}
        fill="black"
      />
    )
  }

  return (
    <Stage width={500} height={500}>
      <Layer>
        <ScaledCircle stroke="#352e2b" fill="#e4E7E2" scale={1} />
        <ScaledCircle stroke="#352e2b" fill="white" scale={0.8} />
        <ScaledCircle stroke="#afb1b1" fill="#e4E7E2" scale={0.45} />
        {[0, 30, 60, 90, 120, 150].map((longitude, i) => (
          <ScaledLine key={i} longitude={longitude} />
        ))}
        <ScaledCircle stroke="#afb1b1" fill="white" scale={0.37} />

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
