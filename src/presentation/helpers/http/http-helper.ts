import { HttpResponse } from '../../protocols/http'
import { ServerError } from '../../errors'
import * as Result from '../../../TsErrorHandlerHelper'

export const badRequest = (error: Result.Type<Error>): HttpResponse => {
  return {
    statusCode: 400,
    body: error
  }
}

export const serverError = (error: Error): HttpResponse => ({
  statusCode: 500,
  body: new ServerError(error.stack)
})

export const ok = (data: any): HttpResponse => ({
  statusCode: 200,
  body: data
})
