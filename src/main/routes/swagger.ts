import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../../swagger.json'

export default (router: Router): void => {
  router.get(
    '/docs',
    (req, res, next) => {
      res.type('html')
      return next()
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  )
}
