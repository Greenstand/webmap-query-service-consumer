import { knex as initKnex } from 'knex'
import { Global } from 'interfaces/Global'

import knexConfig from './knexConfig'

export const enum TableNames {
  CAPTURE_FEATURE = 'capture_feature',
  RAW_CAPTURE_FEATURE = 'raw_capture_feature',
  RAW_CAPTURE_CLUSTER = 'raw_capture_cluster',
  CAPTURE_CLUSTER = 'capture_cluster',
  REGION_ASSIGNMENT = 'region_assignment',
}

function connectToDb() {
  const connection = initKnex(knexConfig)
  ;(global as Global).dbConnection = connection
  return connection
}

function getDbConnection() {
  return (global as Global).dbConnection ?? connectToDb()
}

const knex = getDbConnection()
export default knex
