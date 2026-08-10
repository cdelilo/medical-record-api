import { afterEach, describe, expect, it, vi, type Mocked } from 'vitest'

import { type IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import { PatientSex } from '@modules/patients/enums/PatientSex'
import { type Patient } from '@modules/patients/infra/typeorm/entities/Patient'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import AppError from '@shared/utils/AppError'

type AppointmentRepositoryMock = Mocked<IAppointmentRepository>
type PatientRepositoryMock = Mocked<IPatientRepository>

const createAppointmentRepositoryMock = (): AppointmentRepositoryMock => ({
  create: vi.fn(),
  delete: vi.fn(),
  findById: vi.fn(),
  findByScheduledAt: vi.fn(),
  findByScheduledAtExcludingId: vi.fn(),
  findWithPatientPaginated: vi.fn(),
  save: vi.fn(),
})

const createPatientRepositoryMock = (): PatientRepositoryMock => ({
  create: vi.fn(),
  findById: vi.fn(),
  findPaginated: vi.fn(),
  findWithAppointmentsById: vi.fn(),
  findWithDeletedById: vi.fn(),
  save: vi.fn(),
})

const makePatient = (overrides: Partial<Patient> = {}): Patient => ({
  id: 'patient-id',
  name: 'Ana Silva',
  phone: '+5511999999999',
  email: 'ana@example.com',
  birthDate: new Date('1990-05-15T00:00:00.000Z'),
  sex: PatientSex.FEMALE,
  heightM: 1.65,
  weightKg: 62.5,
  createdAt: new Date('2026-01-01T00:00:00.000Z'),
  updatedAt: new Date('2026-01-01T00:00:00.000Z'),
  deletedAt: null,
  appointments: [],
  ...overrides,
})

afterEach(() => {
  vi.useRealTimers()
})

describe('CreateAppointmentService', () => {
  it('should throw a 404 AppError when the patient does not exist', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findById.mockResolvedValue(null)
    const service = new CreateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute({
      patientId: 'missing-patient-id',
      scheduledAt: '2026-08-11T12:00:00.000Z',
    })

    await expect(execution).rejects.toBeInstanceOf(AppError)
    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found',
      statusCode: 404,
    })
    expect(appointmentRepository.create).not.toHaveBeenCalled()
  })

  it('should throw a 404 AppError when the patient is deleted', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findById.mockResolvedValue(
      makePatient({ deletedAt: new Date('2026-08-01T12:00:00.000Z') }),
    )
    const service = new CreateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute({
      patientId: 'patient-id',
      scheduledAt: '2026-08-11T12:00:00.000Z',
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found',
      statusCode: 404,
    })
    expect(appointmentRepository.create).not.toHaveBeenCalled()
  })

  it('should throw a 400 AppError when the scheduled time is not in the future', async () => {
    const currentDate = new Date('2026-08-10T12:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(currentDate)

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findById.mockResolvedValue(makePatient())
    const service = new CreateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute({
      patientId: 'patient-id',
      scheduledAt: currentDate.toISOString(),
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Appointment must be scheduled in the future',
      statusCode: 400,
    })
    expect(appointmentRepository.create).not.toHaveBeenCalled()
  })

  it('should throw a 409 AppError when the scheduled time is already occupied', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findById.mockResolvedValue(makePatient())
    appointmentRepository.findByScheduledAt.mockResolvedValue({} as never)
    const service = new CreateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute({
      patientId: 'patient-id',
      scheduledAt: '2026-08-11T12:00:00.000Z',
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Appointment time conflict',
      statusCode: 409,
    })
    expect(appointmentRepository.create).not.toHaveBeenCalled()
  })

  it('should create an appointment', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    const payload = {
      patientId: 'patient-id',
      scheduledAt: '2026-08-11T12:00:00.000Z',
    }
    patientRepository.findById.mockResolvedValue(makePatient())
    appointmentRepository.findByScheduledAt.mockResolvedValue(null)
    const service = new CreateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    await expect(service.execute(payload)).resolves.toBeUndefined()

    expect(appointmentRepository.create).toHaveBeenCalledTimes(1)
    expect(appointmentRepository.create).toHaveBeenCalledWith({
      patientId: payload.patientId,
      scheduledAt: new Date(payload.scheduledAt),
    })
  })
})
