import { inject, injectable } from 'tsyringe'

import { IPatientRepository } from '../interfaces/IPatientRepository'
import { IListPatientsDTOInput } from '../interfaces/IListPatientsDTOInput'
import { IListPatientsDTOOutput } from '../interfaces/IListPatientsDTOOutput'

@injectable()
class ListPatientsService {
  constructor(
    @inject('PatientRepository')
    private readonly patientRepository: IPatientRepository,
  ) {}

  public async execute({
    page,
    limit,
  }: IListPatientsDTOInput): Promise<IListPatientsDTOOutput> {
    const { patients, total } = await this.patientRepository.findPaginated(
      page,
      limit,
    )

    return {
      data: patients,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export default ListPatientsService
