import 'reflect-metadata'
import 'dotenv/config'

import { MySQLConnection } from '../typeorm'
import { server } from './app'

MySQLConnection.initialize()
  .then(() => {
    console.log('Data Source has been initialized!')

    server.listen(process.env.APP_PORT, () => {
      console.log(`Server started on port ${process.env.APP_PORT}! 🏆`)
    })
  })
  .catch(err => {
    console.error('Error during Data Source initialization', err)
  })
