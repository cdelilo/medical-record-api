import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import ResponseHandler from '@shared/utils/ResponseHandler'
import ListAppointmentsService from '@modules/appointments/services/ListAppointmentsService'
import { type IListAppointmentsDTOInput } from '@modules/appointments/interfaces/IListAppointmentsDTOInput'
import ShowAppointmentService from '@modules/appointments/services/ShowAppointmentService'
import DeleteAppointmentService from '@modules/appointments/services/DeleteAppointmentService'
import UpdateAppointmentService from '@modules/appointments/services/UpdateAppointmentService'
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import UpdateAppointmentNoteService from '@modules/appointments/services/UpdateAppointmentNoteService'

export default class AppointmentController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { patientId, from, to, page, limit } =
      request.query as unknown as IListAppointmentsDTOInput

    const listAppointmentsService = container.resolve(ListAppointmentsService)
    const appointments = await listAppointmentsService.execute({
      patientId,
      from,
      to,
      page,
      limit,
    })

    return ResponseHandler.json(appointments, response)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const showAppointmentService = container.resolve(ShowAppointmentService)
    const appointment = await showAppointmentService.execute(id)

    return ResponseHandler.json(appointment, response)
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body

    const createAppointmentService = container.resolve(CreateAppointmentService)
    await createAppointmentService.execute(payload)

    return response.status(201).end()
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const payload = request.body
    const { id } = request.params

    const updateAppointmentService = container.resolve(UpdateAppointmentService)
    await updateAppointmentService.execute(id, payload)

    return response.status(204).end()
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const deleteAppointmentService = container.resolve(DeleteAppointmentService)
    await deleteAppointmentService.execute(id)

    return response.status(204).end()
  }

  public async updateNote(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const payload = request.body
    const { id } = request.params

    const updateAppointmentNoteService = container.resolve(
      UpdateAppointmentNoteService,
    )
    await updateAppointmentNoteService.execute(id, payload)

    return response.status(204).end()
  }
}
