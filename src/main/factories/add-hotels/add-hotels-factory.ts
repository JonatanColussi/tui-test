import { AddHotelsController } from '../../../presentation/controllers/add-hotels/add-hotels-controller'
import { DbSaveHotels } from '../../../data/usecases/save-hotels/db-save-hotels'

import { AmadeusHttpRepository } from '../../../infra/http/amadeus/amadeus-http-repository'
import { HotelsMongoRepository } from '../../../infra/db/mongodb/hotels/hotels-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'

import { Controller } from '../../../presentation/protocols'
import { LogControllerDecorator } from '../../decorators/log-controller-decorator'
import {
  makeAddHotelsValidation
} from './add-hotels-validation-factory'

import env from '../../config/env'

export const makeAddHotelsController = (): Controller => {
  const amadeusHttpRepository = new AmadeusHttpRepository({
    clientId: env.amadeus.clientId,
    secret: env.amadeus.secret
  })

  const hotelsMongoRepository = new HotelsMongoRepository()

  const dbSaveHotels = new DbSaveHotels(
    amadeusHttpRepository,
    hotelsMongoRepository
  )

  const addOperatorController = new AddHotelsController(
    dbSaveHotels,
    makeAddHotelsValidation()
  )

  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecorator(addOperatorController, logMongoRepository)
}
