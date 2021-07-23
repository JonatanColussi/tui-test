import { parseISO } from 'date-fns'
import { DbSaveHotels } from './db-save-hotels'
import {
  Offer,
  HotelModel,
  OffersModel,
  AmadeusHotelModel,
  AddHotelsRepository,
  AmadeusHotelOffersResponse,
  AmadeusHotelOffersRepository
} from './db-save-hotels-protocols'

const makeFakeAmadeusHotelsResponse = (): AmadeusHotelOffersResponse[] => [
  {
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
  }
]

const makeAmadeusHotelOffersRepository = (): AmadeusHotelOffersRepository => {
  class AmadeusHotelOffersRepositoryStub
  implements AmadeusHotelOffersRepository {
    async get (cityCode: string[]): Promise<AmadeusHotelOffersResponse[]> {
      return new Promise((resolve) => resolve(makeFakeAmadeusHotelsResponse()))
    }
  }

  return new AmadeusHotelOffersRepositoryStub()
}

const makeAddHotelsRepository = (): AddHotelsRepository => {
  class AddHotelsRepositoryStub implements AddHotelsRepository {
    async add (hotels: HotelModel[]): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }

  return new AddHotelsRepositoryStub()
}

interface SutTypes {
  sut: DbSaveHotels
  amadeusHotelOffersRepositoryStub: AmadeusHotelOffersRepository
  addHotelsRepositoryStub: AddHotelsRepository
}

const makeSut = (): SutTypes => {
  const amadeusHotelOffersRepositoryStub = makeAmadeusHotelOffersRepository()
  const addHotelsRepositoryStub = makeAddHotelsRepository()

  const sut = new DbSaveHotels(
    amadeusHotelOffersRepositoryStub,
    addHotelsRepositoryStub
  )

  return {
    sut,
    amadeusHotelOffersRepositoryStub,
    addHotelsRepositoryStub
  }
}

describe('DbSaveHotels amadeusHotelOffersRepository edge cases', () => {
  test('Should throw if amadeusHotelOffersRepository throws', async () => {
    const { sut, amadeusHotelOffersRepositoryStub } = makeSut()
    jest
      .spyOn(amadeusHotelOffersRepositoryStub, 'get')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(['OPO'])
    await expect(promise).rejects.toThrow()
  })

  test('Should call amadeusHotelOffersRepository with correct params', async () => {
    const {
      sut,
      amadeusHotelOffersRepositoryStub
    } = makeSut()

    const getSpy = jest.spyOn(amadeusHotelOffersRepositoryStub, 'get')

    await sut.add(['OPO'])
    expect(getSpy).toHaveBeenCalledWith(['OPO'])
  })
})

describe('DbSaveHotels addHotelsRepository edge cases', () => {
  test('Should throw if addHotelsRepository throws', async () => {
    const { sut, addHotelsRepositoryStub } = makeSut()
    jest
      .spyOn(addHotelsRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.add(['OPO'])
    await expect(promise).rejects.toThrow()
  })

  test('Should call addHotelsRepository with correct params', async () => {
    const { sut, addHotelsRepositoryStub } = makeSut()
    const authSpy = jest.spyOn(addHotelsRepositoryStub, 'add')

    const amadeusHotels: AmadeusHotelOffersResponse[] =
      makeFakeAmadeusHotelsResponse()

    const dataForInsert: HotelModel[] = amadeusHotels
      .map(({ data }: AmadeusHotelOffersResponse): HotelModel[] => {
        return data.map((hotel: AmadeusHotelModel): HotelModel => {
          return {
            type: hotel.hotel.type,
            hotelId: hotel.hotel.hotelId,
            chainCode: hotel.hotel.chainCode,
            dupeId: hotel.hotel.dupeId,
            name: hotel.hotel.name,
            rating: hotel.hotel.rating,
            cityCode: hotel.hotel.cityCode,
            latitude: hotel.hotel.latitude,
            longitude: hotel.hotel.longitude,
            address: hotel.hotel.address,
            contact: hotel.hotel.contact,
            description: hotel.hotel.description,
            amenities: hotel.hotel.amenities,
            media: hotel.hotel.media,
            available: hotel.available,
            offers: hotel.offers.map(
              (offer: Offer): OffersModel => ({
                id: offer.id,
                checkInDate: parseISO(offer.checkInDate),
                checkOutDate: parseISO(offer.checkOutDate),
                boardType: offer.boardType,
                typeEstimated: offer.room.typeEstimated.category,
                roomDescription: offer.room.description.text,
                price: Number.parseFloat(offer.price.total),
                currency: offer.price.currency
              })
            )
          }
        })
      })
      .flat()

    await sut.add(['OPO'])

    expect(authSpy).toHaveBeenCalledWith(dataForInsert)
  })

  test('Should throw if addHotelsRepository return false', async () => {
    const { sut, addHotelsRepositoryStub } = makeSut()
    jest
      .spyOn(addHotelsRepositoryStub, 'add')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => resolve(false))
      )
    const promise = sut.add(['OPO'])
    await expect(promise).rejects.toThrow()
  })
})

describe('DbSaveHotels UseCase works correctely', () => {
  test('should return true on add', async () => {
    const { sut } = makeSut()
    const inserted = await sut.add(['OPO'])
    expect(inserted).toEqual(true)
  })
})
