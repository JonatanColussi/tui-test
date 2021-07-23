import { HotelModel } from '../../../../domain/models/hotel'

export interface AddHotelsRepository {
  add(hotels: HotelModel[]): Promise<boolean>
}
