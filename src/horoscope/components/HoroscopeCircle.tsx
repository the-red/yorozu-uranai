import useImage from 'use-image'
import { Stage, Layer, Circle, Line, Text, Image } from 'react-konva'
import { staticPath } from '../../lib/$path'
import { Horoscope, Position, ALL_PLANETS, MajorAspect, Planet } from '../'

const images = staticPath.images.horoscope

type IconScales = { coordinate: number; size: number; degrees: number }
const signCoordinates = [
  { name: '牡羊座', icon: '♈', longitude: 0, url: images.astro_sign_01_png },
  { name: '牡牛座', icon: '♉', longitude: 30, url: images.astro_sign_02_png },
  { name: '双子座', icon: '♊', longitude: 60, url: images.astro_sign_03_png },
  { name: '蟹座', icon: '♋', longitude: 90, url: images.astro_sign_04_png },
  { name: '獅子座', icon: '♌', longitude: 120, url: images.astro_sign_05_png },
  { name: '乙女座', icon: '♍', longitude: 150, url: images.astro_sign_06_png },
  { name: '天秤座', icon: '♎', longitude: 180, url: images.astro_sign_07_png },
  { name: '蠍座', icon: '♏', longitude: 210, url: images.astro_sign_08_png },
  { name: '射手座', icon: '♐', longitude: 240, url: images.astro_sign_09_png },
  { name: '山羊座', icon: '♑', longitude: 270, url: images.astro_sign_10_png },
  { name: '水瓶座', icon: '♒', longitude: 300, url: images.astro_sign_11_png },
  { name: '魚座', icon: '♓', longitude: 330, url: images.astro_sign_12_png },
]
const iconOffset = (iconSize: number) => ({ x: iconSize / 2, y: iconSize / 2 })

export default function HoroscopeCircle({
  horoscope,
  radius,
  orb,
}: {
  horoscope: Horoscope
  radius: number // 外周の半径
  orb: number
}) {
  const { planets, house } = horoscope
  const houseLongitude = -house.ascendant.longitude

  const degreesToCoordinate = ({ degrees, scale }: { degrees: number; scale?: number }) => {
    scale ||= 1
    const radian = degrees * (Math.PI / 180)
    return {
      x: radius + Math.cos(radian) * radius * scale,
      y: radius - Math.sin(radian) * radius * scale,
    }
  }

  const ScaledCircle = ({ stroke, fill, scale }: { stroke: string; fill: string; scale: number }) => (
    <Circle stroke={stroke} strokeWidth={1} fill={fill} x={radius} y={radius} radius={radius * scale} opacity={1} />
  )

  const ScaledLine = ({
    longitude,
    opacity = 0.2,
    scale = 1,
  }: {
    longitude: number
    opacity?: number | undefined
    scale?: number
  }) => {
    const start = degreesToCoordinate({ degrees: longitude, scale })
    const end = degreesToCoordinate({ degrees: longitude + 180, scale })

    return <Line points={[start.x, start.y, end.x, end.y]} stroke="black" strokeWidth={1} opacity={opacity} />
  }

  const ScaledText = ({ text, longitude, scales }: { text: string; longitude: number; scales: IconScales }) => {
    const iconSize = radius * scales.size
    const coordinate = degreesToCoordinate({
      degrees: houseLongitude + longitude + 180 + scales.degrees,
      scale: scales.coordinate,
    })
    return (
      <Text
        text={text}
        x={coordinate.x}
        y={coordinate.y}
        fontSize={iconSize}
        offset={iconOffset(iconSize)}
        fill="black"
      />
    )
  }

  const ScaledImage = ({
    imageUrl,
    longitude,
    scales,
  }: {
    imageUrl: string
    longitude: number
    scales: IconScales
  }) => {
    const [image] = useImage(imageUrl)
    const iconSize = radius * scales.size
    const coordinate = degreesToCoordinate({
      degrees: houseLongitude + longitude + 180 + scales.degrees,
      scale: scales.coordinate,
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

  const SignLine = () => (
    <>
      {[0, 30, 60, 90, 120, 150].map((longitude, i) => (
        <ScaledLine key={i} longitude={houseLongitude + longitude} />
      ))}
    </>
  )
  const SignCircle = () => (
    <>
      <ScaledCircle stroke="#352e2b" fill="#e4E7E2" scale={1} />
      <SignLine />
    </>
  )

  const HouseLine = ({ scale }: { scale: number }) => (
    <>
      {house.cusps.slice(0, 6).map((cusp, i) => {
        let opacity
        if (i % 3 === 0) {
          // { asc: 0, ic: 3, dsc: 6, mc: 9 }
          opacity = 0.5
        }
        return <ScaledLine key={i} longitude={houseLongitude + cusp.longitude} opacity={opacity} scale={scale} />
      })}
    </>
  )
  const HouseNumbers = ({ scales }: { scales: IconScales }) => (
    <>
      {house.cusps.map((cusp, i) => (
        <ScaledText key={i} text={String(i + 1)} longitude={cusp.longitude} scales={scales} />
      ))}
    </>
  )
  const HouseCircle = () => (
    <>
      <ScaledCircle stroke="#352e2b" fill="white" scale={0.8} />
      <ScaledCircle stroke="#afb1b1" fill="#e4E7E2" scale={0.45} />
      <HouseLine scale={0.8} />
      <ScaledCircle stroke="#afb1b1" fill="white" scale={0.37} />
      <HouseNumbers scales={{ size: 0.04, coordinate: 0.49, degrees: 5 }} />
    </>
  )

  const SignIcons = () => (
    <>
      {signCoordinates.map((signCoordinate, i) => (
        <ScaledImage
          key={i}
          imageUrl={signCoordinate.url}
          longitude={signCoordinate.longitude}
          scales={{ size: 0.12, coordinate: 0.9, degrees: 15 }}
        />
      ))}
    </>
  )
  const PlanetIcons = () => (
    <>
      {Object?.values(planets).map((planet, i) => (
        <ScaledText
          key={i}
          text={planet.icon}
          longitude={planet.longitude}
          scales={{ size: 0.1, coordinate: 0.69, degrees: 0 }}
        />
      ))}
    </>
  )

  const AspectLine = ({ from, to, color, scale }: { from: Position; to: Position; color: string; scale?: number }) => {
    const coordinateFrom = degreesToCoordinate({ degrees: houseLongitude + from.longitude + 180, scale })
    const coordinateTo = degreesToCoordinate({ degrees: houseLongitude + to.longitude + 180, scale })
    return (
      <Line
        points={[coordinateFrom.x, coordinateFrom.y, coordinateTo.x, coordinateTo.y]}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.5}
      />
    )
  }
  const AspectLines = () => {
    const majorAspects: Record<string, [Planet, Planet, MajorAspect]> = {}
    ALL_PLANETS.forEach((x) => {
      const planetX = planets[x]
      ALL_PLANETS.forEach((y) => {
        const planetY = planets[y]
        if (planetX.name === planetY.name) {
          return
        }

        // sun,moonとmoon,sunを同一化するキー
        const key = [planetX.name, planetY.name].sort().join()

        const majorAspect = planetX.majorAspect(planetY, orb)
        if (majorAspect && !majorAspects[key]) {
          majorAspects[key] = [planetX, planetY, majorAspect]
        }
      })
    })

    return (
      <>
        {Object?.values(majorAspects).map(([from, to, aspect], i) => (
          <AspectLine
            key={i}
            from={from.position}
            to={to.position}
            color={aspect.type === 'hard' ? 'red' : 'blue'}
            scale={0.69}
          />
        ))}
      </>
    )
  }

  return (
    <Stage width={radius * 2} height={radius * 2}>
      <Layer>
        {/* サイン */}
        <SignCircle />
        <SignIcons />

        {/* ハウス */}
        <HouseCircle />

        {/* 惑星 */}
        <PlanetIcons />
        <AspectLines />
      </Layer>
    </Stage>
  )
}
