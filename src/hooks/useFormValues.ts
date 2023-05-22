import { DateTime } from 'luxon'
import type { NextRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { reverseGeocodeByLatLng } from '../lib/geocode'
import { TOKYO_STATION } from '../lib/location'
import { queryToFormValues, FORM_DATE_FORMAT, FORM_TIME_FORMAT } from '../lib/params'
import { getFixedOffsetZone } from '../lib/zone'
import type { FormValues } from './useYorozuUranaiForm'

export const useFormValues = (setFormValues: Dispatch<SetStateAction<FormValues | undefined>>, router: NextRouter) => {
  useEffect(() => {
    const setDefaultFormValues = async () => {
      if (router.isReady) {
        const f = queryToFormValues(router.query)

        const defaultLocation = TOKYO_STATION
        const lat = f.lat === undefined ? defaultLocation.lat : f.lat
        const lng = f.lng === undefined ? defaultLocation.lng : f.lng

        const address = await reverseGeocodeByLatLng({ lat, lng })
        const zone = getFixedOffsetZone(lng)
        const now = DateTime.local({ zone })

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

        const gender = f.gender ?? ''

        setFormValues({ ...f, date, time, zone: zone.name, timeUnknown, lat, lng, address, gender })
      }
    }
    setDefaultFormValues()
  }, [router])
}
