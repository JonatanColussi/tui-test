import { Express, Router } from 'express'
import fg from 'fast-glob'
import { extname } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use(router)

  if (extname(__filename) === '.js') {
    fg.sync('**/routes/**/**routes.js').map(async file => (await import(`../../../../${file}`)).default(router))
  } else {
    fg.sync('**/src/main/routes/**/**routes.ts').map(async file => (await import(`../../../${file}`)).default(router))
  }
}
