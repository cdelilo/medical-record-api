import { inject, injectable } from 'tsyringe'
import AppError from '@shared/utils/AppError'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'
import { IUpdateAppointmentNoteDTOInput } from '../interfaces/IUpdateAppointmentNoteDTOInput'

@injectable()
class UpdateAppointmentNoteService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute(
    id: string,
    payload: IUpdateAppointmentNoteDTOInput,
  ): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id)

    if (!appointment) {
      throw new AppError('Appointment not found', 404)
    }

    appointment.notes = payload.note

    await this.appointmentRepository.save(appointment)
  }
}

export default UpdateAppointmentNoteService
