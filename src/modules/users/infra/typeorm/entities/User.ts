import { UserRole } from '@modules/users/enums/UserRole'
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 150, type: 'varchar' })
  name: string

  @Column({ length: 254, unique: true, type: 'varchar' })
  email: string

  @Column({ length: 255, type: 'varchar' })
  password: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.DOCTOR,
  })
  role: UserRole

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
