import hepburn from 'hepburn'

type kana2romaji = {
  [key: string]: string
}

export const convertKanaToRomaji = (target?: string): string => hepburn.fromKana((target ?? '').replace(/\s/g, ' '))
