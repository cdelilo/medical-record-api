import { injectable } from 'tsyringe'
import { Repository } from 'typeorm'

import { DataSource } from '@shared/infra/typeorm'
import { User } from '../entities/User'
import { IUserRepository } from '@modules/authenticates/interfaces/IUserRepository'

@injectable()
class UserRepository implements IUserRepository {
  private readonly ormRepository: Repository<User>

  constructor() {
    this.ormRepository = DataSource.getRepository(User)
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.ormRepository.findOneBy({ email })
  }
}

export default UserRepository
