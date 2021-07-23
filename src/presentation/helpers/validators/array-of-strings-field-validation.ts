import { Validation } from '../../protocols/validation'
import { InvalidParamError } from '../../errors'

export class ArrayOfStringsFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    if (
      !Array.isArray(input[this.fieldName]) ||
      input[this.fieldName].length === 0 ||
      !input[this.fieldName].every((i) => typeof i === 'string')
    ) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
