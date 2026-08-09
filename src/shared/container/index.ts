import { container } from 'tsyringe'

import PatientRepository from '@modules/patients/infra/typeorm/repositories/PatientRepository'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'

container.registerSingleton<IPatientRepository>(
  'PatientRepository',
  PatientRepository,
)
