import { Fragment } from 'react'
import useImage from 'use-image'
// NOTE: Image はcanvasに描く部品。HTMLの画像（alt が要る）と区別できる名前で読み込む
import { Stage, Layer, Circle, Line, Shape, Text, Image as KonvaImage } from 'react-konva'
import { staticPath } from '../../lib/$path'
import {
  AspectSettings,
  Horoscope,
  Position,
  POINT_NEEDS_BIRTH_TIME,
  Visibility,
  getPlanetAspects,
  isAsteroidVisible,
  isPointVisible,
  spreadLongitudes,
} from '../models'
import type { House } from '../models/House'

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

// 輪の位置。外周の半径を 1 としたときの割合
const RINGS = {
  sign: 0.8, // サインの輪の内側。目盛りは、ここから内側に引く
  leader: 0.765, // 引き出し線の始まり。目盛りの内側の端
  degrees: 0.69, // 度数。引き出し線は、ここを目指す
  icon: 0.585, // 惑星と、感受点の記号
  aspect: 0.45, // アスペクトの線の端
}
// 目盛りの線の長さ。10度ごと、5度ごと、1度ごと
const TICKS = [
  { every: 10, length: 0.035 },
  { every: 5, length: 0.025 },
  { every: 1, length: 0.015 },
]
// 惑星と感受点の記号のフォント。CSS の --symbol-font と同じ
// NOTE: 指定しないと、端末が文字ごとに別のフォントを選んで、記号の位置がずれる
const SYMBOL_FONT = "'Apple Symbols', 'Segoe UI Symbol', 'Noto Sans Symbols 2', 'Noto Sans Symbols', sans-serif"
// 文字を下げる量。文字の大きさに対する割合
// NOTE: 文字は、指定した位置より、少し上に描かれる。記号は約 5%、数字と英字は約 8%（Mac の Chrome で測った値）
const LOWER = { symbol: 0.05, text: 0.08 }
// 記号どうしの間隔（度）。記号の幅は、円周の約 9.8度にあたる
const MIN_GAP = 10

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

// 円を横切る線。half なら、中心から、片側（longitude + 180 の側）だけに引く
const ScaledLine = ({
  radius,
  longitude,
  opacity = 0.2,
  scale = 1,
  half = false,
}: {
  radius: number
  longitude: number
  opacity?: number | undefined
  scale?: number
  half?: boolean
}) => {
  // NOTE: 円の中心は、(radius, radius)
  const start = half ? { x: radius, y: radius } : degreesToCoordinate(radius, { degrees: longitude, scale })
  const end = degreesToCoordinate(radius, { degrees: longitude + 180, scale })

  return <Line points={[start.x, start.y, end.x, end.y]} stroke="black" strokeWidth={1} opacity={opacity} />
}

const ScaledText = ({
  frame: { radius, houseLongitude },
  text,
  longitude,
  scales,
  centered = false,
  fill = 'black',
  outlined = false,
  fontFamily,
  lower = 0,
}: {
  frame: Frame
  text: string
  longitude: number
  scales: IconScales
  centered?: boolean // 文字の幅の中央を、位置に合わせる
  fill?: string
  outlined?: boolean // 文字の周りを、白く縁取る。線の上に重なっても、読めるようにする
  fontFamily?: string
  lower?: number // 文字を下げる量。文字の大きさに対する割合
}) => {
  const iconSize = radius * scales.size
  const coordinate = degreesToCoordinate(radius, {
    degrees: houseLongitude + longitude + 180 + scales.degrees,
    scale: scales.coordinate,
  })
  // 中央に寄せるための枠の幅。文字が収まる大きさにする
  const width = iconSize * 4
  return (
    <Text
      text={text}
      x={coordinate.x}
      y={coordinate.y}
      fontSize={iconSize}
      offset={centered ? { x: width / 2, y: iconSize / 2 - iconSize * lower } : iconOffset(iconSize)}
      fill={fill}
      {...(fontFamily && { fontFamily })}
      {...(centered && { width, align: 'center' })}
      {...(outlined && {
        stroke: 'white',
        strokeWidth: iconSize * 0.3,
        fillAfterStrokeEnabled: true,
        lineJoin: 'round',
      })}
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
    {/* NOTE: カスプごとに、中心から引く。ハウスシステムによっては、向かい合うカスプが、180度の反対側にならない */}
    {house.cusps.map((cusp, i) => {
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
          half
        />
      )
    })}
  </>
)
const HouseNumbers = ({ frame, house, scales }: { frame: Frame; house: House; scales: IconScales }) => (
  <>
    {house.cusps.map((cusp, i) => (
      // 度数と見分けられるように、色を薄くする
      <ScaledText key={i} frame={frame} text={String(i + 1)} longitude={cusp.longitude} scales={scales} fill="#777" />
    ))}
  </>
)
const HouseCircle = ({ frame, house }: { frame: Frame; house: House }) => (
  <>
    <ScaledCircle radius={frame.radius} stroke="#352e2b" fill="white" scale={RINGS.sign} />
    <ScaledCircle radius={frame.radius} stroke="#afb1b1" fill="#e4E7E2" scale={RINGS.aspect} />
    <HouseLine frame={frame} house={house} scale={RINGS.sign} />
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
// 目盛り。サインの輪の内側に、1度ごとの線を引く
const Ticks = ({ frame: { radius, houseLongitude } }: { frame: Frame }) => (
  <Shape
    stroke="#352e2b"
    strokeWidth={0.75}
    sceneFunc={(context, shape) => {
      context.beginPath()
      for (let longitude = 0; longitude < 360; longitude++) {
        const { length } = TICKS.find(({ every }) => longitude % every === 0) ?? TICKS[TICKS.length - 1]
        const degrees = houseLongitude + longitude + 180
        const from = degreesToCoordinate(radius, { degrees, scale: RINGS.sign })
        const to = degreesToCoordinate(radius, { degrees, scale: RINGS.sign - length })
        context.moveTo(from.x, from.y)
        context.lineTo(to.x, to.y)
      }
      context.strokeShape(shape)
    }}
  />
)

// 円の中に置くもの。惑星、感受点、Asc、Mc
type Body = {
  name: string
  icon: string
  position: Position
  isRetrograde: boolean
  hasLeader: boolean // 引き出し線を引くか
}

// 惑星、感受点、Asc、Mc の記号
// 記号は、重ならないようにずらした位置（shown）に置く。本当の位置は、目盛りから引き出し線を引いて示す
// 度数の文字。度だけを表示する（分は切り捨てる）。逆行のときは、R を付ける
const DEGREES_SIZE = 0.045
const toDegreesText = ({ position, isRetrograde }: Body) => `${position.degreesInt}°${isRetrograde ? 'R' : ''}`

// 引き出し線。目盛りの上の本当の位置から、度数の中心を目指して引き、度数の枠の手前で止める
// NOTE: 度数の外側の端を目指すと、記号が大きく動いたときに、線が円周に沿って寝てしまう
const LeaderLine = ({ frame: { radius, houseLongitude }, body }: { frame: Frame; body: Body & { shown: number } }) => {
  const from = degreesToCoordinate(radius, {
    degrees: houseLongitude + body.position.longitude + 180,
    scale: RINGS.leader,
  })
  const center = degreesToCoordinate(radius, { degrees: houseLongitude + body.shown + 180, scale: RINGS.degrees })

  // 度数の枠の大きさ（半分）。文字の幅は、数字が 0.56、° が 0.4、R が 0.72（文字の大きさに対する割合。Arial）
  const size = radius * DEGREES_SIZE
  const text = toDegreesText(body)
  const width = [...text].reduce((sum, _) => sum + (_ === '°' ? 0.4 : _ === 'R' ? 0.72 : 0.56), 0) * size
  const margin = size * 0.3
  const half = { x: width / 2 + margin, y: size * 0.36 + margin }

  // 中心から、線の向きに進んで、枠の端に届くまでの距離
  const length = Math.hypot(from.x - center.x, from.y - center.y)
  const direction = { x: (from.x - center.x) / length, y: (from.y - center.y) / length }
  const toEdge = Math.min(half.x / Math.abs(direction.x), half.y / Math.abs(direction.y))
  if (toEdge >= length) {
    return null
  }
  const to = { x: center.x + direction.x * toEdge, y: center.y + direction.y * toEdge }
  return <Line points={[from.x, from.y, to.x, to.y]} stroke="#352e2b" strokeWidth={0.75} />
}

const BodyIcons = ({ frame, bodies }: { frame: Frame; bodies: (Body & { shown: number })[] }) => (
  <>
    {/* 線を先に描いて、文字を上に重ねる */}
    {bodies
      .filter((_) => _.hasLeader)
      .map((body) => (
        <LeaderLine key={body.name} frame={frame} body={body} />
      ))}
    {bodies.map((body) => {
      const { name, icon, shown } = body
      // 記号が1文字でないもの（Asc、Mc、Vx、PoF）は、ほかの記号と大きさがそろうように、小さくする
      const isText = icon.length > 1
      const texts = [
        { text: toDegreesText(body), size: DEGREES_SIZE, coordinate: RINGS.degrees, lower: LOWER.text },
        isText
          ? { text: icon, size: 0.055, coordinate: RINGS.icon, lower: LOWER.text }
          : { text: icon, size: 0.11, coordinate: RINGS.icon, lower: LOWER.symbol, fontFamily: SYMBOL_FONT },
      ]
      return (
        <Fragment key={name}>
          {texts.map(({ text, size, coordinate, lower, fontFamily }) => (
            <ScaledText
              key={coordinate}
              frame={frame}
              text={text}
              longitude={shown}
              scales={{ size, coordinate, degrees: 0 }}
              fontFamily={fontFamily}
              lower={lower}
              centered
              outlined
            />
          ))}
        </Fragment>
      )
    })}
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
// アスペクトの線の色。表の文字の色と同じ
const ASPECT_COLORS = { hard: 'red', soft: 'blue', minor: 'green' } as const

// 惑星どうしのアスペクトの線
const AspectLines = ({
  frame,
  horoscope,
  settings,
}: {
  frame: Frame
  horoscope: Horoscope
  settings: AspectSettings
}) => (
  <>
    {getPlanetAspects(horoscope, settings).map(({ planets: [from, to], aspect }) => (
      <AspectLine
        key={`${from},${to}`}
        frame={frame}
        from={horoscope.planets[from].position}
        to={horoscope.planets[to].position}
        color={ASPECT_COLORS[aspect.type]}
        scale={RINGS.aspect}
      />
    ))}
  </>
)

export default function HoroscopeCircle({
  horoscope,
  radius,
  settings,
  visibility,
}: {
  horoscope: Horoscope
  radius: number // 外周の半径
  settings: AspectSettings
  visibility: Visibility
}) {
  const { planets, asteroids, points, house } = horoscope
  const frame: Frame = { radius, houseLongitude: -house.ascendant.longitude }

  // NOTE: icon は、クラスのゲッター。オブジェクトを展開（...）すると落ちるので、値を取り出しておく
  const toBody = ({ name, icon, position, isRetrograde }: Omit<Body, 'hasLeader'>): Body => ({
    name,
    icon,
    position,
    isRetrograde,
    hasLeader: true,
  })
  // ハウスの線の上にあるか
  const isOnCusp = ({ longitude }: Position) => house.cusps.some((_) => _.longitude === longitude)
  // 表示しないものは、重ならない位置を求めるときにも、数に入れない
  const visibleAsteroids = Object.values(asteroids ?? {}).filter((_) => isAsteroidVisible(_.name, visibility))
  const visiblePoints = Object.values(points).filter((_) => isPointVisible(_.name, visibility))
  const localPoints = visiblePoints.filter((_) => POINT_NEEDS_BIRTH_TIME[_.name])
  const otherPoints = visiblePoints.filter((_) => !POINT_NEEDS_BIRTH_TIME[_.name])
  // 並び順は、惑星の位置の表と同じ。同じ黄経のものは、この順に並ぶ
  const bodies: Body[] = [
    ...Object.values(planets).map(toBody),
    ...visibleAsteroids.map(toBody),
    ...otherPoints.map(toBody),
    // NOTE: Asc と Mc は、ハウスの線が位置を示しているときは、引き出し線を引かない。
    // ハウスシステムによっては、ハウスの起点にならない（イコールの Mc、ホールサインの Asc と Mc など）。そのときは、引く
    ...(visibility.ascMc
      ? [
          {
            name: 'ascendant',
            icon: 'Asc',
            position: house.ascendant,
            isRetrograde: false,
            hasLeader: !isOnCusp(house.ascendant),
          },
          { name: 'mc', icon: 'Mc', position: house.mc, isRetrograde: false, hasLeader: !isOnCusp(house.mc) },
        ]
      : []),
    ...localPoints.map(toBody),
  ]
  const shown = spreadLongitudes(
    bodies.map((_) => _.position.longitude),
    MIN_GAP
  )

  return (
    <Stage width={radius * 2} height={radius * 2}>
      <Layer>
        {/* サイン */}
        <SignCircle frame={frame} />
        <SignIcons frame={frame} />

        {/* ハウス */}
        <HouseCircle frame={frame} house={house} />
        <Ticks frame={frame} />

        {/* 惑星、感受点、Asc、Mc */}
        <BodyIcons frame={frame} bodies={bodies.map((body, i) => ({ ...body, shown: shown[i] }))} />
        <AspectLines frame={frame} horoscope={horoscope} settings={settings} />
      </Layer>
    </Stage>
  )
}
