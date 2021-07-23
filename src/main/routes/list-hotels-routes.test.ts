import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let hotelsCollection: Collection

describe('List Hotels Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    hotelsCollection = await MongoHelper.getCollection('hotels')
    await hotelsCollection.deleteMany({})

    hotelsCollection.insertOne({
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
  })

  describe('POST /hotels', () => {
    test('Should return 200 on save hotels from Amadeus', async () => {
      await request(app)
        .get('/hotels?cityCode=OPO')
        .send()
        .expect(200)
        .expect((res) => {
          const {
            body: { data }
          } = res

          expect(data).toHaveLength(1)
          expect(data[0].hotelId).toBe('HSOPOAAI')
        })
    })
  })
})
