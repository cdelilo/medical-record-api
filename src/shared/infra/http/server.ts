import 'reflect-metadata'
import 'dotenv/config'

import { DataSource } from '../typeorm'
import { server } from './app'

DataSource.initialize()
  .then(() => {
    console.log('DataSource has been initialized!')

    server.listen(process.env.APP_PORT, () => {
      console.log(`Server started on port ${process.env.APP_PORT}! 🏆`)
    })
  })
  .catch(err => {
    console.error('Error during DataSource initialization', err)
  })
