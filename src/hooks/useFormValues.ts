import { DateTime } from 'luxon'
import type { NextRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import { DEFAULT_HOUSE_SYSTEM } from '../horoscope/models/HouseSystem'
import { TOKYO_STATION } from '../lib/location'
import { queryToFormValues, FORM_DATE_FORMAT, FORM_TIME_FORMAT, FORM_QUERY_KEYS } from '../lib/params'
import type { FormValues } from './useYorozuUranaiForm'
import { fetchAddressFromLatLng } from '../lib/fetch-geocode'

export const useFormValues = (setFormValues: Dispatch<SetStateAction<FormValues | undefined>>, router: NextRouter) => {
  // 直前の画面の移動が、入力を変えないもの（shallow か、ハッシュだけの変更）だったか
  const shallow = useRef(false)
  // 読み取り済みの入力
  const loaded = useRef<string>(undefined)
  useEffect(() => {
    const onRouteStart = (_url: string, { shallow: isShallow }: { shallow: boolean }) => {
      shallow.current = isShallow
    }
    const onHashStart = () => {
      shallow.current = true
    }
    router.events.on('routeChangeStart', onRouteStart)
    router.events.on('hashChangeStart', onHashStart)
    return () => {
      router.events.off('routeChangeStart', onRouteStart)
      router.events.off('hashChangeStart', onHashStart)
    }
  }, [router.events])

  useEffect(() => {
    const setDefaultFormValues = async () => {
      if (router.isReady) {
        // 入力が変わらない移動（画面の設定の変更など）では、読み直さない。
        // 読み直すと、住所の検索と、結果の取得が走る
        // NOTE: 同じ入力でも、フォームを送信したとき（shallow でない）は、読み直す。失敗のあとの再試行のため
        const key = JSON.stringify(FORM_QUERY_KEYS.map((_) => router.query[_] ?? null))
        if (shallow.current && loaded.current === key) {
          return
        }
        loaded.current = key

        const f = queryToFormValues(router.query)
        const now = DateTime.local({ zone: f.zone })
        const zone = now.zoneName

        let date: string
        let time: string | undefined
        let timeUnknown: boolean = f.timeUnknown

        if (f.date && f.time) {
          date = f.date
          time = f.time
        } else if (f.date && !f.time) {
          // NOTE: クエリで日付だけ指定の場合は、timeUnknownとして扱う
          date = f.date
          timeUnknown = true
        } else if (!f.date && f.time) {
          date = now.toFormat(FORM_DATE_FORMAT)
          time = f.time
        } else {
          date = now.toFormat(FORM_DATE_FORMAT)
          time = now.toFormat(FORM_TIME_FORMAT)
        }

        if (timeUnknown || !time) {
          timeUnknown = true
          time = '12:00'
        }

        const defaultLocation = TOKYO_STATION
        const lat = f.lat === undefined ? defaultLocation.lat : f.lat
        const lng = f.lng === undefined ? defaultLocation.lng : f.lng
        const address = await fetchAddressFromLatLng(lat, lng)

        const gender = f.gender ?? 'woman'

        const house = f.house ?? DEFAULT_HOUSE_SYSTEM

        setFormValues({ ...f, date, time, zone, timeUnknown, lat, lng, address, gender, house })
      }
    }
    setDefaultFormValues()
  }, [router, setFormValues])
}
