import nock from 'nock'
import {
  AmadeusAuthResponse,
  AmadeusHotelOffersResponse
} from '../../../data/usecases/save-hotels/db-save-hotels-protocols'
import env from '../../../main/config/env'

import { AmadeusHttpRepository } from './amadeus-http-repository'

const scope = nock(env.amadeus.host)

const makeSut = (): AmadeusHttpRepository =>
  new AmadeusHttpRepository({
    clientId: 'any_client_id',
    secret: 'any_secret'
  })

const makeFakeAuthResponse = (): AmadeusAuthResponse => ({
  type: 'any_type',
  username: 'any_username',
  application_name: 'any_application_name',
  client_id: 'any_client_id',
  token_type: 'any_token_type',
  access_token: 'any_access_token',
  expires_in: 0,
  state: 'any_state',
  scope: 'any_scope'
})

const makeFakeGetResponse = (): AmadeusHotelOffersResponse => ({
  data: [
    {
      type: 'hotel-offers',
      hotel: {
        type: 'hotel',
        hotelId: 'HSOPOAAI',
        chainCode: 'HS',
        dupeId: '700008717',
        name: 'Internacional',
        rating: '3',
        cityCode: 'OPO',
        latitude: 41.148,
        longitude: -8.612,
        hotelDistance: {
          distance: 0.2,
          distanceUnit: 'KM'
        },
        address: {
          lines: ['RUA DO ALMADA 131'],
          postalCode: '4050-037',
          cityName: 'PORTO',
          countryCode: 'PT'
        },
        contact: {
          phone: '(351) 222005032',
          fax: '(351) 222009063',
          email: 'info@hi-porto.com'
        },
        description: {
          lang: 'en',
          text: 'The hotel Internacional in Oporto occupies a beautiful listed building and enjoys a long tradition. The interior design is characterized by a combination of historical and contemporary elements. Elegant furnished rooms provide all comforts including free Internet access. In the awarded restaurant O Almada and bar with vaulted ceilings, guests enjoy delicious local cuisine.'
        },
        amenities: [
          '24_HOUR_FRONT_DESK',
          'MULTILINGUAL_STAFF',
          'ELEVATOR',
          'RESTAURANT',
          'LOUNGE',
          'CONCIERGE',
          'DRIVING_RANGE',
          'NIGHT_CLUB',
          'INTERNET_SERVICES',
          'WIRELESS_CONNECTIVITY',
          'DOCTOR_ON_CALL',
          'COFFEE_SHOP',
          'CAR_RENTAL',
          'GIFT_SHOP',
          'LAUNDRY_SERVICE',
          'BABY-SITTING',
          'FIRE_DETECTORS',
          'VIDEO_SURVEILANCE'
        ],
        media: [
          {
            uri: 'http://uat.multimediarepository.testing.amadeus.com/cmr/retrieve/hotel/3B92EA59ABDD49B8A59CD9E2BDF07047',
            category: 'EXTERIOR'
          }
        ]
      },
      available: true,
      offers: [
        {
          id: '8ZFM57YF4T',
          checkInDate: '2021-07-23',
          checkOutDate: '2021-07-24',
          rateCode: 'RAC',
          rateFamilyEstimated: {
            code: 'RAC',
            type: 'P'
          },
          commission: {
            percentage: '4.00'
          },
          boardType: 'ROOM_ONLY',
          room: {
            type: 'ROH',
            typeEstimated: {
              category: 'STANDARD_ROOM'
            },
            description: {
              text: 'HRS-Rate\nStandard room A standard room consists of a room with shower-toilet or bathtub-toilet.',
              lang: 'EN'
            }
          },
          guests: {
            adults: 1
          },
          price: {
            currency: 'EUR',
            total: '175.00',
            taxes: [
              {
                code: 'VALUE_ADDED_TAX',
                percentage: '6.00',
                included: true
              }
            ],
            variations: {
              average: {
                total: '175.00'
              },
              changes: [
                {
                  startDate: '2021-07-23',
                  endDate: '2021-07-24',
                  total: '175.00'
                }
              ]
            }
          },
          policies: {
            guarantee: {
              acceptedPayments: {
                creditCards: ['VI', 'MC', 'CA', 'AX'],
                methods: ['CREDIT_CARD']
              }
            },
            paymentType: 'guarantee',
            cancellation: {
              numberOfNights: 1,
              deadline: '2021-07-21T22:59:00+01:00'
            }
          },
          self: 'https://test.api.amadeus.com/v2/shopping/hotel-offers/8ZFM57YF4T'
        }
      ],
      self: 'https://test.api.amadeus.com/v2/shopping/hotel-offers/by-hotel?hotelId=HSOPOAAI'
    }
  ]
})

describe('AmadeusHttpRepository test suite', () => {
  describe('Success cases', () => {
    test('Should Amadeus get hotels', async () => {
      scope
        .post('/v1/security/oauth2/token')
        .reply(200, { ...makeFakeAuthResponse() })
      scope
        .get('/v2/shopping/hotel-offers?cityCode=OPO')
        .reply(200, { ...makeFakeGetResponse() })

      const sut = makeSut()

      const hotels = await sut.get(['OPO'])

      expect(hotels).toHaveLength(1)
      expect(hotels[0].data[0].hotel.hotelId).toBe('HSOPOAAI')
    })

    test('Should Amadeus auth success', async () => {
      scope
        .post('/v1/security/oauth2/token')
        .reply(200, { ...makeFakeAuthResponse() })
      const sut = makeSut()

      await sut.auth()

      expect(sut.amadeusAuth.access_token).toBe('any_access_token')
    })

    test('Should Amadeus auth fail', async () => {
      scope
        .post('/v1/security/oauth2/token')
        .reply(401, { ...makeFakeAuthResponse() })
      const sut = makeSut()

      const promise = sut.auth()

      await expect(promise).rejects.toThrow()
    })

    test('Should Amadeus get hotels before auth', async () => {
      scope
        .post('/v1/security/oauth2/token')
        .reply(200, { ...makeFakeAuthResponse() })
      scope
        .get('/v2/shopping/hotel-offers?cityCode=MCO')
        .reply(200, { ...makeFakeGetResponse() })
      scope
        .post('/v1/security/oauth2/token')
        .reply(200, { ...makeFakeAuthResponse() })
      scope
        .get('/v2/shopping/hotel-offers?cityCode=OPO')
        .reply(200, { ...makeFakeGetResponse() })

      const sut = makeSut()

      await sut.get(['MCO'])
      sut.amadeusAuth = null

      const hotels = await sut.get(['OPO'])

      expect(hotels).toHaveLength(1)
      expect(hotels[0].data[0].hotel.hotelId).toBe('HSOPOAAI')
    })
  })
})
