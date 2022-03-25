// VercelがNode.js v16に対応するまで
// このPolyfillを当ててArray#at()が使えるようにする
// https://github.com/tc39/proposal-relative-indexing-method#polyfill

function at(n: number) {
  // ToInteger() abstract op
  n = Math.trunc(n) || 0
  // Allow negative indexing from the end
  // @ts-expect-error
  if (n < 0) n += this.length
  // OOB access is guaranteed to return undefined
  // @ts-expect-error
  if (n < 0 || n >= this.length) return undefined
  // Otherwise, this is just normal property access
  // @ts-expect-error
  return this[n]
}

const TypedArray = Reflect.getPrototypeOf(Int8Array)
for (const C of [Array, String, TypedArray]) {
  // @ts-expect-error
  Object.defineProperty(C.prototype, 'at', { value: at, writable: true, enumerable: false, configurable: true })
}

export {}
