import { describe, expect, it, vi, type Mocked } from 'vitest'

import { type IAppointmentRepository } from '@modules/appointments/interfaces/IAppointmentRepository'
import { type IFindByIdOutput } from '@modules/appointments/interfaces/IFindByIdOutput'
import UpdateAppointmentNoteService from '@modules/appointments/services/UpdateAppointmentNoteService'
import AppError from '@shared/utils/AppError'

type AppointmentRepositoryMock = Mocked<IAppointmentRepository>

const createAppointmentRepositoryMock = (): AppointmentRepositoryMock => ({
  create: vi.fn(),
  delete: vi.fn(),
  findById: vi.fn(),
  findByScheduledAt: vi.fn(),
  findByScheduledAtExcludingId: vi.fn(),
  findWithPatientPaginated: vi.fn(),
  save: vi.fn(),
})

const makeAppointment = (
  overrides: Partial<IFindByIdOutput> = {},
): IFindByIdOutput => ({
  id: 'appointment-id',
  patientId: 'patient-id',
  scheduledAt: new Date('2026-08-11T12:00:00.000Z'),
  notes: 'Initial note',
  ...overrides,
})

describe('UpdateAppointmentNoteService', () => {
  it('should throw a 404 AppError when the appointment does not exist', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    appointmentRepository.findById.mockResolvedValue(null)
    const service = new UpdateAppointmentNoteService(appointmentRepository)

    const execution = service.execute('missing-appointment-id', {
      note: 'Updated note',
    })

    await expect(execution).rejects.toBeInstanceOf(AppError)
    await expect(execution).rejects.toMatchObject({
      message: 'Appointment not found',
      statusCode: 404,
    })
    expect(appointmentRepository.save).not.toHaveBeenCalled()
  })

  it('should update the note and save the appointment', async () => {
    const appointmentRepository = createAppointmentRepositoryMock()
    const appointment = makeAppointment()
    appointmentRepository.findById.mockResolvedValue(appointment)
    const service = new UpdateAppointmentNoteService(appointmentRepository)

    await service.execute(appointment.id, { note: 'Updated note' })

    expect(appointment.notes).toBe('Updated note')
    expect(appointmentRepository.save).toHaveBeenCalledTimes(1)
    expect(appointmentRepository.save).toHaveBeenCalledWith(appointment)
  })
})
