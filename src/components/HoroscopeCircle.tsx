import { Stage, Layer, Circle, Line, Text, Image } from 'react-konva'
import type { Horoscope, Houses, Planet } from '../horoscope'
import useImage from 'use-image'

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
const iconOffset = (iconSize: number) => ({ x: iconSize / 2, y: iconSize / 2 })

export default function HoroscopeCircle({
  horoscope,
  origin,
  radius,
}: {
  horoscope: Horoscope
  origin: { x: number; y: number } // 円の中心座標
  radius: number // 外周の半径
}) {
  // TODO: ハウスを考慮してサインの位置を調整
  const { planets, houses } = horoscope

  const degreesToCoordinate = ({ degrees, scale }: { degrees: number; scale: number }) => {
    const radian = degrees * (Math.PI / 180)
    return {
      x: origin.x + Math.cos(radian) * radius * scale,
      y: origin.y - Math.sin(radian) * radius * scale,
    }
  }

  const ScaledCircle = ({ stroke, fill, scale }: { stroke: string; fill: string; scale: number }) => (
    <Circle stroke={stroke} strokeWidth={1} fill={fill} x={origin.x} y={origin.y} radius={radius * scale} opacity={1} />
  )

  const ScaledLine = ({ longitude }: { longitude: number }) => {
    const start = degreesToCoordinate({
      degrees: longitude,
      scale: 1,
    })
    const end = degreesToCoordinate({
      degrees: longitude + 180,
      scale: 1,
    })

    return <Line points={[start.x, start.y, end.x, end.y]} stroke="black" strokeWidth={1} opacity={0.2} />
  }

  const SignImage = ({ signCoordinate }: { signCoordinate: typeof signCoordinates[number] }) => {
    const [image] = useImage(signCoordinate.url)
    const iconSize = radius * 0.12
    const coordinate = degreesToCoordinate({
      degrees: signCoordinate.longitude + 180 + 15,
      scale: 0.9,
    })

    return (
      <Image
        image={image}
        x={coordinate.x}
        y={coordinate.y}
        width={iconSize}
        height={iconSize}
        offset={iconOffset(iconSize)}
      />
    )
  }

  const PlanetImage = ({ planet }: { planet: Planet }) => {
    const iconSize = radius * 0.1
    const coordinate = degreesToCoordinate({
      degrees: planet.longitude + 180,
      scale: 0.65,
    })

    return (
      <Text
        text={planet.icon}
        x={coordinate.x}
        y={coordinate.y}
        fontSize={iconSize}
        offset={iconOffset(iconSize)}
        fill="black"
      />
    )
  }

  return (
    <Stage width={origin.x + radius} height={origin.y + radius}>
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
