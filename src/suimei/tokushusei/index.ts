import { Kanshi } from '../Kanshi'
import 日干と支 from './nikkan-shi'
import 月支と干支 from './gesshi-kanshi'
import 月支と支 from './gesshi-shi'
import 年支日支と支 from './nenshi_nisshi-shi'
import 日柱 from './nicchuu'

export const tokushusei = (kanshi: Kanshi) => {
  const tokushuseiMap: {
    年柱: string[]
    月柱: string[]
    日柱: string[]
    時柱: string[]
  } = {
    年柱: [],
    月柱: [],
    日柱: [],
    時柱: [],
  }

  const types = ['年', '月', '日', '時'] as const

  Object.entries(日干と支).forEach(([name, rule]) => {
    types.forEach((type) => {
      const list = rule[kanshi.日干]
      if (list.includes(kanshi[`${type}支`])) {
        tokushuseiMap[`${type}柱`].push(name)
      }
    })
  })
  Object.entries(月支と干支).forEach(([name, rule]) => {
    types.forEach((type) => {
      const list = rule[kanshi.月支]
      if (list.includes(kanshi[`${type}干`]) || list.includes(kanshi[`${type}支`])) {
        tokushuseiMap[`${type}柱`].push(name)
      }
    })
  })
  Object.entries(月支と支).forEach(([name, rule]) => {
    types.forEach((type) => {
      const list = rule[kanshi.月支]
      if (list.includes(kanshi[`${type}支`])) {
        tokushuseiMap[`${type}柱`].push(name)
      }
    })
  })
  Object.entries(年支日支と支).forEach(([name, rule]) => {
    types.forEach((type) => {
      const list = [...rule[kanshi.年支], ...rule[kanshi.日支]]
      if (list.includes(kanshi[`${type}支`])) {
        tokushuseiMap[`${type}柱`].push(name)
      }
    })
  })
  Object.entries(日柱).forEach(([name, list]) => {
    if (list.includes(kanshi.日柱)) {
      tokushuseiMap.日柱.push(name)
    }
  })

  return tokushuseiMap
}
