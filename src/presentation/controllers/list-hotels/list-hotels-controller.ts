import {
  HttpResponse,
  HttpRequest,
  Controller,
  ListHotels
} from './list-hotels-controller-protocols'
import { serverError, ok, badRequest } from '../../helpers/http/http-helper'

export class ListHotelsController implements Controller {
  constructor (
    private readonly listHotels: ListHotels
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        query: filters
      } = httpRequest

      const hotels = await this.listHotels.list(filters)

      if (!hotels) {
        return badRequest(new Error('Fail to get hotels list'))
      }

      return ok({
        data: hotels
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
