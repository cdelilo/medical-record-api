import { type PatientSex } from '../enums/PatientSex'

export interface IUpdatePatientDTOInput {
  name: string
  phone: string
  email: string
  birthDate: string
  sex: PatientSex
  heightM: number
  weightKg: number
}
