import * as React from 'react'
import { Wrapper, Status } from '@googlemaps/react-wrapper'
import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { NextPage } from 'next'
import { defaultLocation } from '../lib/location'
import { rounddown } from '../lib/math'

const render = (status: Status) => {
  return <h1>{status}</h1>
}

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string }
  onClick?: (e: google.maps.MapMouseEvent) => void
  onIdle?: (map: google.maps.Map) => void
  children?: React.ReactNode
}

const Map: React.FC<MapProps> = ({ onClick, onIdle, children, style, ...options }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const [map, setMap] = React.useState<google.maps.Map>()

  React.useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}))
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
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          // @ts-ignore
          return React.cloneElement(child, { map })
        }
      })}
    </>
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
  const [pinned, setPinned] = React.useState<google.maps.LatLngLiteral>(defaultLocation)
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>(defaultLocation)
  const [zoom, setZoom] = React.useState(14)
  const addressInput = React.useRef<HTMLInputElement>(null)

  const onClickMarker = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    const lat = rounddown(e.latLng!.lat(), 7)
    const lng = rounddown(e.latLng!.lng(), 7)
    setPinned({ lat, lng })
  }

  const onIdleMarker = (m: google.maps.Map) => {
    console.info('onIdle')
    setZoom(m.getZoom()!)
    setCenter(m.getCenter()!.toJSON())
  }

  const form = (
    <div
      style={{
        padding: '1rem',
        // flexBasis: '200px',
        // width: '100%',
        // overflow: 'auto',
      }}
    >
      <p>
        <label htmlFor="lat"> 緯度 </label>
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
            setPinned({ lat, lng })
            setCenter({ lat, lng })
          }}
        />
        <label htmlFor="lng"> 経度 </label>
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
            setPinned({ lat, lng })
            setCenter({ lat, lng })
          }}
        />
      </p>
      <p>
        <label htmlFor="zoom"> Zoom </label>
        <input
          type="number"
          id="zoom"
          name="zoom"
          value={zoom}
          onChange={(event) => setZoom(Number(event.target.value))}
        />
      </p>

      <form>
        <label htmlFor="address"> 住所 </label>
        <input ref={addressInput} type="text" id="address" name="address" />
        <button
          type="submit"
          onClick={async (e) => {
            e.preventDefault()
            const address = addressInput.current?.value
            if (!address) return

            const geocoder = new window.google.maps.Geocoder()
            try {
              const { results } = await geocoder.geocode({ address })
              const [result] = results
              const [lat, lng] = [result.geometry.location.lat(), result.geometry.location.lng()]
              setPinned({ lat, lng })
              setCenter({ lat, lng })
              setZoom(17)
            } catch {
              alert('該当の住所が見つかりませんでした。')
            }
          }}
        >
          検索
        </button>
      </form>

      <button
        onClick={() => {
          const { setLocation } = window.opener
          const succeeded = setLocation(pinned.lat, pinned.lng)
          if (succeeded) {
            window.close()
          } else {
            alert('緯度経度が確定できませんでした。')
          }
        }}
      >
        確定
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
      {form}
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} render={render}>
        <Map
          center={center}
          onClick={onClickMarker}
          onIdle={onIdleMarker}
          zoom={zoom}
          style={{ flexGrow: '1', height: '100%' }}
        >
          <Marker position={pinned} />
        </Map>
      </Wrapper>
    </div>
  )
}

export default MapPage
