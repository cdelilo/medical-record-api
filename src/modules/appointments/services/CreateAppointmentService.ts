import { inject, injectable } from 'tsyringe'
import AppError from '@shared/utils/AppError'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'

import { IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import { ICreateAppointmentDTOInput } from '../interfaces/ICreateAppointmentDTOInput'

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute({
    patientId,
    scheduledAt,
  }: ICreateAppointmentDTOInput): Promise<void> {
    const patient = await this.patientRepository.findById(patientId)

    if (!patient || patient.deletedAt) {
      throw new AppError('Patient not found', 404)
    }

    const scheduledAtUtc = new Date(scheduledAt)

    if (scheduledAtUtc <= new Date()) {
      throw new AppError('Appointment must be scheduled in the future', 400)
    }

    const appointmentAtSameTime =
      await this.appointmentRepository.findByScheduledAt(scheduledAtUtc)

    if (appointmentAtSameTime) {
      throw new AppError('Appointment time conflict', 409)
    }

    await this.appointmentRepository.create({
      patientId,
      scheduledAt: scheduledAtUtc,
    })
  }
}

export default CreateAppointmentService
