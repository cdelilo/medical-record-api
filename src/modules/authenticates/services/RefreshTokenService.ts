import { inject, injectable } from 'tsyringe'
import { randomUUID } from 'node:crypto'

import AppError from '@shared/utils/AppError'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { type IRefreshTokenRepository } from '../interfaces/IRefreshTokenRepository'
import { type IRefreshTokenDTOOutput } from '../interfaces/IRefreshTokenDTOOutput'
import { type IVerifyOutput } from '../interfaces/IVerifyOutput'

@injectable()
class RefreshTokenService {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  public async execute(token: string): Promise<IRefreshTokenDTOOutput> {
    let payload: IVerifyOutput

    try {
      payload = jwt.verify(
        token,
        process.env.SECRET_REFRESH_TOKEN as Secret,
      ) as IVerifyOutput
    } catch {
      throw new AppError('Invalid or expired refresh token', 401)
    }

    const { email, sub } = payload

    const userId = sub

    const refreshToken =
      await this.refreshTokenRepository.findByUserIdAndRefreshToken(
        userId,
        token,
      )

    if (!refreshToken) {
      throw new AppError('Invalid or expired refresh token', 401)
    }

    const deleted = await this.refreshTokenRepository.delete(refreshToken.id)

    if (!deleted) {
      throw new AppError('Invalid or expired refresh token', 401)
    }

    const newRefreshToken = jwt.sign(
      { email },
      process.env.SECRET_REFRESH_TOKEN as Secret,
      {
        subject: userId,
        jwtid: randomUUID(),
        expiresIn: process.env
          .EXPIRES_IN_REFRESH_TOKEN as SignOptions['expiresIn'],
      },
    )

    const expiresRefreshTokenDays = Number(
      process.env.EXPIRES_REFRESH_TOKEN_DAYS,
    )

    const refreshTokenExpiresDate = new Date(
      Date.now() + expiresRefreshTokenDays * 24 * 60 * 60 * 1000,
    )

    await this.refreshTokenRepository.create({
      userId,
      token: newRefreshToken,
      expiresAt: refreshTokenExpiresDate,
    })

    const newToken = jwt.sign({}, process.env.SECRET_TOKEN as Secret, {
      subject: userId,
      expiresIn: process.env.EXPIRES_IN_TOKEN as SignOptions['expiresIn'],
    })

    return {
      token: newToken,
      refreshToken: newRefreshToken,
    }
  }
}

export default RefreshTokenService
