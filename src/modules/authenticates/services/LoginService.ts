import { inject, injectable } from 'tsyringe'
import { randomUUID } from 'node:crypto'

import { type ILoginDTOInput } from '../interfaces/ILoginDTOInput'
import { type ILoginDTOOutput } from '../interfaces/ILoginDTOOutput'
import AppError from '@shared/utils/AppError'
import { compare } from 'bcryptjs'
import jwt, { type Secret, type SignOptions } from 'jsonwebtoken'
import { type IUserRepository } from '../interfaces/IUserRepository'
import { type IRefreshTokenRepository } from '../interfaces/IRefreshTokenRepository'

@injectable()
class LoginService {
  constructor(
    @inject('UserRepository')
    private readonly userRepository: IUserRepository,
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  public async execute({
    email,
    password,
  }: ILoginDTOInput): Promise<ILoginDTOOutput> {
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Email or password incorrect', 401)
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      throw new AppError('Email or password incorrect', 401)
    }

    const token = jwt.sign({}, process.env.SECRET_TOKEN as Secret, {
      subject: user.id,
      expiresIn: process.env.EXPIRES_IN_TOKEN as SignOptions['expiresIn'],
    })

    const refreshToken = jwt.sign(
      { email },
      process.env.SECRET_REFRESH_TOKEN as Secret,
      {
        subject: user.id,
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
      userId: user.id,
      token: refreshToken,
      expiresAt: refreshTokenExpiresDate,
    })

    return {
      token,
      refreshToken,
      user: {
        name: user.name,
        email: user.email,
      },
    }
  }
}

export default LoginService
