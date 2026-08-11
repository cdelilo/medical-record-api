import { type User } from '../infra/typeorm/entities/User'

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>
}
