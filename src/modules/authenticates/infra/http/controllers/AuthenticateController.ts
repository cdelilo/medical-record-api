import { type Request, type Response } from 'express'
import ResponseHandler from '@shared/utils/ResponseHandler'
import LoginService from '@modules/authenticates/services/LoginService'
import { container } from 'tsyringe'
import RefreshTokenService from '@modules/authenticates/services/RefreshTokenService'
import LogoutService from '@modules/authenticates/services/LogoutService'

export default class AuthenticateController {
  public async login(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body

    const loginService = container.resolve(LoginService)
    const result = await loginService.execute({
      email,
      password,
    })

    return ResponseHandler.json(result, response)
  }

  public async refresh(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { refreshToken } = request.body

    const refreshTokenService = container.resolve(RefreshTokenService)
    const result = await refreshTokenService.execute(refreshToken)

    return ResponseHandler.json(result, response)
  }

  public async logout(request: Request, response: Response): Promise<Response> {
    const { refreshToken } = request.body

    const logoutService = container.resolve(LogoutService)
    await logoutService.execute(refreshToken)

    return response.status(204).end()
  }
}
