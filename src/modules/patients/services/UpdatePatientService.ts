import { injectable } from 'tsyringe'
import { IUpdatePatientDTOInput } from '../interfaces/IUpdatePatientDTOInput'

@injectable()
class UpdatePatientService {
  constructor() {}

  public async execute(
    id: string,
    payload: IUpdatePatientDTOInput,
  ): Promise<void> {}
}

export default UpdatePatientService
