const rounddown = (value: number, scale: number) => Math.trunc(value * 10 ** scale) / 10 ** scale
export const roundLatLng = (value: number) => rounddown(value, 7)
