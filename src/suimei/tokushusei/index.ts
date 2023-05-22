import { Kanshi } from '../Kanshi'
import 日干と支 from './nikkan-shi'

export const tokushusei = (kanshi: Kanshi) => {
  const tokushuseiList: string[] = []

  Object.entries(日干と支).forEach(([name, rule]) => {
    if (kanshi.地支.some((shi) => rule[kanshi.日干].includes(shi))) {
      tokushuseiList.push(name)
    }
  })

  return tokushuseiList
}
