import { Knex, knex as initDb } from 'knex'
import log from 'loglevel'
import { TableName } from 'models/base'

const knexConfig: Knex.Config = {
  client: 'pg',
  debug: process.env.NODE_LOG_LEVEL === 'debug',
  connection: process.env.DATABASE_URL,
  pool: { min: 0, max: 10 },
}

log.debug(process.env.DATABASE_SCHEMA)
if (process.env.DATABASE_SCHEMA) {
  log.info('setting a schema')
  knexConfig.searchPath = [process.env.DATABASE_SCHEMA, 'public']
}
log.debug(knexConfig.searchPath)

// move this to different file if exported
export type Global = { __DB_CONNECTION?: Knex<any, unknown[]> }

// only allow 1 knex instance
export function initKnex() {
  // init global db object if needed
  const connectionExists = !!(global as Global).__DB_CONNECTION
  if (!connectionExists) {
    console.log('Creating connection')
    ;(global as Global).__DB_CONNECTION ??= initDb(knexConfig)
  }

  // assert that DB connection is not null
  return (global as Global).__DB_CONNECTION!
}

const knex = initKnex()

export function truncateTables(tables: TableName[]) {
  return Promise.all(
    tables.map((table) => knex.raw('truncate table ' + table + ' cascade')),
  )
}

export default knex
