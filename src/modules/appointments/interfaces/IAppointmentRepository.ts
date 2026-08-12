import { type Appointment } from '../infra/typeorm/entities/Appointment'
import { type ICreateInput } from './ICreateInput'
import { type IFindByIdOutput } from './IFindByIdOutput'
import { type IFindWithPatientPaginatedInput } from './IFindWithPatientPaginatedInput'
import { type IFindWithPatientPaginatedOutput } from './IFindWithPatientPaginatedOutput'

export interface IAppointmentRepository {
  findByScheduledAt(scheduledAt: Date): Promise<Appointment | null>
  findByScheduledAtExcludingId(
    scheduledAt: Date,
    id: string,
  ): Promise<Appointment | null>
  findById(id: string): Promise<IFindByIdOutput | null>
  findWithPatientPaginated({
    patientId,
    from,
    to,
    page,
    limit,
  }: IFindWithPatientPaginatedInput): Promise<IFindWithPatientPaginatedOutput>
  create(data: ICreateInput): Promise<Appointment>
  save(data: Partial<Appointment>): Promise<Appointment>
  delete(id: string): Promise<boolean>
}
