import { createCustomEqual } from 'fast-equals'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'

// NOTE: Google公式のReactサンプルをベースに作成
// https://developers.google.com/maps/documentation/javascript/react-map?hl=ja

const isLatLng = (value: unknown): value is google.maps.LatLng | google.maps.LatLngLiteral =>
  isLatLngLiteral(value) || value instanceof google.maps.LatLng

const areLatLngsEqual = (a: any, b: any) => new google.maps.LatLng(a).equals(new google.maps.LatLng(b))

// 入れ子になった値の比較
const deepEqual = createCustomEqual({
  createInternalComparator: (compare) => (a, b, _indexOrKeyA, _indexOrKeyB, _parentA, _parentB, state) =>
    isLatLng(a) || isLatLng(b) ? areLatLngsEqual(a, b) : compare(a, b, state),
})

// 緯度経度は、LatLngのインスタンスでも { lat, lng } でも同じ位置なら等しいとみなす。それ以外は深い比較
export const deepCompareEqualsForMaps = (a: unknown, b: unknown): boolean =>
  isLatLng(a) || isLatLng(b) ? areLatLngsEqual(a, b) : deepEqual(a, b)
