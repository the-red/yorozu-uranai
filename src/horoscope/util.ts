export const formatDegrees = (degrees: number) => {
  const degreesInt = Math.trunc(degrees)
  const degreesStr = `${String(degreesInt).padStart(2)}°`

  const MINUTE = 60
  const degreesMin = (degrees - degreesInt) * MINUTE
  const degreesMinInt = Math.trunc(degreesMin)
  const degreesMinStr = `${String(degreesMinInt).padStart(2, '0')}′`

  const degreesSec = (degreesMin - degreesMinInt) * MINUTE
  const degreesSecInt = Math.round(degreesSec)
  const degreesSecStr = `${String(degreesSecInt).padStart(2, '0')}″`

  return degreesStr + degreesMinStr + degreesSecStr
}
