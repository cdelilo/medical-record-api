import { type PatientSex } from '../enums/PatientSex'

export interface ICreatePatientDTOInput {
  name: string
  phone: string
  email: string
  birthDate: string
  sex: PatientSex
  heightM: number
  weightKg: number
}
