import { inject, injectable } from 'tsyringe'
import { IPatientRepository } from '../interfaces/IPatientRepository'
import AppError from '@shared/utils/AppError'

@injectable()
class DeletePatientService {
  constructor(
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const patient = await this.patientRepository.findWithDeletedById(id)

    if (!patient) {
      throw new AppError('Patient not found', 404)
    }

    if (patient.deletedAt) {
      return
    }

    patient.name = null
    patient.email = null
    patient.birthDate = null
    patient.sex = null
    patient.phone = null
    patient.heightM = null
    patient.weightKg = null
    patient.deletedAt = new Date()

    await this.patientRepository.save(patient)
  }
}

export default DeletePatientService
