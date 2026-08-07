/* eslint-disable @typescript-eslint/no-explicit-any */

import { instanceToInstance } from 'class-transformer'
import type { Response } from 'express'

class ResponseHandler {
  public json(data: any, response: Response, statusCode = 200): Response {
    return response.status(statusCode).json(instanceToInstance(data))
  }
}

export default new ResponseHandler()
