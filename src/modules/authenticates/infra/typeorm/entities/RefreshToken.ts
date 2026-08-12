import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm'
import { User } from './User'

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'char', length: 36 })
  userId: string

  @Column({
    type: 'varchar',
    length: 1024,
    unique: true,
    charset: 'ascii',
    collation: 'ascii_bin',
  })
  token: string

  @Column({ name: 'expires_at', type: 'datetime' })
  expiresAt: Date

  @Column({ name: 'revoked_at', type: 'datetime', nullable: true })
  revokedAt: Date | null

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date

  @ManyToOne(() => User, user => user.refreshTokens)
  @JoinColumn({ name: 'user_id' })
  user: Relation<User>
}
