import 'express-async-errors'
import { errors } from 'celebrate'
import cors from 'cors'
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express'
import { createServer } from 'node:http'

import '@shared/infra/typeorm'

import AppError from '@shared/utils/AppError'
import ResponseHandler from '@shared/utils/ResponseHandler'

import routes from './routes'

const app = express()
const server = createServer(app)

app.use(cors())

app.use(routes)

app.use(errors())

app.use(
  (error: Error, request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof AppError) {
      return ResponseHandler.json(
        { message: error.message, code: error.code },
        response,
        error.statusCode,
      )
    }

    return ResponseHandler.json(
      { message: `Internal server error - ${error.message}` },
      response,
      500,
    )
  },
)

export { server }
