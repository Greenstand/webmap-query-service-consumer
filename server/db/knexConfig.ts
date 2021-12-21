import { Knex } from 'knex'

const schema = process.env.DATABASE_SCHEMA

const knexConfig: Knex.Config = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 10 },
  searchPath: schema ? [schema, 'public'] : undefined,
}

export default knexConfig
