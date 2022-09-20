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

export type EclipticPosition = {
  latitude: number
  latitudeSpeed: number
  longitude: number
  longitudeSpeed: number
  distance: number
  distanceSpeed: number
  rflag: number
  isRetrograde: boolean // trueなら逆行
  error?: any
}

export type HouseCusps = number[]

export type Houses = {
  house: HouseCusps
  ascendant: number
  mc: number
  armc: number
  vertex: number
  equatorialAscendant: number
  kochCoAscendant: number
  munkaseyCoAscendant: number
  munkaseyPolarAscendant: number
  error?: any
}
