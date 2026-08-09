import { injectable } from 'tsyringe'
import { ICreatePatientDTOInput } from '../interfaces/ICreatePatientDTOInput'

@injectable()
class CreatePatientService {
  constructor() {}

  public async execute(payload: ICreatePatientDTOInput): Promise<void> {}
}

export default CreatePatientService
