import { Patient } from '@modules/patients/infra/typeorm/entities/Patient'
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'patient_id', type: 'char', length: 36 })
  patientId: string

  @Column({ name: 'scheduled_at', type: 'datetime' })
  scheduledAt: Date

  @Column({ type: 'text', nullable: true })
  notes: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @ManyToOne(() => Patient, patient => patient.appointments)
  @JoinColumn({ name: 'patient_id' })
  patient: Patient
}
