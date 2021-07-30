import { Layer, Rect, Stage, Circle, Ellipse, Line, Text } from 'react-konva'

export default function HoroscopeCircle() {
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
        <Line points={[250, 250, 250, 50]} stroke="#afb1b1" strokeWidth={1} />
        <Line points={[250, 250, 450, 250]} stroke="#afb1b1" strokeWidth={1} />
        <Line points={[250, 250, 250, 450]} stroke="#afb1b1" strokeWidth={1} />
        <Line points={[250, 250, 50, 250]} stroke="#afb1b1" strokeWidth={1} />
        <Circle stroke="#afb1b1" strokeWidth={1} fill="white" x={250} y={250} radius={80} opacity={1} />
        {/* 星座 */}
        <Text text="♈" x={200} y={50} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♉" x={100} y={100} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♊" x={50} y={200} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♋" x={50} y={300} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♌" x={100} y={400} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♍" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♎" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♏" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♐" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♑" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♒" x={200} y={450} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♓" x={250} y={50} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        {/* 惑星 */}
        {/*TODO: 自動的に配置 */}
        <Text text="☉" x={200} y={100} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
        <Text text="♅" x={300} y={100} fontSize={20} fontFamily={'Calibri'} fill="black" align="left" />
      </Layer>
    </Stage>
  )
}
