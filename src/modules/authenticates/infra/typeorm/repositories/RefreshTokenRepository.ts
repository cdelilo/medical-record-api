import { injectable } from 'tsyringe'
import { IsNull, Repository } from 'typeorm'

import { DataSource } from '@shared/infra/typeorm'
import { IRefreshTokenRepository } from '@modules/authenticates/interfaces/IRefreshTokenRepository'
import { RefreshToken } from '../entities/RefreshToken'
import { ICreateRefreshTokenInput } from '@modules/authenticates/interfaces/ICreateRefreshTokenInput'

@injectable()
class RefreshTokenRepository implements IRefreshTokenRepository {
  private readonly ormRepository: Repository<RefreshToken>

  constructor() {
    this.ormRepository = DataSource.getRepository(RefreshToken)
  }

  public async findByUserIdAndRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<RefreshToken | null> {
    return this.ormRepository.findOneBy({
      userId,
      token: refreshToken,
      revokedAt: IsNull(),
    })
  }

  public async create(data: ICreateRefreshTokenInput): Promise<RefreshToken> {
    const refreshToken = this.ormRepository.create(data)

    await this.ormRepository.save(refreshToken)

    return refreshToken
  }

  public async revoke(refreshToken: string, revokedAt: Date): Promise<boolean> {
    const result = await this.ormRepository.update(
      {
        token: refreshToken,
        revokedAt: IsNull(),
      },
      { revokedAt },
    )

    return !!result.affected
  }

  public async delete(id: string): Promise<boolean> {
    const result = await this.ormRepository.delete({ id })

    return !!result.affected
  }
}

export default RefreshTokenRepository
