import { HotelModel } from '../models/hotel'

export interface HotelFilters {
  name?: string
  priceStart?: Number
  priceEnd?: Number
  cityCode?: string
}

export interface ListHotels {
  list(filters: HotelFilters): Promise<HotelModel[]>
}
