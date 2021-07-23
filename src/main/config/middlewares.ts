import { Express } from 'express'
import { bodyParser, cors, contentType, trimParams } from '../middlewares'
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../../../swagger.json'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
  )
  app.use(contentType)
  app.use(trimParams)
}
