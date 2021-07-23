import { AddHotelsController } from './add-hotels-controller'
import { ServerError, MissingParamError } from '../../errors'
import { AddHotels, Validation } from './add-hotels-controller-protocols'
import { HttpRequest } from '../../protocols'
import { serverError, badRequest } from '../../helpers/http/http-helper'

const makeAddHotels = (): AddHotels => {
  class AddHotelsStub implements AddHotels {
    add (cityCodes: string[]): Promise<boolean> {
      return new Promise((resolve) => resolve(true))
    }
  }
  return new AddHotelsStub()
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    cityCodes: ['OPO']
  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error {
      return null
    }
  }
  return new ValidationStub()
}

interface SutTypes {
  sut: AddHotelsController
  addHotelsStub: AddHotels
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addHotelsStub = makeAddHotels()
  const validationStub = makeValidation()

  const sut = new AddHotelsController(addHotelsStub, validationStub)

  return {
    sut,
    addHotelsStub,
    validationStub
  }
}

describe('addHotels Controller', () => {
  test('Should return 500 if addHotels throws', async () => {
    const { sut, addHotelsStub } = makeSut()
    jest.spyOn(addHotelsStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should call addHotels with correct values', async () => {
    const { sut, addHotelsStub } = makeSut()
    const addSpy = jest.spyOn(addHotelsStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith(['OPO'])
  })

  test('Should call Validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns an error', async () => {
    const { sut, validationStub } = makeSut()
    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field'))
    )
  })

  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toEqual(200)
    expect(httpResponse.body.message).toBe('Hotels saved successfully')
  })

  test('Should return 400 if Add user returns null', async () => {
    const { sut, addHotelsStub } = makeSut()
    jest
      .spyOn(addHotelsStub, 'add')
      .mockReturnValueOnce(Promise.resolve(false))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toEqual(400)
    expect(httpResponse.body.message).toEqual('Fail to get and save hotels')
  })
})
