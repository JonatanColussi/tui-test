import { DbListHotels } from './db-list-hotels'
import {
  HotelModel,
  ListHotelsRepository,
  HotelFilters
} from './db-list-hotels-protocols'

const makeListHotelsRepository = (): ListHotelsRepository => {
  class ListHotelsRepositoryStub implements ListHotelsRepository {
    list (filters: HotelFilters): Promise<HotelModel[]> {
      return new Promise((resolve) =>
        resolve([
          {
            type: 'hotel',
            hotelId: 'HSOPOAAI',
            chainCode: 'HS',
            dupeId: '700008717',
            name: 'Internacional',
            rating: '3',
            cityCode: 'OPO',
            latitude: 41.148,
            longitude: -8.612,
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
            ],
            available: true,
            offers: [
              {
                id: '8ZFM57YF4T',
                checkInDate: new Date(),
                checkOutDate: new Date(),
                boardType: 'ROOM_ONLY',
                typeEstimated: 'STANDARD_ROOM',
                roomDescription:
                  'HRS-Rate\nStandard room A standard room consists of a room with shower-toilet or bathtub-toilet.',
                price: 175,
                currency: 'EUR'
              }
            ]
          }
        ])
      )
    }
  }

  return new ListHotelsRepositoryStub()
}

interface SutTypes {
  sut: DbListHotels
  listHotelsRepositoryStub: ListHotelsRepository
}

const makeSut = (): SutTypes => {
  const listHotelsRepositoryStub = makeListHotelsRepository()

  const sut = new DbListHotels(listHotelsRepositoryStub)

  return {
    sut,
    listHotelsRepositoryStub
  }
}

describe('DbListHotels listHotelsRepository edge cases', () => {
  test('Should throw if listHotelsRepository throws', async () => {
    const { sut, listHotelsRepositoryStub } = makeSut()
    jest
      .spyOn(listHotelsRepositoryStub, 'list')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promise = sut.list({})
    await expect(promise).rejects.toThrow()
  })

  test('Should call listHotelsRepository with correct params', async () => {
    const { sut, listHotelsRepositoryStub } = makeSut()
    const authSpy = jest.spyOn(listHotelsRepositoryStub, 'list')

    await sut.list({ name: 'any_name' })

    expect(authSpy).toHaveBeenCalledWith({ name: 'any_name' })
  })

  test('Should throw if listHotelsRepository return false', async () => {
    const { sut, listHotelsRepositoryStub } = makeSut()
    jest
      .spyOn(listHotelsRepositoryStub, 'list')
      .mockReturnValueOnce(new Promise((resolve, reject) => resolve(null)))
    const promise = sut.list({})
    await expect(promise).rejects.toThrow()
  })
})

describe('DbListHotels UseCase works correctely', () => {
  test('should return true on add', async () => {
    const { sut } = makeSut()
    const hotels = await sut.list({})
    expect(hotels).toHaveLength(1)
    expect(hotels[0].hotelId).toBe('HSOPOAAI')
  })
})
