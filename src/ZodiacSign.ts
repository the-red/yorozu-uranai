export const ALL_ZODIAC_SIGNS = [
  '牡羊座',
  '牡牛座',
  '双子座',
  '蟹座',
  '獅子座',
  '乙女座',
  '天秤座',
  '蠍座',
  '射手座',
  '山羊座',
  '水瓶座',
  '魚座',
] as const

export type ZodiacSign = typeof ALL_ZODIAC_SIGNS[number]
