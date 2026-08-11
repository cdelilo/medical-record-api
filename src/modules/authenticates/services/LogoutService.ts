import { inject, injectable } from 'tsyringe'

import { type IRefreshTokenRepository } from '../interfaces/IRefreshTokenRepository'

@injectable()
class LogoutService {
  constructor(
    @inject('RefreshTokenRepository')
    private readonly refreshTokenRepository: IRefreshTokenRepository,
  ) {}

  public async execute(token: string): Promise<void> {
    await this.refreshTokenRepository.revoke(token, new Date())
  }
}

export default LogoutService
