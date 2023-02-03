const round = (value: number, scale: number) => Math.round(value * 10 ** scale) / 10 ** scale
export const roundLatLng = (value: number) => round(value, 7)
