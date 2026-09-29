import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join, relative, resolve } from 'path'
import ts from 'typescript'

// ブラウザに配信するコードに、サーバーでしか動かないものが入っていないことを確かめる
//
// swisseph はネイティブアドオンなので、ブラウザでは動かない。
// ページから import をたどって swisseph に届くと、ビルドは通っても、ブラウザで動かなくなる。
//
// NOTE: 型だけを使うときは `import type` と書く。
// `import { Daiun } from './Daiun'` のように書くと、型しか使っていなくても、ここでは読み込むものとして数える

const ROOT = resolve(__dirname, '..')
const SRC = join(ROOT, 'src')

const toRelative = (file: string) => relative(ROOT, file)

// 実行時に読み込む import の一覧（型だけの import は除く）
const getImports = (file: string): string[] => {
  const kind = file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, kind)
  const imports: string[] = []

  const visit = (node: ts.Node) => {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const clause = node.importClause
      const bindings = clause?.namedBindings
      const isTypeOnly =
        clause?.isTypeOnly ||
        // import { type A, type B } from '...'
        (clause !== undefined &&
          clause.name === undefined &&
          bindings !== undefined &&
          ts.isNamedImports(bindings) &&
          bindings.elements.length > 0 &&
          bindings.elements.every((_) => _.isTypeOnly))
      if (!isTypeOnly) imports.push(node.moduleSpecifier.text)
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      if (!node.isTypeOnly) imports.push(node.moduleSpecifier.text)
    } else if (ts.isCallExpression(node)) {
      // import('...') と require('...')
      const isImport = node.expression.kind === ts.SyntaxKind.ImportKeyword
      const isRequire = ts.isIdentifier(node.expression) && node.expression.text === 'require'
      const [argument] = node.arguments
      if ((isImport || isRequire) && argument && ts.isStringLiteral(argument)) imports.push(argument.text)
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  return imports
}

// 相対パスの import を、ファイルにする。TypeScript のファイルでなければ undefined（画像やCSSなど）
const resolveFile = (from: string, specifier: string): string | undefined => {
  const base = resolve(dirname(from), specifier)
  const candidates = [base, `${base}.ts`, `${base}.tsx`, join(base, 'index.ts'), join(base, 'index.tsx')]
  return candidates.find((_) => /\.tsx?$/.test(_) && existsSync(_) && statSync(_).isFile())
}

// パッケージの名前（'next/router' → 'next'、'@scope/name/path' → '@scope/name'）
const toPackage = (specifier: string) =>
  specifier
    .split('/')
    .slice(0, specifier.startsWith('@') ? 2 : 1)
    .join('/')

type Reached = Map<string, string[]> // 届いたファイルやパッケージと、そこまでの経路

// 入口のファイルから、import をたどる
const walk = (entry: string): Reached => {
  const reached: Reached = new Map([[entry, [toRelative(entry)]]])
  const queue = [entry]
  while (queue.length > 0) {
    const file = queue.shift()!
    const path = reached.get(file)!
    for (const specifier of getImports(file)) {
      if (specifier.startsWith('.')) {
        const resolved = resolveFile(file, specifier)
        if (resolved && !reached.has(resolved)) {
          reached.set(resolved, [...path, toRelative(resolved)])
          queue.push(resolved)
        }
      } else {
        const name = toPackage(specifier)
        if (!reached.has(name)) reached.set(name, [...path, name])
      }
    }
  }
  return reached
}

// ディレクトリの中の、TypeScript のファイル
const listFiles = (dir: string): string[] =>
  readdirSync(dir, { withFileTypes: true }).flatMap((_) =>
    _.isDirectory() ? listFiles(join(dir, _.name)) : /\.tsx?$/.test(_.name) ? [join(dir, _.name)] : []
  )

const API = join(SRC, 'pages', 'api')
const pages = listFiles(join(SRC, 'pages')).filter((_) => !_.startsWith(API))
const apis = listFiles(API)

// サーバーでしか動かないもの（表示する名前と、届いたかを調べるときのキー）
// NOTE: ファイルは、絶対パスで記録している
const ASTRONOMY = join(SRC, 'astronomy', 'index.ts')
const SERVER_ONLY = [
  ['swisseph', 'swisseph'],
  ['@googlemaps/google-maps-services-js', '@googlemaps/google-maps-services-js'],
  [toRelative(ASTRONOMY), ASTRONOMY],
]

describe('ブラウザに配信するコード', () => {
  it('すべてのページを調べている', () => {
    expect(pages.map(toRelative).sort()).toEqual([
      'src/pages/_app.tsx',
      'src/pages/_document.tsx',
      'src/pages/horoscope.tsx',
      'src/pages/index.tsx',
      'src/pages/map.tsx',
      'src/pages/numerology.tsx',
      'src/pages/suimei.tsx',
      'src/pages/suimei/saiun.tsx',
    ])
  })

  describe.each(pages.map((_) => [toRelative(_), _]))('%s', (_name, page) => {
    const reached = walk(page)

    it.each(SERVER_ONLY)('%s を読み込まない', (_name, key) => {
      // 失敗したときに、どこから読み込んでいるかが分かるように、経路を出す
      expect(reached.get(key)?.join(' → ')).toBeUndefined()
    })
    it('APIのファイルを読み込まない', () => {
      const files = [...reached.keys()].filter((_) => _.startsWith(API)).map((_) => reached.get(_)!.join(' → '))
      expect(files).toEqual([])
    })
  })
})

describe('調べ方の確認', () => {
  // NOTE: たどり方が壊れていると、上のテストは何も見つけずに通ってしまう
  it('天文計算を使うAPIからは、サーバーでしか動かないものに届く', () => {
    const names = ['horoscope.ts', 'suimei.ts']
    for (const api of apis.filter((_) => names.some((name) => _.endsWith(`/api/${name}`)))) {
      expect(walk(api).get('swisseph'), toRelative(api)).toBeDefined()
      expect(walk(api).get(ASTRONOMY), toRelative(api)).toBeDefined()
    }
    expect(walk(join(API, 'geocode.ts')).get('@googlemaps/google-maps-services-js')).toBeDefined()
    expect(apis.map(toRelative)).toEqual(expect.arrayContaining(names.map((_) => `src/pages/api/${_}`)))
  })
  it('経路を返す', () => {
    expect(walk(join(API, 'horoscope.ts')).get('swisseph')).toEqual([
      'src/pages/api/horoscope.ts',
      'src/horoscope/models/horoscopeFactory.ts',
      'src/astronomy/index.ts',
      'swisseph',
    ])
  })
  it('ページからは、モデルと部品に届く', () => {
    const reached = walk(join(SRC, 'pages', 'suimei.tsx'))
    expect([...reached.keys()].map(toRelative)).toEqual(
      expect.arrayContaining([
        'src/suimei/models/index.ts',
        'src/suimei/models/Kanshi.ts',
        'src/suimei/models/json.ts',
        'src/suimei/components/SuimeiContent.tsx',
        'src/lib/fetch-suimei.ts',
        'src/lib/fetch-json.ts',
      ])
    )
    expect(reached.size).toBeGreaterThan(20)
  })
  it('型だけの import は、たどらない', () => {
    // json.ts は、Daiun の型だけを使っている。Daiun.ts は SekkiUtil.ts（天文計算）を読み込む
    const reached = walk(join(SRC, 'suimei', 'models', 'json.ts'))
    expect(reached.has(join(SRC, 'suimei', 'models', 'Daiun.ts'))).toEqual(false)
    expect(walk(join(SRC, 'suimei', 'models', 'Daiun.ts')).has('swisseph')).toEqual(true)
  })
})
