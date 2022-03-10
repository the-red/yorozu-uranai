import { DateTime } from 'luxon'

export class SiderealTime {
  #hour: number
  #minute: number
  #second: number
  constructor(julday_ut: number, armc: number) {
    this.#hour = armc / 15
    this.#minute = (this.#hour * 60) % 60
    this.#second = (this.#minute * 60) % 60
  }

  get dateTime(): DateTime {
    const okinaMegumiBirthday = DateTime.fromISO('1979-08-06T14:55:00+09:00')
    const adjustedDateTime = okinaMegumiBirthday.set({
      hour: Math.trunc(this.#hour),
      second: Math.trunc(this.#second),
      minute: Math.trunc(this.#minute),
    })
    return adjustedDateTime
  }
}
