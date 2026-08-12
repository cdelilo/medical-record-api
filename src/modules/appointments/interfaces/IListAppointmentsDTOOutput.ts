interface IAppointmentListItem {
  id: string
  scheduledAt: string
  notes: string
  patient:
    | {
        id: string
        name: string | null
      }
    | {
        id: string
        deleted: boolean
      }
}

export interface IListAppointmentsDTOOutput {
  data: IAppointmentListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
