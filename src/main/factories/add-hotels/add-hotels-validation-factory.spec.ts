import {
  ValidationComposite,
  RequiredFieldValidation,
  ArrayOfStringsFieldValidation
} from '../../../presentation/helpers/validators'
import { makeAddHotelsValidation } from './add-hotels-validation-factory'

import { Validation } from '../../../presentation/protocols/validation'

jest.mock('../../../presentation/helpers/validators/validation-composite')

describe('ChangeOperatorStatusValidation Factory', () => {
  test('Should call ValidationComposite with all validatations', () => {
    makeAddHotelsValidation()
    const validations: Validation[] = [
      new RequiredFieldValidation('cityCodes'),
      new ArrayOfStringsFieldValidation('cityCodes')
    ]

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
