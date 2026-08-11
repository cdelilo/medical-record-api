import 'reflect-metadata'
import 'dotenv/config'

import { hash } from 'bcryptjs'
import { randomUUID } from 'node:crypto'

import { UserRole } from '@modules/users/enums/UserRole'
import { User } from '@modules/users/infra/typeorm/entities/User'
import { DataSource } from '@shared/infra/typeorm'

const getRequiredSeedValue = (variableName: string): string => {
  const value = process.env[variableName]

  if (value === undefined || value.trim() === '') {
    throw new Error(`Missing required environment variable: ${variableName}`)
  }

  return value.trim()
}

const execute = async (): Promise<void> => {
  const seedDoctor = {
    name: getRequiredSeedValue('SEED_DOCTOR_NAME'),
    email: getRequiredSeedValue('SEED_DOCTOR_EMAIL').toLowerCase(),
    password: getRequiredSeedValue('SEED_DOCTOR_PASSWORD'),
  }

  await DataSource.initialize()

  const userRepository = DataSource.getRepository(User)
  const existingDoctor = await userRepository.findOneBy({
    email: seedDoctor.email,
  })

  if (existingDoctor) {
    return
  }

  const passwordHash = await hash(seedDoctor.password, 12)

  const doctor = userRepository.create({
    id: randomUUID(),
    name: seedDoctor.name,
    email: seedDoctor.email,
    password: passwordHash,
    role: UserRole.DOCTOR,
  })

  await userRepository.save(doctor)
}

try {
  await execute()
} catch (error) {
  console.error('Failed to run doctor seed', error)
  process.exitCode = 1
} finally {
  if (DataSource.isInitialized) {
    await DataSource.destroy()
  }
}
