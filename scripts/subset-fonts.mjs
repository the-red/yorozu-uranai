// 決まった文言にしか使わないフォントを、ソースコードに出てくる文字だけに絞る（サブセット化）
//
// 使い方: yarn fonts（yarn build と yarn dev の中でも実行される）
//
// 元のフォント（fonts/）から、src/ に出てくる文字だけを取り出して、public/fonts/ に書き出す。
// 書き出したファイルは、コミットしない。文言を変えるたびに中身が変わり、ブランチの間で競合するため
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'fs'
import { dirname, extname, join } from 'path'
import { fileURLToPath } from 'url'
import subsetFont from 'subset-font'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
export const SOURCE_DIR = join(ROOT, 'fonts')
export const OUTPUT_DIR = join(ROOT, 'public', 'fonts')
const TEXT_DIR = join(ROOT, 'src')
const TEXT_EXTENSIONS = ['.ts', '.tsx', '.css', '.json']

// NOTE: 住所や、利用者が入力した文字を表示する場所のフォントは、ここに入れない。
// どの文字が来るか分からないので、絞ると、その文字だけ別のフォントで表示される
export const FONTS = [
  // 四柱推命の見出し（h3）
  { source: 'YujiSyuku-Regular.ttf', output: 'YujiSyuku-Regular.subset.woff2' },
  // 四柱推命の命式の表、送信ボタン、エラーの文章
  { source: 'ZenOldMincho-Bold.ttf', output: 'ZenOldMincho-Bold.subset.woff2' },
]

// 著作権表示（0）と、ライセンス（13, 14）を残す。指定しないと、取り除かれる
const NAME_IDS = [0, 13, 14]

// 数字や記号は、計算結果として表示されるので、ソースコードに無くても入れる
const ASCII = Array.from({ length: 0x7e - 0x20 + 1 }, (_, i) => String.fromCodePoint(0x20 + i))

const listFiles = (dir) =>
  readdirSync(dir)
    .sort()
    .flatMap((name) => {
      const file = join(dir, name)
      if (statSync(file).isDirectory()) return listFiles(file)
      return TEXT_EXTENSIONS.includes(extname(name)) ? [file] : []
    })

// フォントに入れる文字の一覧。画面に出る文言だけを選ぶことはせず、ソースコードの文字をすべて入れる
export const collectChars = () => {
  const chars = new Set(ASCII)
  for (const file of listFiles(TEXT_DIR)) {
    for (const char of readFileSync(file, 'utf8')) {
      // 改行などの制御文字は、字形が無い
      if (char.codePointAt(0) > 0x20) chars.add(char)
    }
  }
  return [...chars].sort((a, b) => a.codePointAt(0) - b.codePointAt(0))
}

export const createSubset = (source, chars = collectChars()) =>
  subsetFont(readFileSync(join(SOURCE_DIR, source)), chars.join(''), {
    targetFormat: 'woff2',
    preserveNameIds: NAME_IDS,
    // NOTE: グリフの名前を残す。取り除くと、Mac の Chrome で、18px 以下の文字の描画が、元とわずかに変わる
    // （字形と幅は同じでも、輪郭を画素に合わせる処理の結果が変わる）
    glyphNames: true,
  })

const main = async () => {
  const chars = collectChars()
  console.info(`src/ に出てくる文字: ${chars.length} 種類`)

  for (const { source, output } of FONTS) {
    const subset = await createSubset(source, chars)
    const file = join(OUTPUT_DIR, output)
    // 同じ内容なら、書き込まない（開発中に、ファイルの変更として検知されないように）
    const changed = !existsSync(file) || !readFileSync(file).equals(subset)
    if (changed) writeFileSync(file, subset)
    const before = statSync(join(SOURCE_DIR, source)).size
    console.info(`${output}: ${before} → ${subset.length} バイト（${changed ? '書き出した' : '変更なし'}）`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error)
    process.exit(1)
  })
}
