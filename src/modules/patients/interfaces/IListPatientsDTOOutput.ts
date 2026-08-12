interface IPatientListItem {
  id: string
  name: string
  phone: string
  birthDate: Date
  sex: string
}

export interface IListPatientsDTOOutput {
  data: IPatientListItem[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
