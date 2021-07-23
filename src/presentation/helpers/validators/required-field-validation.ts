import { Validation } from '../../protocols/validation'
import { MissingParamError } from '../../errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error {
    if (!input[this.fieldName] && input[this.fieldName] !== false) {
      return new MissingParamError(this.fieldName)
    }
  }
}
