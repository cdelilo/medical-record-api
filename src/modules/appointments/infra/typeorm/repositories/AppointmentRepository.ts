import { IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import { injectable } from 'tsyringe'
import { Appointment } from '../entities/Appointment'
import { Repository } from 'typeorm'
import { DataSource } from '@shared/infra/typeorm'
import { IFindWithPatientPaginatedInput } from '@modules/appointments/interfaces/IFindWithPatientPaginatedInput'
import {
  type IAppointment,
  type IFindWithPatientPaginatedOutput,
} from '@modules/appointments/interfaces/IFindWithPatientPaginatedOutput'
import { IFindByIdOutput } from '@modules/appointments/interfaces/IFindByIdOutput'

@injectable()
class AppointmentRepository implements IAppointmentRepository {
  private readonly ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = DataSource.getRepository(Appointment)
  }

  public async findById(id: string) {
    const data = await this.ormRepository.findOne({
      select: {
        id: true,
        patientId: true,
        scheduledAt: true,
        notes: true,
      },
      where: {
        id,
      },
    })

    return data as IFindByIdOutput | null
  }

  public async findWithPatientPaginated({
    patientId,
    from,
    to,
    page,
    limit,
  }: IFindWithPatientPaginatedInput): Promise<IFindWithPatientPaginatedOutput> {
    const query = this.ormRepository
      .createQueryBuilder('appointment')
      .withDeleted()
      .leftJoin('appointment.patient', 'patient')
      .select([
        'appointment.id',
        'appointment.scheduledAt',
        'appointment.notes',
        'patient.id',
        'patient.name',
        'patient.deletedAt',
      ])

    if (patientId) {
      query.andWhere('appointment.patientId = :patientId', {
        patientId,
      })
    }

    if (from) {
      query.andWhere('appointment.scheduledAt >= :from', {
        from,
      })
    }

    if (to) {
      query.andWhere('appointment.scheduledAt <= :to', {
        to,
      })
    }

    query
      .orderBy('appointment.scheduledAt', 'ASC')
      .skip((page - 1) * limit)
      .take(limit)

    const [appointments, total] =
      (await query.getManyAndCount()) as unknown as [IAppointment[], number]

    return {
      appointments,
      total,
    }
  }
}

export default AppointmentRepository
