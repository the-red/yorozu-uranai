import type { FormValues } from '../hooks/useYorozuUranaiForm'
import type { ErrorJson } from './json-api'
import { formValuesToQuery } from './params'

export class JsonApiError extends Error {
  constructor(readonly error: ErrorJson['error']) {
    super(error.message)
  }
}

type Pathname = '/horoscope' | '/suimei'

export const toJsonUrl = (pathname: Pathname, formValues: FormValues, extra: Record<string, string> = {}): string => {
  const query = {
    ...(formValuesToQuery(formValues) as Record<string, string>),
    // NOTE: formValuesToQueryは 0 を省くので、緯度と経度は別に付ける
    lat: String(formValues.lat),
    lng: String(formValues.lng),
    ...extra,
  }
  return `${pathname}.json?${new URLSearchParams(query)}`
}

export const fetchJson = async <T>(
  pathname: Pathname,
  formValues: FormValues,
  extra: Record<string, string> = {}
): Promise<T> => {
  const res = await fetch(toJsonUrl(pathname, formValues, extra))
  if (res.ok) {
    return res.json()
  }

  const text = await res.text()
  let error: ErrorJson['error'] | undefined
  try {
    error = (JSON.parse(text) as ErrorJson).error
  } catch {
    // JSONでない応答（サーバーの障害など）
  }
  throw error ? new JsonApiError(error) : new Error(text)
}

// エラーの内容と、利用者への案内
export const toErrorGuide = (e: unknown): string => {
  if (!(e instanceof JsonApiError)) {
    return e instanceof Error ? e.message : String(e)
  }

  const { code, message, params } = e.error
  const guides = [
    params.some((_) => ['date', 'time', 'zone'].includes(_)) && '生年月日を修正してください。',
    params.some((_) => ['lat', 'lng'].includes(_)) && '出生場所を修正してください。',
    code === 'calculation_failed' && '生年月日か出生場所を修正してください。',
  ].filter(Boolean)
  return [message, ...guides].join('\n')
}
