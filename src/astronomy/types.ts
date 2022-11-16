import type { swe_houses, swe_calc_ut } from 'swisseph'

export type PlanetName =
  | 'sun'
  | 'moon'
  | 'mercury'
  | 'venus'
  | 'mars'
  | 'jupiter'
  | 'saturn'
  | 'uranus'
  | 'neptune'
  | 'pluto'

export type EclipticPosition = Extract<ReturnType<typeof swe_calc_ut>, { longitude: number }> & {
  isRetrograde: boolean // trueなら逆行
}

export type HouseCusps = number[]

export type Houses = Extract<ReturnType<typeof swe_houses>, { house: HouseCusps }>
