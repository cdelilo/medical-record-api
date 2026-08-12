import { afterEach, describe, expect, it, vi, type Mocked } from 'vitest'

import { type Appointment } from '@modules/appointments/infra/typeorm/entities/Appointment'
import { type IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import { type IFindByIdOutput } from '@modules/appointments/interfaces/IFindByIdOutput'
import UpdateAppointmentService from '@modules/appointments/services/UpdateAppointmentService'
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
  id: 'new-patient-id',
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

const makeAppointment = (
  overrides: Partial<IFindByIdOutput> = {},
): IFindByIdOutput => ({
  id: 'appointment-id',
  patientId: 'current-patient-id',
  scheduledAt: new Date('2026-08-11T12:00:00.000Z'),
  notes: 'Initial note',
  ...overrides,
})

afterEach(() => {
  vi.useRealTimers()
})

describe('UpdateAppointmentService', () => {
  it('should throw a 404 AppError when the appointment does not exist', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(null)
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute('missing-appointment-id', {})

    await expect(execution).rejects.toBeInstanceOf(AppError)
    await expect(execution).rejects.toMatchObject({
      message: 'Appointment not found',
      statusCode: 404,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should throw a 404 AppError when the new patient does not exist', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(makeAppointment())
    patientRepository.findById.mockResolvedValue(null)
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute('appointment-id', {
      patientId: 'new-patient-id',
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found or inactive',
      statusCode: 404,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should throw a 404 AppError when the new patient is deleted', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(makeAppointment())
    patientRepository.findById.mockResolvedValue(
      makePatient({ deletedAt: new Date('2026-08-01T12:00:00.000Z') }),
    )
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute('appointment-id', {
      patientId: 'new-patient-id',
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found or inactive',
      statusCode: 404,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should throw a 400 AppError when the new scheduled time is not in the future', async () => {
    const currentDate = new Date('2026-08-10T12:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(currentDate)

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(makeAppointment())
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute('appointment-id', {
      scheduledAt: currentDate,
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Appointment must be scheduled in the future',
      statusCode: 400,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should throw a 409 AppError when the new scheduled time conflicts', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(makeAppointment())
    appointmentRepository.findByScheduledAtExcludingId.mockResolvedValue(
      {} as Appointment,
    )
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    const execution = service.execute('appointment-id', {
      scheduledAt: new Date('2026-08-12T12:00:00.000Z'),
    })

    await expect(execution).rejects.toMatchObject({
      message: 'Appointment time conflict',
      statusCode: 409,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should update the patient and scheduled time when both are valid', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    const appointment = makeAppointment()
    const newScheduledAt = new Date('2026-08-12T12:00:00.000Z')
    appointmentRepository.findById.mockResolvedValue(appointment)
    patientRepository.findById.mockResolvedValue(makePatient())
    appointmentRepository.findByScheduledAtExcludingId.mockResolvedValue(null)
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    await service.execute(appointment.id, {
      patientId: 'new-patient-id',
      scheduledAt: newScheduledAt,
    })

    expect(appointment).toMatchObject({
      patientId: 'new-patient-id',
      scheduledAt: newScheduledAt,
    })
    expect(appointmentRepository.save).toHaveBeenCalledTimes(1)
    expect(appointmentRepository.save).toHaveBeenCalledWith(appointment)
  })

  it('should keep the current patient without querying it when its id is unchanged', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    const appointment = makeAppointment()
    appointmentRepository.findById.mockResolvedValue(appointment)
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    await service.execute(appointment.id, { patientId: appointment.patientId })

    expect(patientRepository.findById).not.toHaveBeenCalled()
    expect(appointment.patientId).toBe('current-patient-id')
    expect(appointmentRepository.save).toHaveBeenCalledWith(appointment)
  })

  it('should keep the current scheduled time without querying conflicts when it is unchanged', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-08-10T12:00:00.000Z'))

    const appointmentRepository = createAppointmentRepositoryMock()
    const patientRepository = createPatientRepositoryMock()
    const appointment = makeAppointment()
    appointmentRepository.findById.mockResolvedValue(appointment)
    const service = new UpdateAppointmentService(
      appointmentRepository,
      patientRepository,
    )

    await service.execute(appointment.id, {
      scheduledAt: new Date(appointment.scheduledAt),
    })

    expect(
      appointmentRepository.findByScheduledAtExcludingId,
    ).not.toHaveBeenCalled()
    expect(appointment.scheduledAt).toEqual(
      new Date('2026-08-11T12:00:00.000Z'),
    )
    expect(appointmentRepository.save).toHaveBeenCalledWith(appointment)
  })
})
