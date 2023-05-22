import { Kanshi } from '../Kanshi'
import 日干と支 from './nikkan-shi'
import 日干と日支 from './nikkan-nisshi'
import 月支と干支 from './gesshi-kanshi'
import 月支と支 from './gesshi-shi'
import 年支日支と支 from './nenshi_nisshi-shi'
import 日柱 from './nicchuu'

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
  Object.entries(月支と支).forEach(([name, rule]) => {
    if (kanshi.地支.some((shi) => rule[kanshi.月支].includes(shi))) {
      tokushuseiList.push(name)
    }
  })
  Object.entries(年支日支と支).forEach(([name, rule]) => {
    if (kanshi.地支.some((shi) => rule[kanshi.年支].includes(shi) || rule[kanshi.日支].includes(shi))) {
      tokushuseiList.push(name)
    }
  })
  Object.entries(日柱).forEach(([name, rule]) => {
    if (rule.includes(kanshi.日柱)) {
      tokushuseiList.push(name)
    }
  })

  return tokushuseiList
}
