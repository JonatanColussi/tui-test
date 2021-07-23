import {
  ValidationComposite,
  RequiredFieldValidation,
  ArrayOfStringsFieldValidation
} from '../../../presentation/helpers/validators'

export const makeAddHotelsValidation = (): ValidationComposite => {
  return new ValidationComposite([
    new RequiredFieldValidation('cityCodes'),
    new ArrayOfStringsFieldValidation('cityCodes')
  ])
}
