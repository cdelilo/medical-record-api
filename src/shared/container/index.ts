import { container } from 'tsyringe'

import PatientRepository from '@modules/patients/infra/typeorm/repositories/PatientRepository'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository'
import { type IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'

container.registerSingleton<IPatientRepository>(
  'PatientRepository',
  PatientRepository,
)

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
)
