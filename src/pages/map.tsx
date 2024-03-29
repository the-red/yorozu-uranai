// NOTE: Google公式のReactサンプルをベースに作成
// https://developers.google.com/maps/documentation/javascript/react-map?hl=ja
import * as React from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { NextPage } from 'next'
import { TOKYO_STATION } from '../lib/location'
import { roundLatLng } from '../lib/math'
import { useRouter } from 'next/router'
import { getCurrentLocation } from '../lib/location'
import { staticPath } from '../lib/$path'
import Image from 'next/image'
import { fetchAddressFromLatLng } from '../lib/fetch-geocode'

type LatLng = { lat: number; lng: number }
export type OptionalQuery = Partial<LatLng>

const render = (status: Status) => {
  return <h1>{status}</h1>
}

interface MapProps extends google.maps.MapOptions {
  onClick?: (e: google.maps.MapMouseEvent) => void
  onIdle?: (map: google.maps.Map) => void
  children?: React.ReactNode
}

const geocode = async (...props: Parameters<google.maps.Geocoder['geocode']>) => {
  const geocoder = new window.google.maps.Geocoder()
  return geocoder.geocode(...props)
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, children, ...options }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new google.maps.Map(ref.current, {}))
    }
  }, [ref, map])

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options)
    }
  }, [map, options])

  React.useEffect(() => {
    if (map) {
      ;['click', 'idle'].forEach((eventName) => google.maps.event.clearListeners(map, eventName))

      if (onClick) {
        map.addListener('click', onClick)
      }

      if (onIdle) {
        map.addListener('idle', () => onIdle(map))
      }
    }
  }, [map, onClick, onIdle])

  return (
    <div className="map_area">
      <div ref={ref} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map })
        }
      })}
    </div>
  )
}

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>()

  React.useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker())
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null)
      }
    }
  }, [marker])

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options)
    }
  }, [marker, options])

  return null
}

// @ts-expect-error
const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (a: any, b: any) => {
  if (isLatLngLiteral(a) || a instanceof google.maps.LatLng || isLatLngLiteral(b) || b instanceof google.maps.LatLng) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b))
  }

  // TODO extend to other types

  // use fast-equals for other objects
  // @ts-expect-error
  return deepEqual(a, b)
})

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef()

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value
  }

  return ref.current
}

function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: any[]) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

const MapPage: NextPage = () => {
  const [pinned, setPinned] = React.useState<LatLng>()
  const [center, setCenter] = React.useState<LatLng>()
  const [zoom, setZoom] = React.useState(14)
  const [info, setInfo] = React.useState<string>('')
  const addressInput = React.useRef<HTMLInputElement>(null)

  const updateAddress = async ({ lat, lng }: LatLng) => {
    const address = await fetchAddressFromLatLng(lat, lng)
    setInfo(address)
  }

  const setMapLocation = (latlng: LatLng) => {
    setPinned(latlng)
    setCenter(latlng)
  }

  const router = useRouter()
  React.useEffect(() => {
    if (router.isReady) {
      const defaultLocation =
        router.query.lat && router.query.lng
          ? { lat: Number(router.query.lat), lng: Number(router.query.lng) }
          : TOKYO_STATION

      setMapLocation(defaultLocation)
    }
  }, [router])
  if (!pinned || !center) return <div>loading...</div>

  const onClickMarker = async (event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) => {
    // avoid directly mutating state
    const lat = roundLatLng(event.latLng!.lat())
    const lng = roundLatLng(event.latLng!.lng())
    setPinned({ lat, lng })

    try {
      // ピンの位置を元に住所を検索
      const address = await fetchAddressFromLatLng(lat, lng)
      setInfo(address)
    } catch (e) {
      const error = e as google.maps.MapsNetworkError
      setInfo(`ERROR: ${error.message}`)
    }
  }

  const onIdleMarker = (m: google.maps.Map) => {
    console.info('onIdle')
    setZoom(m.getZoom()!)
    const center = m.getCenter()!
    setCenter(center.toJSON())
    if (pinned?.lat === center?.lat() && pinned?.lng === center?.lng()) {
      updateAddress(pinned)
    }
  }

  const form = (
    <div className="search_area">
      <div className="search_area_inner">
        <form>
          <div className="search_groupe">
            <input ref={addressInput} type="text" id="address" name="address" placeholder="住所から検索する" />
            <button
              className="search_button"
              type="submit"
              onClick={async (e) => {
                e.preventDefault()
                const address = addressInput.current?.value
                if (!address) return

                try {
                  const { results } = await geocode({ address })
                  const [result] = results
                  const [lat, lng] = [
                    roundLatLng(result.geometry.location.lat()),
                    roundLatLng(result.geometry.location.lng()),
                  ]
                  setPinned({ lat, lng })
                  setCenter({ lat, lng })
                  setZoom(17)
                } catch (e) {
                  const error = e as google.maps.MapsNetworkError
                  if (error.code === 'ZERO_RESULTS' || error.message === 'No result') {
                    setInfo('該当の住所が見つかりませんでした。')
                  } else {
                    setInfo(error.message)
                  }
                }
              }}
            >
              <Image src={staticPath.images.map.search_svg} alt="検索" width={24} height={24} />
            </button>
          </div>
          <button
            type="button"
            className="current_location_button"
            onClick={async () => {
              try {
                const latlng = await getCurrentLocation()
                setMapLocation(latlng)
                await updateAddress(latlng)
              } catch (e) {
                const error = e as Error
                alert(error.message)
              }
            }}
          >
            <Image src={staticPath.images.map.current_location_svg} alt="現在地取得アイコン" width={24} height={24} />
          </button>
        </form>
        <button
          className="confirm_button"
          onClick={() => {
            const setLocation = window?.opener?.setLocation
            if (setLocation && setLocation(pinned.lat, pinned.lng)) {
              window.close()
            } else {
              console.error({ opener: window?.opener, setLocation })
              alert('緯度経度が確定できませんでした。')
            }
          }}
        >
          確定して戻る
        </button>
        <div className="search_result">
          <div className="lat">
            <label htmlFor="lat">緯度</label>
            <input
              type="number"
              id="lat"
              name="lat"
              step="0.0000001"
              min="-90"
              max="90"
              value={pinned.lat}
              onChange={(event) => {
                const [lat, lng] = [Number(event.target.value), pinned.lng]
                setMapLocation({ lat, lng })
              }}
            />
          </div>
          <div className="lng">
            <label htmlFor="lng">経度</label>
            <input
              type="number"
              id="lng"
              name="lng"
              step="0.0000001"
              min="-180"
              max="180"
              value={pinned.lng}
              onChange={(event) => {
                const [lat, lng] = [pinned.lat, Number(event.target.value)]
                setMapLocation({ lat, lng })
              }}
            />
          </div>
          <div className="search_result_address">{` ${info}`}</div>
        </div>
        {/* .search_resultの終了タグ */}
      </div>
      {/* .search_area_innerの終了タグ */}
    </div>
    // .search_areaの終了タグ
  )

  return (
    <div className="map">
      {form}
      {/* NOTE: Wrapperコンポーネントを呼ぶとwindow.google.mapsがグローバルに設定される */}
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} render={render}>
        <Map center={center} onClick={onClickMarker} onIdle={onIdleMarker} zoom={zoom}>
          <Marker position={pinned} />
        </Map>
      </Wrapper>
    </div>
  )
}

export default MapPage
