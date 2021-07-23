import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import env from '../config/env'

describe('trim params Middleware', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl)
  })
  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  test('Should trim payload', async () => {
    app.post('/test_trim', (req, res) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_trim')
      .send({ any_property: 'any_value_with_spaces_in_end ' })
      .expect({ any_property: 'any_value_with_spaces_in_end' })
  })
})
