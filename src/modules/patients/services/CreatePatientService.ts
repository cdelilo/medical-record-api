import { inject, injectable } from 'tsyringe'
import { ICreatePatientDTOInput } from '../interfaces/ICreatePatientDTOInput'
import { IPatientRepository } from '../interfaces/IPatientRepository'

@injectable()
class CreatePatientService {
  constructor(
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute(payload: ICreatePatientDTOInput): Promise<void> {
    await this.patientRepository.create(payload)
  }
}

export default CreatePatientService
