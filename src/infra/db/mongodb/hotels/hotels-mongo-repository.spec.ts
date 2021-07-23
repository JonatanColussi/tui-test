import { MongoHelper } from '../helpers/mongo-helper'
import { HotelsMongoRepository } from './hotels-mongo-repository'
import { Collection } from 'mongodb'

let hotelsCollection: Collection

describe('Account Mongo Repository', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    hotelsCollection = await MongoHelper.getCollection('hotels')

    await hotelsCollection.deleteMany({})
  })

  const makeSut = (): HotelsMongoRepository => {
    return new HotelsMongoRepository()
  }

  test('Should save hotels in database', async () => {
    const sut = makeSut()

    const inserted = await sut.add([
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

    expect(inserted).toBe(true)

    const consult = await hotelsCollection.find({}).toArray()

    expect(consult).toHaveLength(1)
    expect(consult[0].hotelId).toBe('HSOPOAAI')
  })

  test('should get hotels with all filters', async () => {
    const sut = makeSut()

    await hotelsCollection.insertOne({
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
    })

    const consult = await sut.list({
      name: 'Internacional',
      priceStart: 100,
      priceEnd: 200,
      cityCode: 'OPO'
    })

    expect(consult).toHaveLength(1)
    expect(consult[0].hotelId).toBe('HSOPOAAI')
  })

  test('should get hotels with only priceEnd filter', async () => {
    const sut = makeSut()

    await hotelsCollection.insertOne({
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
    })

    const consult = await sut.list({ priceEnd: 200 })

    expect(consult).toHaveLength(1)
    expect(consult[0].hotelId).toBe('HSOPOAAI')
  })

  test('should get hotels with only priceStart filter', async () => {
    const sut = makeSut()

    await hotelsCollection.insertOne({
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
    })

    const consult = await sut.list({ priceStart: 100 })

    expect(consult).toHaveLength(1)
    expect(consult[0].hotelId).toBe('HSOPOAAI')
  })
})
