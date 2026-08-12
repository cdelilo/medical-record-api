import { afterEach, describe, expect, it, vi, type Mocked } from 'vitest'

import { PatientSex } from '@modules/patients/enums/PatientSex'
import { type Patient } from '@modules/patients/infra/typeorm/entities/Patient'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import DeletePatientService from '@modules/patients/services/DeletePatientService'
import AppError from '@shared/utils/AppError'

type PatientRepositoryMock = Mocked<IPatientRepository>

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

describe('DeletePatientService', () => {
  it('should throw an AppError and does not save when the patient does not exist', async () => {
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findWithDeletedById.mockResolvedValue(null)
    const service = new DeletePatientService(patientRepository)

    const execution = service.execute('missing-patient-id')

    await expect(execution).rejects.toBeInstanceOf(AppError)
    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found',
      statusCode: 404,
    })

    expect(patientRepository.save).not.toHaveBeenCalled()
  })

  it('should do nothing when the patient was already deleted', async () => {
    const deletedAt = new Date('2026-01-02T00:00:00.000Z')
    const patientRepository = createPatientRepositoryMock()
    const patient = makePatient({ deletedAt })
    patientRepository.findWithDeletedById.mockResolvedValue(patient)
    const service = new DeletePatientService(patientRepository)

    await expect(service.execute(patient.id)).resolves.toBeUndefined()

    expect(patient.deletedAt).toBe(deletedAt)
    expect(patient.name).toBe('Ana Silva')
    expect(patientRepository.save).not.toHaveBeenCalled()
  })

  it('should anonymize an active patient and saves it with the current date', async () => {
    const deletionDate = new Date('2026-08-10T16:00:00.000Z')
    vi.useFakeTimers()
    vi.setSystemTime(deletionDate)

    const patientRepository = createPatientRepositoryMock()
    const patient = makePatient()
    patientRepository.findWithDeletedById.mockResolvedValue(patient)
    const service = new DeletePatientService(patientRepository)

    await service.execute(patient.id)

    expect(patient).toMatchObject({
      name: null,
      phone: null,
      email: null,
      birthDate: null,
      sex: null,
      heightM: null,
      weightKg: null,
      deletedAt: deletionDate,
    })
    expect(patientRepository.save).toHaveBeenCalledTimes(1)
    expect(patientRepository.save).toHaveBeenCalledWith(patient)
  })
})
