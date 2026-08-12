import { inject, injectable } from 'tsyringe'
import AppError from '@shared/utils/AppError'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'
import { IUpdateAppointmentDTOInput } from '../interfaces/IUpdateAppointmentDTOInput'
import { IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'

@injectable()
class UpdateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute(
    id: string,
    { patientId, scheduledAt }: IUpdateAppointmentDTOInput,
  ): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id)

    if (!appointment) {
      throw new AppError('Appointment not found', 404)
    }

    if (patientId && patientId !== appointment.patientId) {
      const patient = await this.patientRepository.findById(patientId)

      if (!patient || patient.deletedAt) {
        throw new AppError('Patient not found or inactive', 404)
      }

      appointment.patientId = patientId
    }

    if (scheduledAt) {
      const newScheduledAt = new Date(scheduledAt)

      if (newScheduledAt <= new Date()) {
        throw new AppError('Appointment must be scheduled in the future', 400)
      }

      const hasChanged =
        newScheduledAt.getTime() !== appointment.scheduledAt.getTime()

      if (hasChanged) {
        const conflict =
          await this.appointmentRepository.findByScheduledAtExcludingId(
            newScheduledAt,
            id,
          )

        if (conflict) {
          throw new AppError('Appointment time conflict', 409)
        }

        appointment.scheduledAt = newScheduledAt
      }
    }

    await this.appointmentRepository.save(appointment)
  }
}

export default UpdateAppointmentService
