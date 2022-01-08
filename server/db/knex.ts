import { knex as initKnex } from 'knex'
import { Global } from 'interfaces/Global'

import knexConfig from './knexConfig'

export enum TableNames {
  CAPTURE_FEATURE = 'capture_feature',
  RAW_CAPTURE_FEATRURE = 'raw_capture_feature',
  RAW_CAPTURE_CLUSTER = 'raw_capture_cluster',
  REGION_ASSIGNMENT = 'region_assignment',
}

function connectToDb() {
  console.log('connecting to db')
  const connection = initKnex(knexConfig)
  ;(global as Global).dbConnection = connection
  return connection
}

function getDbConnection() {
  return (global as Global).dbConnection ?? connectToDb()
}

const knex = getDbConnection()
export default knex
