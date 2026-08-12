import { injectable } from 'tsyringe'
import { Repository } from 'typeorm'

import { DataSource } from '@shared/infra/typeorm'

import { Patient } from '../entities/Patient'
import { IPatientRepository } from '@modules/patients/interfaces/IPatientRepository'
import {
  IFindPaginatedOutput,
  IPatient,
} from '@modules/patients/interfaces/IFindPaginatedOutput'
import { IFindWithAppointmentsByIdOutput } from '@modules/patients/interfaces/IFindWithAppointmentsById'
import { ICreateInput } from '@modules/patients/interfaces/ICreateInput'

@injectable()
class PatientRepository implements IPatientRepository {
  private readonly ormRepository: Repository<Patient>

  constructor() {
    this.ormRepository = DataSource.getRepository(Patient)
  }

  public async findById(id: string): Promise<Patient | null> {
    return this.ormRepository.findOneBy({ id })
  }

  public async findPaginated(
    page: number,
    limit: number,
  ): Promise<IFindPaginatedOutput> {
    const skip = (page - 1) * limit

    const [patients, total] = (await this.ormRepository.findAndCount({
      select: {
        id: true,
        name: true,
        phone: true,
        birthDate: true,
        sex: true,
      },
      skip,
      take: limit,
    })) as unknown as [IPatient[], number]

    return {
      patients,
      total,
    }
  }

  public async findWithAppointmentsById(id: string) {
    const data = await this.ormRepository.findOne({
      select: {
        id: true,
        name: true,
        phone: true,
        birthDate: true,
        sex: true,
        heightM: true,
        weightKg: true,
        appointments: {
          id: true,
          scheduledAt: true,
          notes: true,
        },
      },
      relations: {
        appointments: true,
      },
      where: {
        id,
      },
    })

    return data as IFindWithAppointmentsByIdOutput | null
  }

  public async findWithDeletedById(id: string): Promise<Patient | null> {
    return this.ormRepository.findOne({ where: { id }, withDeleted: true })
  }

  public async create(data: ICreateInput): Promise<Patient> {
    const patient = this.ormRepository.create(data)

    await this.ormRepository.save(patient)

    return patient
  }

  public async save(data: Patient): Promise<Patient> {
    return this.ormRepository.save(data)
  }
}

export default PatientRepository
