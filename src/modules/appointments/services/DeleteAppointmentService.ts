import { inject, injectable } from 'tsyringe'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'
import AppError from '@shared/utils/AppError'

@injectable()
class DeleteAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const appointment = await this.appointmentRepository.findById(id)

    if (!appointment) {
      throw new AppError('Appointment not found', 404)
    }

    await this.appointmentRepository.delete(appointment.id)
  }
}

export default DeleteAppointmentService
