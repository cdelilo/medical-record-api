import { inject, injectable } from 'tsyringe'
import { IPatientRepository } from '../interfaces/IPatientRepository'
import { IShowPatientDTOOutput } from '../interfaces/IShowPatientDTOOutput'
import AppError from '@shared/utils/AppError'

@injectable()
class ShowPatientService {
  constructor(
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute(id: string): Promise<IShowPatientDTOOutput> {
    const patient = await this.patientRepository.findWithAppointmentsById(id)

    if (!patient) {
      throw new AppError('Patient not found', 404)
    }

    return patient
  }
}

export default ShowPatientService
