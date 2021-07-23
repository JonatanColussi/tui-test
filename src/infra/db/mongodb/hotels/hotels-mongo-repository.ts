import { AddHotelsRepository } from '../../../../data/protocols/db/hotels/add-hotels-repository'
import {
  ListHotelsRepository,
  HotelFilters
} from '../../../../data/protocols/db/hotels/list-hotels-repository'
import { HotelModel } from '../../../../domain/models/hotel'

import { MongoHelper } from '../helpers/mongo-helper'

export class HotelsMongoRepository
implements AddHotelsRepository, ListHotelsRepository {
  collectionName: string = 'hotels';

  async add (hotels: HotelModel[]): Promise<boolean> {
    const userCollection = await MongoHelper.getCollection(this.collectionName)

    const result = await userCollection.insertMany(hotels)

    return Boolean(result)
  }

  async list (filters: HotelFilters): Promise<HotelModel[]> {
    const userCollection = await MongoHelper.getCollection(this.collectionName)

    const mongoFilters: any = {}

    if (filters.name) {
      mongoFilters.name = new RegExp(filters.name, 'i')
    }

    if (filters.cityCode) {
      mongoFilters.cityCode = filters.cityCode
    }

    if (filters.priceStart) {
      mongoFilters['offers.price'] = {
        ...mongoFilters['offers.price'],
        $gte: filters.priceStart
      }
    }

    if (filters.priceEnd) {
      mongoFilters['offers.price'] = {
        ...mongoFilters['offers.price'],
        $lte: filters.priceEnd
      }
    }

    const result = await userCollection.find(mongoFilters).toArray()

    return result.map((r) => MongoHelper.map(r))
  }
}
