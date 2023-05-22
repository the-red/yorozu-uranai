import type { 十二支, 十干 } from '../Kanshi'

const 日干と日支: Record<string, Record<十干, 十二支[]>> = {
  日刃: {
    甲: ['卯'],
    乙: ['辰'],
    丙: ['午'],
    丁: ['未'],
    戊: ['午'],
    己: ['未'],
    庚: ['酉'],
    辛: ['戌'],
    壬: ['子'],
    癸: ['丑'],
  },
}

export default 日干と日支
