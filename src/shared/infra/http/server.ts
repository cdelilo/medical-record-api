import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from '../typeorm'
import { server } from './app'

const bootstrap = async (): Promise<void> => {
  await DataSource.initialize()

  console.log('DataSource has been initialized!')

  const port = Number(process.env.APP_PORT)

  server.listen(port, () => {
    console.log(`Server started on port ${port}! 🏆`)
  })
}

try {
  await bootstrap()
} catch (error) {
  console.error('Application startup failed', error)
  process.exitCode = 1
}
