import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeListHotelsController } from '../factories/list-hotels/list-hotels-factory'

export default (router: Router): void => {
  router.get(
    '/hotels',
    adaptRoute(makeListHotelsController())
  )
}
