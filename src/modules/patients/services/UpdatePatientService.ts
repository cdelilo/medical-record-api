import { inject, injectable } from 'tsyringe'
import { IUpdatePatientDTOInput } from '../interfaces/IUpdatePatientDTOInput'
import { IPatientRepository } from '../interfaces/IPatientRepository'
import AppError from '@shared/utils/AppError'

@injectable()
class UpdatePatientService {
  constructor(
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute(
    id: string,
    payload: IUpdatePatientDTOInput,
  ): Promise<void> {
    const patient = await this.patientRepository.findById(id)

    if (!patient) {
      throw new AppError('Patient not found', 404)
    }

    patient.name = payload.name ?? patient.name
    patient.phone = payload.phone ?? patient.phone
    patient.birthDate = payload.birthDate ?? patient.birthDate
    patient.email = payload.email ?? patient.email
    patient.heightM = payload.heightM ?? patient.heightM
    patient.weightKg = payload.weightKg ?? patient.weightKg
    patient.sex = payload.sex ?? patient.sex

    await this.patientRepository.save(patient)
  }
}

export default UpdatePatientService
