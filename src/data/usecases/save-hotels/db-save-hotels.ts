import { parseISO } from 'date-fns'

import {
  Offer,
  AddHotels,
  HotelModel,
  OffersModel,
  AmadeusHotelModel,
  AddHotelsRepository,
  AmadeusHotelOffersResponse,
  AmadeusHotelOffersRepository
} from './db-save-hotels-protocols'

export class DbSaveHotels implements AddHotels {
  constructor (
    private readonly amadeusHotelOffersRepository: AmadeusHotelOffersRepository,
    private readonly addHotelsRepository: AddHotelsRepository
  ) {}

  async add (cityCodes: string[]): Promise<boolean> {
    const amadeusAllResponses: AmadeusHotelOffersResponse[] =
      await this.amadeusHotelOffersRepository.get(cityCodes)

    const hotelsNormalized: HotelModel[] = amadeusAllResponses
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

    const insert = await this.addHotelsRepository.add(hotelsNormalized)

    if (!insert) {
      throw new Error('Error on insert')
    }

    return insert
  }
}
