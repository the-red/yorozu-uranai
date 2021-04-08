import { ZodiacSign } from './ZodiacSign'

export const ALL_PLANETS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const

export type Planet = typeof ALL_PLANETS[number]
export type PlanetPosition = Record<Planet, ZodiacSign>
