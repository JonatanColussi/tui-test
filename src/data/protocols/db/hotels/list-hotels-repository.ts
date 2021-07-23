import { HotelModel } from '../../../../domain/models/hotel'
import { HotelFilters } from '../../../../domain/usecases/list-hotels'

export { HotelFilters }

export interface ListHotelsRepository {
  list(filters: HotelFilters): Promise<HotelModel[]>
}
