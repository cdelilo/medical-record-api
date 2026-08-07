import 'dotenv/config'
import { DataSource } from 'typeorm'

const isDevEnv = process.env.NODE_ENV === 'development'

const rootDir = isDevEnv ? 'src' : 'dist'
const ext = isDevEnv ? 'ts' : 'js'

const MySQLConnection = new DataSource({
  type: 'mysql',
  host: `${process.env.MYSQL_HOST}`,
  port: Number(process.env.MYSQL_PORT),
  username: `${process.env.MYSQL_USER}`,
  password: `${process.env.MYSQL_PASSWD}`,
  database: `${process.env.MYSQL_DATABASE}`,
  entities: [`./${rootDir}/modules/**/infra/typeorm/entities/*.${ext}`],
})

export { MySQLConnection }
