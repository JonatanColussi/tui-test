import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeAddHotelsController } from '../factories/add-hotels/add-hotels-factory'

export default (router: Router): void => {
  router.post(
    '/hotels',
    adaptRoute(makeAddHotelsController())
  )
}
