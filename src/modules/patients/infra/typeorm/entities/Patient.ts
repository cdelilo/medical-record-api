import { Appointment } from '@modules/appointments/infra/typeorm/entities/Appointment'
import { PatientSex } from '@modules/patients/enums/PatientSex'
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  Relation,
} from 'typeorm'

@Entity('patients')
export class Patient {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar', length: 150, nullable: true })
  name: string | null

  @Column({ type: 'varchar', length: 16, nullable: true })
  phone: string | null

  @Column({ type: 'varchar', length: 254, nullable: true })
  email: string | null

  @Column({ name: 'birth_date', type: 'date', nullable: true })
  birthDate: Date | null

  @Column({ type: 'enum', enum: PatientSex, nullable: true })
  sex: PatientSex | null

  @Column({
    name: 'height_m',
    type: 'decimal',
    precision: 3,
    scale: 2,
    nullable: true,
  })
  heightM: number | null

  @Column({
    name: 'weight_kg',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  weightKg: number | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @OneToMany(() => Appointment, appointment => appointment.patient)
  appointments: Relation<Appointment[]>
}
