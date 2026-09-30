import { Position } from './Position'
import type { Houses } from '../../astronomy/types'

type HouseCusps = Position[]

export class House {
  constructor(readonly raw: Houses) {}

  get ascendant(): Position {
    return new Position(this.raw.ascendant)
  }

  get mc(): Position {
    return new Position(this.raw.mc)
  }

  get cusps(): HouseCusps {
    return this.raw.house.map((_) => new Position(_))
  }

  // 惑星が入っているハウス
  // NOTE: カスプとちょうど同じ黄経は、サインの境界（Position.sign）と同じく、そこから始まるハウスに入れる
  where(longitude: number): number | undefined {
    const { cusps } = this
    for (let i = 0; i < cusps.length; i++) {
      const start = cusps[i].longitude
      const end = (cusps[i + 1] ?? cusps[0]).longitude

      // 黄経0度をまたぐハウスでも比べられるように、ハウスの始まりからの角度に直す
      const width = angleFrom(start, end)
      const angle = angleFrom(start, longitude)
      if (angle < width) {
        return i + 1
      }
    }
  }
}

// start から longitude までの、黄経が増える向きの角度（0〜360度）
export const angleFrom = (start: number, longitude: number) => (((longitude - start) % 360) + 360) % 360
