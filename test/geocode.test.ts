import { formatAddress } from '../src/pages/api/geocode'
import { GeocodeResult } from '@googlemaps/google-maps-services-js'

describe('geocode', () => {
  it('Geocodeの結果から住所を抽出（日本）', async () => {
    const 神通碧小学校 = [
      {
        address_components: [
          {
            long_name: '４０５',
            short_name: '４０５',
            types: ['premise'],
          },
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
        ],
        formatted_address: '日本、〒939-2184 富山県富山市楡原４０５',
        geometry: {
          location: {
            lat: 36.535858,
            lng: 137.232883,
          },
          location_type: 'ROOFTOP',
          viewport: {
            northeast: {
              lat: 36.5372069802915,
              lng: 137.2342319802915,
            },
            southwest: {
              lat: 36.5345090197085,
              lng: 137.2315340197085,
            },
          },
        },
        place_id: 'ChIJkwA2sfn0918RrSxlOP4arS4',
        plus_code: {
          compound_code: 'G6PM+85 日本、富山県富山市',
          global_code: '8Q8VG6PM+85',
        },
        types: ['establishment', 'point_of_interest', 'primary_school', 'school'],
      },
      {
        address_components: [
          {
            long_name: '４０５',
            short_name: '４０５',
            types: ['premise'],
          },
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
        ],
        formatted_address: '日本、〒939-2184 富山県富山市楡原４０５',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.5359656,
              lng: 137.2337701,
            },
            southwest: {
              lat: 36.5355017,
              lng: 137.2326041,
            },
          },
          location: {
            lat: 36.5356385,
            lng: 137.2329485,
          },
          location_type: 'ROOFTOP',
          viewport: {
            northeast: {
              lat: 36.5370826302915,
              lng: 137.2345360802915,
            },
            southwest: {
              lat: 36.5343846697085,
              lng: 137.2318381197085,
            },
          },
        },
        place_id: 'ChIJZfDFTPj0918RVdjQ2LHq64w',
        types: ['premise'],
      },
      {
        address_components: [
          {
            long_name: '３４０',
            short_name: '３４０',
            types: ['premise'],
          },
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
        ],
        formatted_address: '日本、〒939-2184 富山県富山市楡原３４０',
        geometry: {
          location: {
            lat: 36.5358681,
            lng: 137.2322947,
          },
          location_type: 'ROOFTOP',
          viewport: {
            northeast: {
              lat: 36.5372170802915,
              lng: 137.2336436802915,
            },
            southwest: {
              lat: 36.5345191197085,
              lng: 137.2309457197085,
            },
          },
        },
        place_id: 'ChIJ63pQpfn0918Ry1626AFpd18',
        plus_code: {
          compound_code: 'G6PJ+8W 日本、富山県富山市',
          global_code: '8Q8VG6PJ+8W',
        },
        types: ['street_address'],
      },
      {
        address_components: [
          {
            long_name: 'G6PM+85',
            short_name: 'G6PM+85',
            types: ['plus_code'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'G6PM+85 日本、富山県富山市',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.535875,
              lng: 137.233,
            },
            southwest: {
              lat: 36.53575,
              lng: 137.232875,
            },
          },
          location: {
            lat: 36.535858,
            lng: 137.232883,
          },
          location_type: 'GEOMETRIC_CENTER',
          viewport: {
            northeast: {
              lat: 36.53716148029149,
              lng: 137.2342864802915,
            },
            southwest: {
              lat: 36.5344635197085,
              lng: 137.2315885197085,
            },
          },
        },
        place_id: 'GhIJZaa0_pZEQkARa5kMx3MnYUA',
        plus_code: {
          compound_code: 'G6PM+85 日本、富山県富山市',
          global_code: '8Q8VG6PM+85',
        },
        types: ['plus_code'],
      },
      {
        address_components: [
          {
            long_name: '道路',
            short_name: '道路',
            types: ['route'],
          },
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
        ],
        formatted_address: '日本、〒939-2184 富山県富山市楡原 道路',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.5360039,
              lng: 137.23256,
            },
            southwest: {
              lat: 36.535767,
              lng: 137.2325596,
            },
          },
          location: {
            lat: 36.5358855,
            lng: 137.2325598,
          },
          location_type: 'GEOMETRIC_CENTER',
          viewport: {
            northeast: {
              lat: 36.53723443029151,
              lng: 137.2339087802915,
            },
            southwest: {
              lat: 36.53453646970851,
              lng: 137.2312108197085,
            },
          },
        },
        place_id: 'ChIJfXhdsPn0918RUFr3Q1GXsHE',
        types: ['route'],
      },
      {
        address_components: [
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '日本 〒939-2184',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.5425526,
              lng: 137.2362538,
            },
            southwest: {
              lat: 36.5010454,
              lng: 137.1986826,
            },
          },
          location: {
            lat: 36.5218928,
            lng: 137.2172501,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 36.5425526,
              lng: 137.2362538,
            },
            southwest: {
              lat: 36.5010454,
              lng: 137.1986826,
            },
          },
        },
        place_id: 'ChIJ919X36b1918RfnMPxGi59hw',
        types: ['postal_code'],
      },
      {
        address_components: [
          {
            long_name: '楡原',
            short_name: '楡原',
            types: ['political', 'sublocality', 'sublocality_level_2'],
          },
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
          {
            long_name: '939-2184',
            short_name: '939-2184',
            types: ['postal_code'],
          },
        ],
        formatted_address: '日本、〒939-2184 富山県富山市楡原',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.5425526,
              lng: 137.2362538,
            },
            southwest: {
              lat: 36.5010454,
              lng: 137.1986826,
            },
          },
          location: {
            lat: 36.5218928,
            lng: 137.2172501,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 36.5425526,
              lng: 137.2362538,
            },
            southwest: {
              lat: 36.5010454,
              lng: 137.1986826,
            },
          },
        },
        place_id: 'ChIJMThq-aP1918R9W_G2IyFl2Q',
        types: ['political', 'sublocality', 'sublocality_level_2'],
      },
      {
        address_components: [
          {
            long_name: '富山市',
            short_name: '富山市',
            types: ['locality', 'political'],
          },
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '日本、富山県富山市',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.7658669,
              lng: 137.705447,
            },
            southwest: {
              lat: 36.3698133,
              lng: 137.0281455,
            },
          },
          location: {
            lat: 36.6958223,
            lng: 137.2137211,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 36.7658669,
              lng: 137.705447,
            },
            southwest: {
              lat: 36.3698133,
              lng: 137.0281455,
            },
          },
        },
        place_id: 'ChIJ9WoXGAny918R4x0feZe_Wm0',
        types: ['locality', 'political'],
      },
      {
        address_components: [
          {
            long_name: '富山県',
            short_name: '富山県',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '日本、富山県',
        geometry: {
          bounds: {
            northeast: {
              lat: 36.9826438,
              lng: 137.7633695,
            },
            southwest: {
              lat: 36.2743732,
              lng: 136.7683233,
            },
          },
          location: {
            lat: 36.6958266,
            lng: 137.2137071,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 36.9826438,
              lng: 137.7633695,
            },
            southwest: {
              lat: 36.2743732,
              lng: 136.7683233,
            },
          },
        },
        place_id: 'ChIJSca2CRSS918Rc1GBWMBBk3w',
        types: ['administrative_area_level_1', 'political'],
      },
      {
        address_components: [
          {
            long_name: '日本',
            short_name: 'JP',
            types: ['country', 'political'],
          },
        ],
        formatted_address: '日本',
        geometry: {
          bounds: {
            northeast: {
              lat: 45.6412626,
              lng: 154.0031455,
            },
            southwest: {
              lat: 20.3585295,
              lng: 122.8554688,
            },
          },
          location: {
            lat: 36.204824,
            lng: 138.252924,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 45.6412626,
              lng: 154.0031455,
            },
            southwest: {
              lat: 20.3585295,
              lng: 122.8554688,
            },
          },
        },
        place_id: 'ChIJLxl_1w9OZzQRRFJmfNR1QvU',
        types: ['country', 'political'],
      },
    ] as GeocodeResult[]
    expect(formatAddress(神通碧小学校)).toBe('日本、富山県富山市')
  })
  it('Geocodeの結果から住所を抽出（アメリカ）', async () => {
    const ホワイトハウス = [
      {
        address_components: [
          {
            long_name: '1600',
            short_name: '1600',
            types: ['street_number'],
          },
          {
            long_name: 'Pennsylvania Avenue Northwest',
            short_name: 'Pennsylvania Avenue NW',
            types: ['route'],
          },
          {
            long_name: 'Northwest Washington',
            short_name: 'Northwest Washington',
            types: ['neighborhood', 'political'],
          },
          {
            long_name: 'Washington',
            short_name: 'Washington',
            types: ['locality', 'political'],
          },
          {
            long_name: 'District of Columbia',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
          {
            long_name: '20500',
            short_name: '20500',
            types: ['postal_code'],
          },
        ],
        formatted_address: '1600 Pennsylvania Avenue NW, Washington, DC 20500 アメリカ合衆国',
        geometry: {
          location: {
            lat: 38.8976763,
            lng: -77.0365298,
          },
          location_type: 'ROOFTOP',
          viewport: {
            northeast: {
              lat: 38.8990252802915,
              lng: -77.0351808197085,
            },
            southwest: {
              lat: 38.8963273197085,
              lng: -77.0378787802915,
            },
          },
        },
        place_id: 'ChIJ37HL3ry3t4kRv3YLbdhpWXE',
        plus_code: {
          compound_code: 'VXX7+39 アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
          global_code: '87C4VXX7+39',
        },
        types: ['establishment', 'point_of_interest', 'tourist_attraction'],
      },
      {
        address_components: [
          {
            long_name: '16000',
            short_name: '16000',
            types: ['street_number'],
          },
          {
            long_name: 'Pennsylvania Avenue Northwest',
            short_name: 'Pennsylvania Avenue NW',
            types: ['route'],
          },
          {
            long_name: 'Northwest Washington',
            short_name: 'Northwest Washington',
            types: ['neighborhood', 'political'],
          },
          {
            long_name: 'Washington',
            short_name: 'Washington',
            types: ['locality', 'political'],
          },
          {
            long_name: 'District of Columbia',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
          {
            long_name: '20500',
            short_name: '20500',
            types: ['postal_code'],
          },
        ],
        formatted_address: '16000 Pennsylvania Avenue NW, Washington, DC 20500 アメリカ合衆国',
        geometry: {
          location: {
            lat: 38.8977462,
            lng: -77.0365328,
          },
          location_type: 'ROOFTOP',
          viewport: {
            northeast: {
              lat: 38.8990951802915,
              lng: -77.0351838197085,
            },
            southwest: {
              lat: 38.8963972197085,
              lng: -77.03788178029151,
            },
          },
        },
        place_id: 'ChIJv_BaqSq3t4kR1ZOAN67jtKE',
        plus_code: {
          compound_code: 'VXX7+39 アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
          global_code: '87C4VXX7+39',
        },
        types: ['street_address'],
      },
      {
        address_components: [
          {
            long_name: 'VXX7+39',
            short_name: 'VXX7+39',
            types: ['plus_code'],
          },
          {
            long_name: 'ワシントンD.C.',
            short_name: 'ワシントンD.C.',
            types: ['locality', 'political'],
          },
          {
            long_name: 'District of Columbia',
            short_name: 'District of Columbia',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'コロンビア特別区',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'VXX7+39 アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.89774999999999,
              lng: -77.03649999999999,
            },
            southwest: {
              lat: 38.897625,
              lng: -77.036625,
            },
          },
          location: {
            lat: 38.8976763,
            lng: -77.0365298,
          },
          location_type: 'GEOMETRIC_CENTER',
          viewport: {
            northeast: {
              lat: 38.89903648029149,
              lng: -77.03521351970849,
            },
            southwest: {
              lat: 38.89633851970849,
              lng: -77.0379114802915,
            },
          },
        },
        place_id: 'GhIJeHKXDudyQ0ARFRUWgVZCU8A',
        plus_code: {
          compound_code: 'VXX7+39 アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
          global_code: '87C4VXX7+39',
        },
        types: ['plus_code'],
      },
      {
        address_components: [
          {
            long_name: 'Unnamed Road',
            short_name: 'Unnamed Road',
            types: ['route'],
          },
          {
            long_name: 'Northwest Washington',
            short_name: 'Northwest Washington',
            types: ['neighborhood', 'political'],
          },
          {
            long_name: 'Washington',
            short_name: 'Washington',
            types: ['locality', 'political'],
          },
          {
            long_name: 'District of Columbia',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
          {
            long_name: '20500',
            short_name: '20500',
            types: ['postal_code'],
          },
        ],
        formatted_address: 'Unnamed Road, Washington, DC 20500 アメリカ合衆国',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.8979698,
              lng: -77.0362682,
            },
            southwest: {
              lat: 38.8979451,
              lng: -77.03658530000001,
            },
          },
          location: {
            lat: 38.89795,
            lng: -77.0364258,
          },
          location_type: 'GEOMETRIC_CENTER',
          viewport: {
            northeast: {
              lat: 38.8993064302915,
              lng: -77.03507776970851,
            },
            southwest: {
              lat: 38.8966084697085,
              lng: -77.03777573029153,
            },
          },
        },
        place_id: 'ChIJgbXI4ry3t4kRxEmOU2Dkmjg',
        types: ['route'],
      },
      {
        address_components: [
          {
            long_name: '20500',
            short_name: '20500',
            types: ['postal_code'],
          },
          {
            long_name: 'ノースウェスト・ワシントン',
            short_name: 'ノースウェスト・ワシントン',
            types: ['neighborhood', 'political'],
          },
          {
            long_name: 'ワシントンD.C.',
            short_name: 'ワシントンD.C.',
            types: ['locality', 'political'],
          },
          {
            long_name: 'コロンビア特別区',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'アメリカ合衆国 〒20500 コロンビア特別区 ワシントンD.C.',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.8980424,
              lng: -77.03527249999999,
            },
            southwest: {
              lat: 38.8970971,
              lng: -77.0378229,
            },
          },
          location: {
            lat: 38.8975003,
            lng: -77.0364766,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 38.8989187302915,
              lng: -77.03519871970848,
            },
            southwest: {
              lat: 38.8962207697085,
              lng: -77.0378966802915,
            },
          },
        },
        place_id: 'ChIJM98wTKK3t4kRCRVem9SdMqs',
        types: ['postal_code'],
      },
      {
        address_components: [
          {
            long_name: 'ノースウェスト・ワシントン',
            short_name: 'ノースウェスト・ワシントン',
            types: ['neighborhood', 'political'],
          },
          {
            long_name: 'ワシントンD.C.',
            short_name: 'ワシントンD.C.',
            types: ['locality', 'political'],
          },
          {
            long_name: '7',
            short_name: '7',
            types: ['administrative_area_level_3', 'political'],
          },
          {
            long_name: 'コロンビア特別区',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'アメリカ合衆国 コロンビア特別区 ワシントンD.C. ノースウェスト・ワシントン',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.9955566,
              lng: -77.0060597,
            },
            southwest: {
              lat: 38.8891955,
              lng: -77.1197502,
            },
          },
          location: {
            lat: 38.9380912,
            lng: -77.04493269999999,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 38.9955566,
              lng: -77.0060597,
            },
            southwest: {
              lat: 38.8891955,
              lng: -77.1197502,
            },
          },
        },
        place_id: 'ChIJi7U4CaS3t4kR0m_KoPJ00Bw',
        types: ['neighborhood', 'political'],
      },
      {
        address_components: [
          {
            long_name: 'ワシントンD.C.',
            short_name: 'ワシントンD.C.',
            types: ['locality', 'political'],
          },
          {
            long_name: 'District of Columbia',
            short_name: 'District of Columbia',
            types: ['administrative_area_level_2', 'political'],
          },
          {
            long_name: 'コロンビア特別区',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.9958641,
              lng: -76.909393,
            },
            southwest: {
              lat: 38.7916449,
              lng: -77.119759,
            },
          },
          location: {
            lat: 38.9071923,
            lng: -77.0368707,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 38.9958641,
              lng: -76.909393,
            },
            southwest: {
              lat: 38.7916449,
              lng: -77.119759,
            },
          },
        },
        place_id: 'ChIJW-T2Wt7Gt4kRKl2I1CJFUsI',
        types: ['locality', 'political'],
      },
      {
        address_components: [
          {
            long_name: 'コロンビア特別区',
            short_name: 'DC',
            types: ['administrative_area_level_1', 'political'],
          },
          {
            long_name: 'ワシントンD.C.',
            short_name: 'ワシントンD.C.',
            types: ['locality', 'political'],
          },
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'アメリカ合衆国 コロンビア特別区 ワシントンD.C.',
        geometry: {
          bounds: {
            northeast: {
              lat: 38.995845,
              lng: -76.909393,
            },
            southwest: {
              lat: 38.791645,
              lng: -77.119759,
            },
          },
          location: {
            lat: 38.9059849,
            lng: -77.03341790000002,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 38.995845,
              lng: -76.909393,
            },
            southwest: {
              lat: 38.791645,
              lng: -77.119759,
            },
          },
        },
        place_id: 'ChIJW-T2Wt7Gt4kRmKFUAsCO4tY',
        types: ['administrative_area_level_1', 'political'],
      },
      {
        address_components: [
          {
            long_name: 'アメリカ合衆国',
            short_name: 'US',
            types: ['country', 'political'],
          },
        ],
        formatted_address: 'アメリカ合衆国',
        geometry: {
          bounds: {
            northeast: {
              lat: 74.071038,
              lng: -66.885417,
            },
            southwest: {
              lat: 18.7763,
              lng: 166.9999999,
            },
          },
          location: {
            lat: 37.09024,
            lng: -95.712891,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 74.071038,
              lng: -66.885417,
            },
            southwest: {
              lat: 18.7763,
              lng: 166.9999999,
            },
          },
        },
        place_id: 'ChIJCzYy5IS16lQRQrfeQ5K5Oxw',
        types: ['country', 'political'],
      },
    ] as GeocodeResult[]
    expect(formatAddress(ホワイトハウス)).toBe('アメリカ合衆国 コロンビア特別区 ワシントンD.C.')
  })
})
