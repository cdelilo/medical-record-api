import { type IFindByIdOutput } from './IFindByIdOutput'
import { type IFindWithPatientPaginatedInput } from './IFindWithPatientPaginatedInput'
import { type IFindWithPatientPaginatedOutput } from './IFindWithPatientPaginatedOutput'

export interface IAppointmentRepository {
  findById(id: string): Promise<IFindByIdOutput | null>
  findWithPatientPaginated({
    patientId,
    from,
    to,
    page,
    limit,
  }: IFindWithPatientPaginatedInput): Promise<IFindWithPatientPaginatedOutput>
}
