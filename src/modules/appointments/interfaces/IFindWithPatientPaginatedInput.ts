export interface IFindWithPatientPaginatedInput {
  patientId?: string
  from?: Date
  to?: Date
  page: number
  limit: number
}
