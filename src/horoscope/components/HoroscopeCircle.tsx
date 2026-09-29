import useImage from 'use-image'
// NOTE: Image はcanvasに描く部品。HTMLの画像（alt が要る）と区別できる名前で読み込む
import { Stage, Layer, Circle, Line, Text, Image as KonvaImage } from 'react-konva'
import { staticPath } from '../../lib/$path'
import { Horoscope, PointName, PlanetsMap, Position, ALL_PLANETS, MajorAspect, Planet } from '../models'
import type { House } from '../models/House'
import type { PlanetName } from '../../astronomy/types'

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

// 円の大きさと向き。どの部品も、これを基準に位置を決める
type Frame = {
  radius: number // 外周の半径
  houseLongitude: number // アセンダントが左（9時の方向）に来るように、全体を回す角度
}

const degreesToCoordinate = (radius: number, { degrees, scale }: { degrees: number; scale?: number }) => {
  scale ||= 1
  const radian = degrees * (Math.PI / 180)
  return {
    x: radius + Math.cos(radian) * radius * scale,
    y: radius - Math.sin(radian) * radius * scale,
  }
}

const ScaledCircle = ({
  radius,
  stroke,
  fill,
  scale,
}: {
  radius: number
  stroke: string
  fill: string
  scale: number
}) => <Circle stroke={stroke} strokeWidth={1} fill={fill} x={radius} y={radius} radius={radius * scale} opacity={1} />

const ScaledLine = ({
  radius,
  longitude,
  opacity = 0.2,
  scale = 1,
}: {
  radius: number
  longitude: number
  opacity?: number | undefined
  scale?: number
}) => {
  const start = degreesToCoordinate(radius, { degrees: longitude, scale })
  const end = degreesToCoordinate(radius, { degrees: longitude + 180, scale })

  return <Line points={[start.x, start.y, end.x, end.y]} stroke="black" strokeWidth={1} opacity={opacity} />
}

const ScaledText = ({
  frame: { radius, houseLongitude },
  text,
  longitude,
  scales,
}: {
  frame: Frame
  text: string
  longitude: number
  scales: IconScales
}) => {
  const iconSize = radius * scales.size
  const coordinate = degreesToCoordinate(radius, {
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
  frame: { radius, houseLongitude },
  imageUrl,
  longitude,
  scales,
}: {
  frame: Frame
  imageUrl: string
  longitude: number
  scales: IconScales
}) => {
  const [image] = useImage(imageUrl)
  const iconSize = radius * scales.size
  const coordinate = degreesToCoordinate(radius, {
    degrees: houseLongitude + longitude + 180 + scales.degrees,
    scale: scales.coordinate,
  })

  return (
    <KonvaImage
      image={image}
      x={coordinate.x}
      y={coordinate.y}
      width={iconSize}
      height={iconSize}
      offset={iconOffset(iconSize)}
    />
  )
}

const SignLine = ({ frame: { radius, houseLongitude } }: { frame: Frame }) => (
  <>
    {[0, 30, 60, 90, 120, 150].map((longitude, i) => (
      <ScaledLine key={i} radius={radius} longitude={houseLongitude + longitude} />
    ))}
  </>
)
const SignCircle = ({ frame }: { frame: Frame }) => (
  <>
    <ScaledCircle radius={frame.radius} stroke="#352e2b" fill="#e4E7E2" scale={1} />
    <SignLine frame={frame} />
  </>
)

const HouseLine = ({
  frame: { radius, houseLongitude },
  house,
  scale,
}: {
  frame: Frame
  house: House
  scale: number
}) => (
  <>
    {house.cusps.slice(0, 6).map((cusp, i) => {
      let opacity
      if (i % 3 === 0) {
        // { asc: 0, ic: 3, dsc: 6, mc: 9 }
        opacity = 0.5
      }
      return (
        <ScaledLine
          key={i}
          radius={radius}
          longitude={houseLongitude + cusp.longitude}
          opacity={opacity}
          scale={scale}
        />
      )
    })}
  </>
)
const HouseNumbers = ({ frame, house, scales }: { frame: Frame; house: House; scales: IconScales }) => (
  <>
    {house.cusps.map((cusp, i) => (
      <ScaledText key={i} frame={frame} text={String(i + 1)} longitude={cusp.longitude} scales={scales} />
    ))}
  </>
)
const HouseCircle = ({ frame, house }: { frame: Frame; house: House }) => (
  <>
    <ScaledCircle radius={frame.radius} stroke="#352e2b" fill="white" scale={0.8} />
    <ScaledCircle radius={frame.radius} stroke="#afb1b1" fill="#e4E7E2" scale={0.45} />
    <HouseLine frame={frame} house={house} scale={0.8} />
    <ScaledCircle radius={frame.radius} stroke="#afb1b1" fill="white" scale={0.37} />
    <HouseNumbers frame={frame} house={house} scales={{ size: 0.04, coordinate: 0.49, degrees: 5 }} />
  </>
)

const SignIcons = ({ frame }: { frame: Frame }) => (
  <>
    {signCoordinates.map((signCoordinate, i) => (
      <ScaledImage
        key={i}
        frame={frame}
        imageUrl={signCoordinate.url}
        longitude={signCoordinate.longitude}
        scales={{ size: 0.12, coordinate: 0.9, degrees: 15 }}
      />
    ))}
  </>
)
// 惑星と、感受点の記号
const PlanetIcons = ({ frame, planets }: { frame: Frame; planets: Planet<PlanetName | PointName>[] }) => (
  <>
    {planets.map((planet, i) => (
      <ScaledText
        key={i}
        frame={frame}
        text={planet.icon}
        longitude={planet.longitude}
        scales={{ size: 0.1, coordinate: 0.69, degrees: 0 }}
      />
    ))}
  </>
)

const AspectLine = ({
  frame: { radius, houseLongitude },
  from,
  to,
  color,
  scale,
}: {
  frame: Frame
  from: Position
  to: Position
  color: string
  scale?: number
}) => {
  const coordinateFrom = degreesToCoordinate(radius, { degrees: houseLongitude + from.longitude + 180, scale })
  const coordinateTo = degreesToCoordinate(radius, { degrees: houseLongitude + to.longitude + 180, scale })
  return (
    <Line
      points={[coordinateFrom.x, coordinateFrom.y, coordinateTo.x, coordinateTo.y]}
      stroke={color}
      strokeWidth={1.5}
      opacity={0.5}
    />
  )
}
const AspectLines = ({ frame, planets, orb }: { frame: Frame; planets: PlanetsMap; orb: number }) => {
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
      {Object.values(majorAspects).map(([from, to, aspect], i) => (
        <AspectLine
          key={i}
          frame={frame}
          from={from.position}
          to={to.position}
          color={aspect.type === 'hard' ? 'red' : 'blue'}
          scale={0.69}
        />
      ))}
    </>
  )
}

export default function HoroscopeCircle({
  horoscope,
  radius,
  orb,
}: {
  horoscope: Horoscope
  radius: number // 外周の半径
  orb: number
}) {
  const { planets, points, house } = horoscope
  const frame: Frame = { radius, houseLongitude: -house.ascendant.longitude }

  return (
    <Stage width={radius * 2} height={radius * 2}>
      <Layer>
        {/* サイン */}
        <SignCircle frame={frame} />
        <SignIcons frame={frame} />

        {/* ハウス */}
        <HouseCircle frame={frame} house={house} />

        {/* 惑星 */}
        <PlanetIcons frame={frame} planets={[...Object.values(planets), ...Object.values(points)]} />
        <AspectLines frame={frame} planets={planets} orb={orb} />
      </Layer>
    </Stage>
  )
}
