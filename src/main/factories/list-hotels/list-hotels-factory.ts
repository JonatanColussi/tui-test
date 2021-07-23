import { ListHotelsController } from '../../../presentation/controllers/list-hotels/list-hotels-controller'
import { DbListHotels } from '../../../data/usecases/list-hotels/db-list-hotels'

import { HotelsMongoRepository } from '../../../infra/db/mongodb/hotels/hotels-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'

export const makeListHotelsController = (): Controller => {
  const hotelsMongoRepository = new HotelsMongoRepository()

  const dbListHotels = new DbListHotels(hotelsMongoRepository)

  const listOperatorController = new ListHotelsController(dbListHotels)

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(listOperatorController, logMongoRepository)
}
