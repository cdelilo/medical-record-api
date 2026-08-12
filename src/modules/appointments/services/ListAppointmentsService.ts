import { inject, injectable } from 'tsyringe'
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository'
import { IListAppointmentsDTOOutput } from '../interfaces/IListAppointmentsDTOOutput'
import { IListAppointmentsDTOInput } from '../interfaces/IListAppointmentsDTOInput'
import AppError from '@shared/utils/AppError'

@injectable()
class ListAppointmentsService {
  constructor(
    @inject('AppointmentRepository')
    private readonly appointmentRepository: IAppointmentRepository,
  ) {}

  public async execute({
    patientId,
    from,
    to,
    page,
    limit,
  }: IListAppointmentsDTOInput): Promise<IListAppointmentsDTOOutput> {
    const fromDate = from ? new Date(from) : undefined
    const toDate = to ? new Date(to) : undefined

    if (fromDate && toDate && fromDate > toDate) {
      throw new AppError('Invalid date range', 400)
    }

    const { appointments, total } =
      await this.appointmentRepository.findWithPatientPaginated({
        patientId,
        from: fromDate,
        to: toDate,
        page,
        limit,
      })

    const data = appointments.map(({ patient, ...appointment }) => ({
      ...appointment,
      patient: patient.deletedAt
        ? { id: patient.id, deleted: true }
        : { id: patient.id, name: patient.name },
    }))

    return {
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export default ListAppointmentsService
