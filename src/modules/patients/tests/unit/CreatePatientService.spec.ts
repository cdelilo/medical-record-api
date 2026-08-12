import { describe, expect, it, vi } from 'vitest'

import { PatientSex } from '@modules/patients/enums/PatientSex'
import { type IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import CreatePatientService from '@modules/patients/services/CreatePatientService'

describe('CreatePatientService', () => {
  it('should forward the payload to the repository and resolves with no value', async () => {
    const patientRepository: IPatientRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findPaginated: vi.fn(),
      findWithAppointmentsById: vi.fn(),
      findWithDeletedById: vi.fn(),
      save: vi.fn(),
    }

    const service = new CreatePatientService(patientRepository)
    const payload = {
      name: 'Ana Silva',
      phone: '+5511999999999',
      email: 'ana@example.com',
      birthDate: '1990-05-15',
      sex: PatientSex.FEMALE,
      heightM: 1.65,
      weightKg: 62.5,
    }

    await expect(service.execute(payload)).resolves.toBeUndefined()

    expect(patientRepository.create).toHaveBeenCalledTimes(1)
    expect(patientRepository.create).toHaveBeenCalledWith(payload)
  })
})
