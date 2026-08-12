import { describe, expect, it, vi, type Mocked } from 'vitest'

import { PatientSex } from '@modules/patients/enums/PatientSex'
import { type Patient } from '@modules/patients/infra/typeorm/entities/Patient'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import { type IUpdatePatientDTOInput } from '@modules/patients/interfaces/IUpdatePatientDTOInput'
import UpdatePatientService from '@modules/patients/services/UpdatePatientService'
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

describe('UpdatePatientService', () => {
  it('should throw an AppError and does not save when the patient does not exist', async () => {
    const patientRepository = createPatientRepositoryMock()
    patientRepository.findById.mockResolvedValue(null)
    const service = new UpdatePatientService(patientRepository)

    const execution = service.execute(
      'missing-patient-id',
      {} as IUpdatePatientDTOInput,
    )

    await expect(execution).rejects.toBeInstanceOf(AppError)
    await expect(execution).rejects.toMatchObject({
      message: 'Patient not found',
      statusCode: 404,
    })

    expect(patientRepository.save).not.toHaveBeenCalled()
  })

  it('should update every patient field and persists the same patient', async () => {
    const patientRepository = createPatientRepositoryMock()
    const patient = makePatient()
    const payload: IUpdatePatientDTOInput = {
      name: 'Bruno Costa',
      phone: '+5521999999999',
      email: 'bruno@example.com',
      birthDate: new Date('1985-10-20T00:00:00.000Z'),
      sex: PatientSex.MALE,
      heightM: 1.8,
      weightKg: 81.25,
    }
    patientRepository.findById.mockResolvedValue(patient)
    const service = new UpdatePatientService(patientRepository)

    await service.execute(patient.id, payload)

    expect(patient).toMatchObject(payload)
    expect(patientRepository.save).toHaveBeenCalledTimes(1)
    expect(patientRepository.save).toHaveBeenCalledWith(patient)
  })

  it('should preserve omitted fields when only the name is provided', async () => {
    const patientRepository = createPatientRepositoryMock()
    const patient = makePatient()
    patientRepository.findById.mockResolvedValue(patient)
    const service = new UpdatePatientService(patientRepository)
    const originalPhone = patient.phone
    const originalEmail = patient.email
    const originalBirthDate = patient.birthDate
    const originalSex = patient.sex
    const originalHeightM = patient.heightM
    const originalWeightKg = patient.weightKg

    await service.execute(patient.id, {
      name: 'Ana Souza',
    } as IUpdatePatientDTOInput)

    expect(patient).toMatchObject({
      name: 'Ana Souza',
      phone: originalPhone,
      email: originalEmail,
      birthDate: originalBirthDate,
      sex: originalSex,
      heightM: originalHeightM,
      weightKg: originalWeightKg,
    })
    expect(patientRepository.save).toHaveBeenCalledWith(patient)
  })

  it('should preserve omitted fields when only the phone is provided', async () => {
    const patientRepository = createPatientRepositoryMock()
    const patient = makePatient()
    patientRepository.findById.mockResolvedValue(patient)
    const service = new UpdatePatientService(patientRepository)
    const originalName = patient.name

    await service.execute(patient.id, {
      phone: '+5531999999999',
    } as IUpdatePatientDTOInput)

    expect(patient.name).toBe(originalName)
    expect(patient.phone).toBe('+5531999999999')
    expect(patientRepository.save).toHaveBeenCalledWith(patient)
  })
})
