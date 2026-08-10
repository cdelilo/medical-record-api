import { IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import { injectable } from 'tsyringe'
import { Appointment } from '../entities/Appointment'
import { Not, Repository } from 'typeorm'
import { DataSource } from '@shared/infra/typeorm'
import { IFindWithPatientPaginatedInput } from '@modules/appointments/interfaces/IFindWithPatientPaginatedInput'
import {
  type IAppointment,
  type IFindWithPatientPaginatedOutput,
} from '@modules/appointments/interfaces/IFindWithPatientPaginatedOutput'
import { IFindByIdOutput } from '@modules/appointments/interfaces/IFindByIdOutput'
import { ICreateInput } from '@modules/appointments/interfaces/ICreateInput'

@injectable()
class AppointmentRepository implements IAppointmentRepository {
  private readonly ormRepository: Repository<Appointment>

  constructor() {
    this.ormRepository = DataSource.getRepository(Appointment)
  }

  public async findByScheduledAt(
    scheduledAt: Date,
  ): Promise<Appointment | null> {
    return this.ormRepository.findOneBy({
      scheduledAt,
    })
  }

  public async findByScheduledAtExcludingId(
    scheduledAt: Date,
    id: string,
  ): Promise<Appointment | null> {
    return this.ormRepository.findOne({
      where: {
        scheduledAt,
        id: Not(id),
      },
    })
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

  public async create(data: ICreateInput): Promise<Appointment> {
    const appointment = this.ormRepository.create(data)

    await this.ormRepository.save(appointment)

    return appointment
  }

  public async save(data: Appointment): Promise<Appointment> {
    return this.ormRepository.save(data)
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ id })

    return !!result.affected
  }
}

export default AppointmentRepository
