import { Layer, Rect, Stage, Circle, Ellipse, Line, Text } from 'react-konva'

const text = 'apple pen pine-apple apple pen pine-apple apple pen pine-apple apple pen pine-apple'
export default function HoroscopeCircle() {
  return (
    <Stage width={500} height={500}>
      <Layer>
        {/* 文字 */}
        {/* <Text text={text} x={50} y={50} width={400} fontSize={40} fontFamily={'Calibri'} fill="black" align="left" /> */}
        {/* 四角 */}
        {/* <Rect fill="gray" x={100} y={100} width={300} height={200} /> */}
        {/* 円 */}
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={200} opacity={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={180} opacity={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={100} opacity={1} />
        <Circle stroke="black" strokeWidth={1} fill="white" x={250} y={250} radius={80} opacity={1} />
        {/* 線 */}
        {/* <Line points={[450, 50, 300, 150, 50]} stroke="blue" strokeWidth={8} /> */}
      </Layer>
    </Stage>
  )
}
