import { type RefreshToken } from '../infra/typeorm/entities/RefreshToken'
import { type ICreateRefreshTokenInput } from './ICreateRefreshTokenInput'

export interface IRefreshTokenRepository {
  create(data: ICreateRefreshTokenInput): Promise<RefreshToken>
  findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null>
  revoke(refreshToken: string, revokedAt: Date): Promise<boolean>
  delete(id: string): Promise<boolean>
}
