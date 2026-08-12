import { type Patient } from '../infra/typeorm/entities/Patient'
import { type ICreateInput } from './ICreateInput'
import { type IFindPaginatedOutput } from './IFindPaginatedOutput'
import { type IFindWithAppointmentsByIdOutput } from './IFindWithAppointmentsById'

export interface IPatientRepository {
  findById(id: string): Promise<Patient | null>
  findPaginated(page: number, limit: number): Promise<IFindPaginatedOutput>
  findWithAppointmentsById(
    id: string,
  ): Promise<IFindWithAppointmentsByIdOutput | null>
  findWithDeletedById(id: string): Promise<Patient | null>
  create(data: ICreateInput): Promise<Patient>
  save(data: Patient): Promise<Patient>
}
