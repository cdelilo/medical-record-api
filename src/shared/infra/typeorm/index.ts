import 'dotenv/config'
import { DataSource } from 'typeorm'

const isDevEnv = process.env.NODE_ENV === 'development'

const rootDir = isDevEnv ? 'src' : 'dist'
const ext = isDevEnv ? 'ts' : 'js'

const Connection = new DataSource({
  type: 'mysql',
  synchronize: false,
  timezone: 'Z',
  host: `${process.env.MYSQL_HOST}`,
  port: Number(process.env.MYSQL_PORT),
  username: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASSWORD}`,
  database: `${process.env.MYSQL_DATABASE}`,
  entities: [`./${rootDir}/modules/**/infra/typeorm/entities/*.${ext}`],
  migrations: [`./${rootDir}/shared/infra/typeorm/migrations/*.${ext}`],
})

export { Connection as DataSource }
