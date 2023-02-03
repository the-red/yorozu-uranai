import { roundLatLng } from './math'

export const imperialPalaceLocation = {
  // 皇居
  lat: 35.685175,
  lng: 139.7527995,
} as const

// 参考: https://syncer.jp/how-to-use-geolocation-api
export const getCurrentLocation = (): Promise<{ lat: number; lng: number }> =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject()
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        return resolve({ lat: roundLatLng(latitude), lng: roundLatLng(longitude) })
      },
      (error) => {
        // エラーコード(error.code)の番号
        // 0:UNKNOWN_ERROR				原因不明のエラー
        // 1:PERMISSION_DENIED			利用者が位置情報の取得を許可しなかった
        // 2:POSITION_UNAVAILABLE		電波状況などで位置情報が取得できなかった
        // 3:TIMEOUT					位置情報の取得に時間がかかり過ぎた…
        const errorInfo = [
          '原因不明のエラーが発生しました。',
          '位置情報の取得が許可されませんでした。',
          '電波状況などで位置情報が取得できませんでした。',
          '位置情報の取得に時間がかかり過ぎてタイムアウトしました。',
        ]
        const errorNo = error.code
        const errorMessage = '[エラー番号: ' + errorNo + ']\n' + errorInfo[errorNo]
        return reject(errorMessage)
      },
      {
        enableHighAccuracy: false,
        timeout: 8000,
        maximumAge: 2000,
      }
    )
  })
