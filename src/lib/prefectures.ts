import { IMPERIAL_PALACE } from './location'

type LatLng = { lat: number; lng: number }

// 都道府県庁の位置。都道府県を選んだときに、出生場所として使う
// 出典: 国土地理院「都道府県の庁舎及び東西南北端点の経緯度（世界測地系）」。秒までの値を、度に直して、小数第4位に丸めた
// NOTE: 岐阜県は、2023年に移った、今の庁舎の位置
export const PREFECTURES = [
  { name: '北海道', lat: 43.0642, lng: 141.3467 }, // 札幌市
  { name: '青森県', lat: 40.8242, lng: 140.74 }, // 青森市
  { name: '岩手県', lat: 39.7033, lng: 141.1525 }, // 盛岡市
  { name: '宮城県', lat: 38.2689, lng: 140.8719 }, // 仙台市
  { name: '秋田県', lat: 39.7186, lng: 140.1022 }, // 秋田市
  { name: '山形県', lat: 38.2403, lng: 140.3633 }, // 山形市
  { name: '福島県', lat: 37.75, lng: 140.4675 }, // 福島市
  { name: '茨城県', lat: 36.3417, lng: 140.4467 }, // 水戸市
  { name: '栃木県', lat: 36.5656, lng: 139.8836 }, // 宇都宮市
  { name: '群馬県', lat: 36.3911, lng: 139.0608 }, // 前橋市
  { name: '埼玉県', lat: 35.8569, lng: 139.6489 }, // さいたま市
  { name: '千葉県', lat: 35.6044, lng: 140.1231 }, // 千葉市
  { name: '東京都', lat: 35.6892, lng: 139.6917 }, // 新宿区
  { name: '神奈川県', lat: 35.4478, lng: 139.6425 }, // 横浜市
  { name: '新潟県', lat: 37.9022, lng: 139.0231 }, // 新潟市
  { name: '富山県', lat: 36.695, lng: 137.2111 }, // 富山市
  { name: '石川県', lat: 36.5944, lng: 136.6256 }, // 金沢市
  { name: '福井県', lat: 36.065, lng: 136.2217 }, // 福井市
  { name: '山梨県', lat: 35.6639, lng: 138.5683 }, // 甲府市
  { name: '長野県', lat: 36.6511, lng: 138.1808 }, // 長野市
  { name: '岐阜県', lat: 35.3912, lng: 136.7237 }, // 岐阜市
  { name: '静岡県', lat: 34.9767, lng: 138.3831 }, // 静岡市
  { name: '愛知県', lat: 35.1803, lng: 136.9067 }, // 名古屋市
  { name: '三重県', lat: 34.7303, lng: 136.5083 }, // 津市
  { name: '滋賀県', lat: 35.0042, lng: 135.8681 }, // 大津市
  { name: '京都府', lat: 35.0211, lng: 135.7556 }, // 京都市
  { name: '大阪府', lat: 34.6864, lng: 135.52 }, // 大阪市
  { name: '兵庫県', lat: 34.6911, lng: 135.1831 }, // 神戸市
  { name: '奈良県', lat: 34.6853, lng: 135.8328 }, // 奈良市
  { name: '和歌山県', lat: 34.2258, lng: 135.1672 }, // 和歌山市
  { name: '鳥取県', lat: 35.5033, lng: 134.2381 }, // 鳥取市
  { name: '島根県', lat: 35.4722, lng: 133.0503 }, // 松江市
  { name: '岡山県', lat: 34.6617, lng: 133.935 }, // 岡山市
  { name: '広島県', lat: 34.3964, lng: 132.4594 }, // 広島市
  { name: '山口県', lat: 34.1856, lng: 131.4714 }, // 山口市
  { name: '徳島県', lat: 34.0656, lng: 134.5592 }, // 徳島市
  { name: '香川県', lat: 34.34, lng: 134.0431 }, // 高松市
  { name: '愛媛県', lat: 33.8417, lng: 132.7658 }, // 松山市
  { name: '高知県', lat: 33.5594, lng: 133.5308 }, // 高知市
  { name: '福岡県', lat: 33.6064, lng: 130.4181 }, // 福岡市
  { name: '佐賀県', lat: 33.2492, lng: 130.2986 }, // 佐賀市
  { name: '長崎県', lat: 32.75, lng: 129.8672 }, // 長崎市
  { name: '熊本県', lat: 32.7894, lng: 130.7417 }, // 熊本市
  { name: '大分県', lat: 33.2381, lng: 131.6125 }, // 大分市
  { name: '宮崎県', lat: 31.9108, lng: 131.4239 }, // 宮崎市
  { name: '鹿児島県', lat: 31.5603, lng: 130.5581 }, // 鹿児島市
  { name: '沖縄県', lat: 26.2122, lng: 127.6808 }, // 那覇市
] as const satisfies readonly ({ name: string } & LatLng)[]

// 選択欄の値。都道府県は、名前をそのまま使う
export const NOT_SELECTED = ''
export const FROM_MAP = 'map'

const isSame = (a: LatLng, b: LatLng) => a.lat === b.lat && a.lng === b.lng

// 緯度経度から、選択欄の値を求める
// NOTE: URLには、緯度経度だけを持たせている。都道府県庁とも、皇居とも違う場所は、地図で選んだものとして扱う
export const toPlace = (latLng: LatLng): string => {
  if (isSame(latLng, IMPERIAL_PALACE)) {
    return NOT_SELECTED
  }
  return PREFECTURES.find((_) => isSame(_, latLng))?.name ?? FROM_MAP
}

// 選択欄の値から、緯度経度を求める。地図で選んだ場所は、ここでは決まらないので undefined
export const toLatLng = (place: string): LatLng | undefined => {
  if (place === NOT_SELECTED) {
    return IMPERIAL_PALACE
  }
  const prefecture = PREFECTURES.find((_) => _.name === place)
  return prefecture && { lat: prefecture.lat, lng: prefecture.lng }
}
