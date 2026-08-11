import { container } from 'tsyringe'

import PatientRepository from '@modules/patients/infra/typeorm/repositories/PatientRepository'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import AppointmentRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentRepository'
import { type IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import RefreshTokenRepository from '@modules/authenticates/infra/typeorm/repositories/RefreshTokenRepository'
import { type IRefreshTokenRepository } from '@modules/authenticates/interfaces/IRefreshTokenRepository'
import UserRepository from '@modules/authenticates/infra/typeorm/repositories/UserRepository'
import { type IUserRepository } from '@modules/authenticates/interfaces/IUserRepository'

container.registerSingleton<IPatientRepository>(
  'PatientRepository',
  PatientRepository,
)

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentRepository,
)

container.registerSingleton<IRefreshTokenRepository>(
  'RefreshTokenRepository',
  RefreshTokenRepository,
)

container.registerSingleton<IUserRepository>('UserRepository', UserRepository)
