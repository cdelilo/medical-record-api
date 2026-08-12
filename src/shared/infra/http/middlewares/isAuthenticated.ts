import { type NextFunction, type Request, type Response } from 'express'

import AppError from '@shared/utils/AppError'
import jwt, { type Secret } from 'jsonwebtoken'

const isAuthenticated = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    throw new AppError('Token missing', 401)
  }

  const [, token] = authHeader.split(' ')

  try {
    const { sub: userId } = jwt.verify(
      token,
      process.env.SECRET_TOKEN as Secret,
    ) as {
      sub: string
    }

    request.user = {
      id: userId,
    }

    next()
  } catch {
    throw new AppError('Invalid token', 401)
  }
}

export default isAuthenticated
