export interface IListAppointmentsDTOInput {
  patientId?: string
  from?: Date
  to?: Date
  page: number
  limit: number
}
