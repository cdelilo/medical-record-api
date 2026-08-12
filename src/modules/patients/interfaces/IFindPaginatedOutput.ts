export interface IPatient {
  id: string
  name: string
  phone: string
  birthDate: Date
  sex: string
}

export interface IFindPaginatedOutput {
  patients: IPatient[]
  total: number
}
