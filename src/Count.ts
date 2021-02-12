export class Count {
  readonly value: number

  constructor(value: string | number) {
    this.value = Number(value)
  }

  twice() {
    return this.value * 2
  }
}
