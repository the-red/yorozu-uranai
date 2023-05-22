import { Kanshi } from '../Kanshi'
import 日干と支 from './nikkan-shi'
import 日干と日支 from './nikkan-nisshi'
import 月支と干支 from './gesshi-kanshi'

export const tokushusei = (kanshi: Kanshi) => {
  const tokushuseiList: string[] = []

  Object.entries(日干と支).forEach(([name, rule]) => {
    if (kanshi.地支.some((shi) => rule[kanshi.日干].includes(shi))) {
      tokushuseiList.push(name)
    }
  })
  Object.entries(日干と日支).forEach(([name, rule]) => {
    if (rule[kanshi.日干].includes(kanshi.日支)) {
      tokushuseiList.push(name)
    }
  })
  Object.entries(月支と干支).forEach(([name, rule]) => {
    const tenkanChishi = [...kanshi.天干, ...kanshi.地支]
    if (tenkanChishi.some((shi) => rule[kanshi.月支].includes(shi))) {
      tokushuseiList.push(name)
    }
  })

  return tokushuseiList
}
