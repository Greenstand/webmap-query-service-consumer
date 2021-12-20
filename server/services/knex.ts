import { Knex, knex as initDb } from 'knex'
import log from 'loglevel'

// move this to different file if exported
export type Global = { __DB_CONNECTION?: Knex<any, unknown[]> }

export enum TableNames {
  CAPTURE_FEATURE = 'capture_feature',
  RAW_CAPTURE_FEATRURE = 'raw_capture_feature',
  RAW_CAPTURE_CLUSTER = 'raw_capture_cluster',
  REGION_ASSIGNMENT = 'region_assignment',
}

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

function connectToDb() {
  console.log('connecting to db')
  const connection = initDb(knexConfig)
  ;(global as Global).__DB_CONNECTION = connection
  return connection
}

export function getDbConnection() {
  return (global as Global).__DB_CONNECTION ?? connectToDb()
}

const knex = getDbConnection()
export default knex

export async function batchUpdate<T>(
  ids: string[],
  updateObject: T,
  tableName: TableNames,
) {
  log.log('batchUpdate: ', updateObject)
  const objectCopy = { ...updateObject } as Omit<T, 'id'>
  const result = await knex(tableName).update(objectCopy).whereIn('id', ids)
  log.log('result of update:', result)
}

export function truncateTables(tables: TableNames[]) {
  return Promise.all(
    tables.map((table) => knex.raw('truncate table ' + table + ' cascade')),
  )
}
