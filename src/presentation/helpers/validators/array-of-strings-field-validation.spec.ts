import { ArrayOfStringsFieldValidation } from './array-of-strings-field-validation'
import { InvalidParamError } from '../../errors'

const makeSut = (): ArrayOfStringsFieldValidation => {
  return new ArrayOfStringsFieldValidation('field')
}

describe('RequiredField Validation', () => {
  test('Should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ field: [null, 0] })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should return a InvalidParamError if validation fails with empty array', () => {
    const sut = makeSut()
    const error = sut.validate({ field: [] })
    expect(error).toEqual(new InvalidParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: ['any_content'] })
    expect(error).toBeFalsy()
  })
})
