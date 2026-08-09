import { type Patient } from '../infra/typeorm/entities/Patient'
import { type IFindPaginatedOutput } from './IFindPaginatedOutput'
import { type IFindWithAppointmentsByIdOutput } from './IFindWithAppointmentsById'

export interface IPatientRepository {
  findPaginated(page: number, limit: number): Promise<IFindPaginatedOutput[]>
  findWithAppointmentsById(
    id: string,
  ): Promise<IFindWithAppointmentsByIdOutput | null>
  findWithDeletedById(id: string): Promise<Patient | null>
  save(data: Patient): Promise<Patient>
}
