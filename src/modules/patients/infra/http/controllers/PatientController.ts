import { type Request, type Response } from 'express'
import { container } from 'tsyringe'

import CreatePatientService from '@modules/patients/services/CreatePatientService'
import DeletePatientService from '@modules/patients/services/DeletePatientService'
import ListPatientsService from '@modules/patients/services/ListPatientsService'
import ShowPatientService from '@modules/patients/services/ShowPatientService'
import UpdatePatientService from '@modules/patients/services/UpdatePatientService'
import ResponseHandler from '@shared/utils/ResponseHandler'
import { type IListPatientsDTOInput } from '@modules/patients/interfaces/IListPatientsDTOInput'

export default class PatientController {
  public async list(request: Request, response: Response): Promise<Response> {
    const { page, limit } = request.query as unknown as IListPatientsDTOInput

    const listPatientsService = container.resolve(ListPatientsService)
    const patients = await listPatientsService.execute({ page, limit })

    return ResponseHandler.json(patients, response)
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const showPatientService = container.resolve(ShowPatientService)
    const patient = await showPatientService.execute(id)

    return ResponseHandler.json(patient, response)
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const payload = request.body

    const createPatientService = container.resolve(CreatePatientService)
    await createPatientService.execute(payload)

    return response.status(201).end()
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const payload = request.body
    const { id } = request.params

    const updatePatientService = container.resolve(UpdatePatientService)
    await updatePatientService.execute(id, payload)

    return response.status(204).end()
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { id } = request.params

    const deletePatientService = container.resolve(DeletePatientService)
    await deletePatientService.execute(id)

    return response.status(204).end()
  }
}
