import { describe, it, expect, beforeAll } from 'vitest'
import { existsSync, readFileSync, readdirSync } from 'fs'
import { join, resolve } from 'path'
import * as fontkit from 'fontkit'
import { FONTS, OUTPUT_DIR, SOURCE_DIR, collectChars, createSubset } from '../scripts/subset-fonts.mjs'

// 文字を絞ったフォント（サブセット）が、元のフォントと同じ表示になることを確かめる
//
// フォントに無い文字や、読み込めなかったフォントは、別のフォントで表示される。
// エラーにならないので、気づきにくい

const STYLES = resolve(__dirname, '../src/styles')

const codePoint = (char: string) => char.codePointAt(0)!
const glyph = (font: fontkit.Font, char: string) => font.glyphForCodePoint(codePoint(char))

describe.each(FONTS)('$output', ({ source }) => {
  const original = fontkit.openSync(join(SOURCE_DIR, source)) as fontkit.Font
  // NOTE: 元のフォントに無い文字（惑星の記号など）は、絞る前から、別のフォントで表示されている
  const chars = collectChars().filter((_) => original.hasGlyphForCodePoint(codePoint(_)))
  let subset: fontkit.Font

  beforeAll(async () => {
    subset = fontkit.create(await createSubset(source)) as fontkit.Font
  })

  it('ソースコードに出てくる文字が、すべて入っている', () => {
    // 漢字が1つも無ければ、文字の集め方が壊れている
    expect(chars).toContain('命')
    expect(chars.filter((_) => !subset.hasGlyphForCodePoint(codePoint(_)))).toEqual([])
  })

  it('字形と文字の幅が、元のフォントと同じ', () => {
    const different = chars.filter(
      (_) =>
        glyph(subset, _).advanceWidth !== glyph(original, _).advanceWidth ||
        glyph(subset, _).path.toSVG() !== glyph(original, _).path.toSVG()
    )
    expect(different).toEqual([])
  })

  // グリフの名前が無いと、Mac の Chrome で、小さい文字の描画が、元とわずかに変わる
  it('グリフの名前が、元のフォントと同じ', () => {
    expect(glyph(original, '命').name).toMatch(/\S/)
    expect(chars.filter((_) => glyph(subset, _).name !== glyph(original, _).name)).toEqual([])
  })

  it('行の高さを決める値が、元のフォントと同じ', () => {
    const metrics = ({ unitsPerEm, ascent, descent, lineGap, capHeight, xHeight }: fontkit.Font) => ({
      unitsPerEm,
      ascent,
      descent,
      lineGap,
      capHeight,
      xHeight,
    })
    expect(metrics(subset)).toEqual(metrics(original))
  })

  it('使わない文字は、入っていない', () => {
    expect(subset.numGlyphs).toBeLessThan(original.numGlyphs / 5)
  })
})

describe('CSS が参照するフォント', () => {
  const urls = readdirSync(STYLES)
    .filter((_) => _.endsWith('.css'))
    .flatMap((_) => [...readFileSync(join(STYLES, _), 'utf8').matchAll(/url\('\/fonts\/([^']+)'\)/g)])
    .map((_) => _[1])
  // サブセットは、ビルドのときに作る。リポジトリには無い
  const generated = FONTS.map((_) => _.output)

  it('CSS が、フォントを参照している', () => {
    expect(urls.length).toBeGreaterThan(0)
    expect(urls).toEqual(expect.arrayContaining(generated))
  })

  it.each(urls)('%s が、リポジトリにあるか、ビルドのときに作られる', (url) => {
    expect(generated.includes(url) || existsSync(join(OUTPUT_DIR, url))).toBe(true)
  })
})
