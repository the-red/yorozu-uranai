import { FixedOffsetZone } from 'luxon'

export const getFixedOffsetZone = (lng: number) => FixedOffsetZone.instance((lng / 360) * 24 * 60)
