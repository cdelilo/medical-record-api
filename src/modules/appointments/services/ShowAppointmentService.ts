import { inject, injectable } from 'tsyringe'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'
import AppError from '@shared/utils/AppError'
import { IShowAppointmentDTOOutput } from '../interfaces/IShowAppointmentDTOOutput'

@injectable()
class ShowAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute(id: string): Promise<IShowAppointmentDTOOutput> {
    const appointment = await this.appointmentRepository.findById(id)

    if (!appointment) {
      throw new AppError('Appointment not found', 404)
    }

    return appointment
  }
}

export default ShowAppointmentService
