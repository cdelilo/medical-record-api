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
  }: IListPatientsDTOInput): Promise<IListPatientsDTOOutput[]> {
    return this.patientRepository.findPaginated(page, limit)
  }
}

export default ListPatientsService
