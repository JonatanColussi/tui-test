import {
  HttpResponse,
  HttpRequest,
  Controller,
  AddHotels,
  Validation
} from './add-hotels-controller-protocols'
import { serverError, ok, badRequest } from '../../helpers/http/http-helper'

export class AddHotelsController implements Controller {
  constructor (
    private readonly addHotels: AddHotels,
    private readonly validation: Validation
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const {
        body: {
          cityCodes
        }
      } = httpRequest

      const addHotels = await this.addHotels.add(cityCodes)

      if (!addHotels) {
        return badRequest(new Error('Fail to get and save hotels'))
      }

      return ok({
        message: 'Hotels saved successfully'
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
