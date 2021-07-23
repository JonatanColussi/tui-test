import {
  ListHotels,
  HotelModel,
  ListHotelsRepository,
  HotelFilters
} from './db-list-hotels-protocols'

export class DbListHotels implements ListHotels {
  constructor (
    private readonly listHotelsRepository: ListHotelsRepository
  ) {}

  async list (filters: HotelFilters): Promise<HotelModel[]> {
    const hotels: HotelModel[] = await this.listHotelsRepository.list(filters)

    if (!hotels) {
      throw new Error('Fail to load hotels')
    }

    return hotels
  }
}
