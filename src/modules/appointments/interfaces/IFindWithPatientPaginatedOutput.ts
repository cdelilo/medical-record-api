export interface IAppointment {
  id: string
  scheduledAt: string
  notes: string
  patient: {
    id: string
    name: string | null
    deletedAt: Date | null
  }
}

export interface IFindWithPatientPaginatedOutput {
  appointments: IAppointment[]
  total: number
}
