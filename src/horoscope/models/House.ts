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

  where(longitude: number): number | undefined {
    for (let i = 0; i < this.cusps.length; i++) {
      const start = this.cusps[i].longitude
      let end = this.cusps[i + 1]?.longitude || this.cusps[0].longitude
      if (start > end) {
        end += 360
      }
      if (start < longitude && longitude <= end) {
        return i + 1
      }
    }
  }
}
