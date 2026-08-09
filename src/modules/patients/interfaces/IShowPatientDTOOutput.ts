export interface IShowPatientDTOOutput {
  id: string
  name: string
  phone: string
  birthDate: Date
  sex: string
  heightM: string
  weightKg: string
  appointments: {
    id: string
    scheduledAt: Date
    notes: string
  }
}
