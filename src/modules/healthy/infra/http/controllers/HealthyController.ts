import type { Request, Response } from 'express'

import ResponseHandler from '@shared/utility/ResponseHandler'

export default class HealthyController {
  public async index(request: Request, response: Response): Promise<Response> {
    return ResponseHandler.json({ status: 'OK' }, response)
  }
}
