import hepburn from 'hepburn'

type kana2romaji = {
  [key: string]: string
}

export const convertHiraganaToRomagi = (target: string): string => hepburn.fromKana(target)
