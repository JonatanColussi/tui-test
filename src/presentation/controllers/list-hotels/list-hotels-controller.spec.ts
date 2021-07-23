import { ListHotelsController } from './list-hotels-controller'
import { ServerError } from '../../errors'
import { HotelFilters, ListHotels } from './list-hotels-controller-protocols'
import { HttpRequest } from '../../protocols'
import { serverError, badRequest } from '../../helpers/http/http-helper'
import { HotelModel } from '../../../data/usecases/list-hotels/db-list-hotels-protocols'

const makeListHotels = (): ListHotels => {
  class ListHotelsStub implements ListHotels {
    list (filters: HotelFilters): Promise<HotelModel[]> {
      return new Promise((resolve) => resolve([
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
      ]))
    }
  }
  return new ListHotelsStub()
}

const makeFakeRequest = (): HttpRequest => ({
  query: {
    name: 'Internacional',
    priceStart: 100,
    priceEnd: 200,
    cityCode: 'OPO'
  }
})

interface SutTypes {
  sut: ListHotelsController
  listHotelsStub: ListHotels
}

const makeSut = (): SutTypes => {
  const listHotelsStub = makeListHotels()

  const sut = new ListHotelsController(listHotelsStub)

  return {
    sut,
    listHotelsStub
  }
}

describe('listHotels Controller', () => {
  test('Should return 500 if listHotels throws', async () => {
    const { sut, listHotelsStub } = makeSut()
    jest.spyOn(listHotelsStub, 'list').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 400 if listHotels throws', async () => {
    const { sut, listHotelsStub } = makeSut()
    jest.spyOn(listHotelsStub, 'list').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => resolve(null))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error('Fail to get hotels list')))
  })

  test('Should call listHotels with correct values', async () => {
    const { sut, listHotelsStub } = makeSut()
    const listSpy = jest.spyOn(listHotelsStub, 'list')
    await sut.handle(makeFakeRequest())
    expect(listSpy).toHaveBeenCalledWith(makeFakeRequest().query)
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body.data).toHaveLength(1)
    expect(httpResponse.body.data[0].hotelId).toBe('HSOPOAAI')
  })
})
